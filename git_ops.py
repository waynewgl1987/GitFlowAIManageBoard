#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
git_ops.py — Git helper functions for Git Manage Board.
All git operations, state globals, and streaming helpers live here.
"""

import os, json, subprocess, socket, configparser, threading

PORT    = 8989
_MSGLOG = []          # in-memory operation log
_PUSH_JOBS = {}       # {job_id: {lines:[], done:bool, ok:bool, error:str, authRequired:bool}}
_PUSH_JOBS_LOCK = threading.Lock()
_MSGLOG_LOCK    = threading.Lock()


def _get_git_env(extra=None):
    """Return a copy of os.environ with git interactive prompts disabled."""
    env = os.environ.copy()
    env["GIT_TERMINAL_PROMPT"] = "0"
    env["GIT_ASKPASS"] = "echo"
    if extra:
        env.update(extra)
    return env


def _load_app_config():
    """Read config.ini next to this script. Returns (app_name, app_version)."""
    cfg = configparser.ConfigParser()
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    if os.path.exists(cfg_path):
        cfg.read(cfg_path, encoding="utf-8")
    name    = cfg.get("app", "name",    fallback="Git Manage Board")
    version = cfg.get("app", "version", fallback="v1.0.0")
    return name, version


def _run(cmd, cwd=None, timeout=120, env=None):
    """Run a git command and return (stdout, stderr, returncode)."""
    run_env = _get_git_env(env)
    try:
        r = subprocess.run(cmd, capture_output=True,
                           cwd=cwd or os.getcwd(), timeout=timeout, env=run_env)
        stdout = r.stdout.decode("utf-8", errors="replace").strip()
        stderr = r.stderr.decode("utf-8", errors="replace").strip()
        return stdout, stderr, r.returncode
    except subprocess.TimeoutExpired:
        return "", f"git command timed out after {timeout}s: {' '.join(cmd)}", -1
    except Exception as e:
        return "", str(e), -1


def _run_push_streaming(job_id, branch, extra_env=None, force=False, is_ssh=False):
    """Run git push in a background thread, streaming output lines into _PUSH_JOBS[job_id]."""
    import time as _time
    run_env = _get_git_env(extra_env)

    with _PUSH_JOBS_LOCK:
        job = _PUSH_JOBS[job_id]

    def _append(line, prefix=''):
        line = (line or '').rstrip('\r\n')
        if line:
            ts = _time.strftime('%H:%M:%S')
            with _PUSH_JOBS_LOCK:
                job['lines'].append(f'[{ts}] {prefix}{line}' if prefix else f'[{ts}] {line}')

    def _append_raw(line):
        """Append without timestamp (for blank spacers / separators)."""
        line = (line or '').rstrip('\r\n')
        if line:
            with _PUSH_JOBS_LOCK:
                job['lines'].append(line)

    push_base = ["git", "push", "--verbose", "--progress"]
    if force:
        push_base.append("--force-with-lease")

    try:
        url_out, _, _ = _run(["git", "remote", "get-url", "origin"])
        remote_url = url_out.strip()
    except Exception:
        remote_url = "origin"

    def _try_push(cmd, timeout=120):
        _append_raw('$ ' + ' '.join(cmd))
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, cwd=os.getcwd(), env=run_env)
        except Exception as e:
            _append('ERROR: ' + str(e))
            return -1, False

        last_output = [_time.time()]
        def rd(stream):
            for l in stream:
                l = l.rstrip('\r\n')
                if l:
                    _append(l)
                    last_output[0] = _time.time()

        t1 = threading.Thread(target=rd, args=(proc.stdout,), daemon=True)
        t2 = threading.Thread(target=rd, args=(proc.stderr,), daemon=True)
        t1.start(); t2.start()

        deadline = _time.time() + timeout
        while True:
            try:
                proc.wait(timeout=10)
                break
            except subprocess.TimeoutExpired:
                elapsed = int(_time.time() - last_output[0])
                remaining = int(deadline - _time.time())
                if remaining <= 0:
                    proc.kill()
                    _append(f'⏱ Push timed out after {timeout}s — no response from server. Check your network.')
                    t1.join(); t2.join()
                    return -1, True
                if elapsed >= 10:
                    _append(f'⏳ Still waiting... ({int(_time.time() - last_output[0])}s since last output, {remaining}s until timeout)')

        t1.join(); t2.join()
        return proc.returncode, False

    try:
        _append_raw('─' * 52)
        _append(f'📦 Repo  : {remote_url}')
        _append(f'🌿 Branch: {branch}')
        _append(f'{"⚠️  Force push (--force-with-lease)" if force else "🚀 Normal push"}')
        _append_raw('─' * 52)

        rc, timed_out = _try_push(push_base + ["origin", branch])

        if rc != 0 and not timed_out:
            with _PUSH_JOBS_LOCK:
                combined_so_far = '\n'.join(job['lines'])
            no_upstream = any(x in combined_so_far.lower() for x in [
                "no upstream", "has no upstream", "set-upstream", "set the upstream"])
            if no_upstream:
                _append_raw('')
                _append(f'ℹ️  Branch has no upstream tracking. Retrying with: git push origin HEAD:{branch}')
                _append('   (This sets the remote branch to the same name — only affects branch "{}")'.format(branch))
                _append_raw('')
                rc, timed_out = _try_push(push_base + ["origin", f"HEAD:{branch}"])

        with _PUSH_JOBS_LOCK:
            combined = '\n'.join(job['lines'])
            job['done'] = True
            job['ok'] = (rc == 0)
            if not is_ssh:
                is_auth_err = any(x in combined.lower() for x in [
                    "authentication failed", "could not read username",
                    "invalid username", "403", "401", "permission denied"])
                job['authRequired'] = is_auth_err and rc != 0
            if rc != 0:
                job['error'] = combined
    except Exception as e:
        with _PUSH_JOBS_LOCK:
            job['done'] = True
            job['ok'] = False
            job['error'] = str(e)


def _run_gitop_streaming(job_id, op, mode=None):
    """Stream git fetch or pull into _PUSH_JOBS[job_id] (background thread)."""
    import time as _time
    run_env = _get_git_env()

    with _PUSH_JOBS_LOCK:
        job = _PUSH_JOBS[job_id]

    def _append(line):
        line = (line or '').rstrip('\r\n')
        if line:
            ts = _time.strftime('%H:%M:%S')
            with _PUSH_JOBS_LOCK:
                job['lines'].append(f'[{ts}] {line}')

    def _append_raw(line):
        line = (line or '').rstrip('\r\n')
        if line:
            with _PUSH_JOBS_LOCK:
                job['lines'].append(line)

    try:
        branch_name = current_branch()
        url_out, _, _ = _run(["git", "remote", "get-url", "origin"])
        remote_url = url_out.strip() or "origin"

        _append_raw('─' * 52)
        _append(f'📦 Repo  : {remote_url}')
        _append(f'🌿 Branch: {branch_name}')

        if op == 'fetch':
            _append('⬇️ Operation: fetch --all --prune --verbose')
            cmd = ["git", "fetch", "--all", "--prune", "--verbose"]
        else:
            mode_str = mode or 'merge'
            if mode_str == 'rebase':
                _append('⬇️ Operation: pull --rebase --verbose')
                cmd = ["git", "pull", "--rebase", "--verbose", "origin", branch_name]
            elif mode_str == 'ff':
                _append('⬇️ Operation: pull --ff-only --verbose')
                cmd = ["git", "pull", "--ff-only", "--verbose", "origin", branch_name]
            else:
                _append('⬇️ Operation: pull (merge) --verbose')
                cmd = ["git", "pull", "--no-rebase", "--verbose", "origin", branch_name]

        _append_raw('─' * 52)
        _append_raw('$ ' + ' '.join(cmd))

        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, cwd=os.getcwd(), env=run_env)
        except Exception as e:
            _append(f'ERROR: {e}')
            with _PUSH_JOBS_LOCK:
                job['done'] = True; job['ok'] = False; job['error'] = str(e)
            return

        def rd(stream):
            for l in stream:
                _append(l)

        t1 = threading.Thread(target=rd, args=(proc.stdout,), daemon=True)
        t2 = threading.Thread(target=rd, args=(proc.stderr,), daemon=True)
        t1.start(); t2.start()

        try:
            proc.wait(timeout=120)
        except subprocess.TimeoutExpired:
            proc.kill()
            _append('⏱ Operation timed out after 120s — check your network.')

        t1.join(); t2.join()
        rc = proc.returncode
        with _PUSH_JOBS_LOCK:
            job['done'] = True
            job['ok'] = (rc == 0)
            if rc != 0:
                job['error'] = '\n'.join(job['lines'])
    except Exception as e:
        with _PUSH_JOBS_LOCK:
            job['done'] = True
            job['ok'] = False
            job['error'] = str(e)


def current_branch():
    """Return the name of the current git branch."""
    out, _, rc = _run(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    return out if rc == 0 else "unknown"


def display_branch():
    """Return branch name for display."""
    return current_branch()


def get_project_info():
    """Return project display name, remote repo slug, app name and version from config."""
    app_name, app_version = _load_app_config()
    dir_name = os.path.basename(os.path.abspath(os.getcwd()))
    remote_slug = ""
    url_out, _, rc = _run(["git", "remote", "get-url", "origin"])
    if rc == 0 and url_out.strip():
        url = url_out.strip()
        url = url.rstrip("/")
        if url.endswith(".git"):
            url = url[:-4]
        parts = url.replace(":", "/").split("/")
        if len(parts) >= 2:
            remote_slug = parts[-2] + "/" + parts[-1]
    return {"dir": dir_name, "remote": remote_slug, "app_name": app_name, "app_version": app_version}


def _ref_exists(name):
    """Return True if the git ref exists."""
    _, _, rc = _run(["git", "rev-parse", "--verify", name])
    return rc == 0


def _strip_origin_prefix(name):
    """Strip 'origin/' prefix from branch name if present."""
    return name[len("origin/"):] if name.startswith("origin/") else name


def _resolve_ref(name):
    """Resolve a branch name to a valid git ref. Tries as-is, then with origin/ prefix."""
    if _ref_exists(name):
        return name
    if _ref_exists(f"origin/{name}"):
        return f"origin/{name}"
    return name


def _resolve_ref_for_compare(name, source="auto"):
    """Resolve compare refs while respecting whether the user picked Local or Remote."""
    source = (source or "auto").strip().lower()
    raw = (name or "").strip()
    if not raw:
        return raw

    if source == "remote":
        remote = raw if raw.startswith("origin/") else f"origin/{raw}"
        return remote if _ref_exists(remote) else remote

    if source == "local":
        local = _strip_origin_prefix(raw)
        return local if _ref_exists(local) else local

    if _ref_exists(raw):
        return raw
    origin = raw if raw.startswith("origin/") else f"origin/{raw}"
    if _ref_exists(origin):
        return origin
    local = _strip_origin_prefix(raw)
    if local != raw and _ref_exists(local):
        return local
    return raw


def get_branches(page=1, per_page=20):
    """Return local and remote branches with pagination."""
    cur = current_branch()
    branches = {"current": cur, "local": [], "remote": []}
    fmt = "%(refname:short)||%(committerdate:format:%Y-%m-%d %H:%M)||%(committerdate:unix)"
    out, _, _ = _run(["git", "for-each-ref", "--format=" + fmt, "refs/heads"])
    local_list = []
    for l in out.splitlines():
        parts = l.strip().split("||", 2)
        if len(parts) == 3 and parts[0]:
            ts = int(parts[2]) if parts[2].strip().isdigit() else 0
            local_list.append({"name": parts[0], "date": parts[1], "ts": ts})
    out, _, _ = _run(["git", "for-each-ref", "--format=" + fmt, "refs/remotes"])
    all_remote = []
    for l in out.splitlines():
        parts = l.strip().split("||", 2)
        if len(parts) == 3 and parts[0] and "HEAD" not in parts[0]:
            ts = int(parts[2]) if parts[2].strip().isdigit() else 0
            all_remote.append({"name": parts[0], "date": parts[1], "ts": ts})
    branches["local"] = local_list
    total_remote = len(all_remote)
    total_local = len(local_list)
    if per_page > 0:
        skip = (page - 1) * per_page
        branches["remote"] = all_remote[skip:skip + per_page]
    else:
        branches["remote"] = all_remote
    branches["total_remote"] = total_remote
    branches["total_local"] = total_local
    branches["page"] = page
    branches["per_page"] = per_page
    return branches


def has_uncommitted():
    """Return True if there are uncommitted changes."""
    out, _, _ = _run(["git", "status", "--porcelain"])
    return bool(out.strip())


def stash_changes():
    """Run git stash."""
    return _run(["git", "stash"])


def stash_list(page=1, per_page=10):
    """List stashes with pagination."""
    out, _, _ = _run(["git", "stash", "list"])
    all_stashes = [l.strip() for l in out.splitlines() if l.strip()]
    total = len(all_stashes)
    skip = (page - 1) * per_page if per_page > 0 else 0
    items = all_stashes[skip:skip + per_page] if per_page > 0 else all_stashes
    return {"stashes": items, "total": total, "page": page, "per_page": per_page}


def stash_diff(idx="0"):
    """Show diff of a stash entry."""
    out, _, _ = _run(["git", "stash", "show", "-p", f"stash@{{{idx}}}"])
    return out


def commit_diff(commit_hash):
    """Show diff for a specific commit."""
    out, _, _ = _run(["git", "show", "--stat", "-p", commit_hash])
    return out


def search_diff_code(pattern, max_count=200):
    """Search commits whose diffs contain lines matching pattern (regex, case-insensitive)."""
    if not pattern:
        return {"commits": [], "total": 0}
    branch = current_branch()
    fmt = "--pretty=format:%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"
    args = ["git", "log", branch, date_fmt, fmt,
            "--regexp-ignore-case", f"-G{pattern}", f"-n{max_count}"]
    out, err, rc = _run(args)
    commits = []
    for line in out.splitlines():
        parts = line.split("||", 3)
        if len(parts) == 4:
            commits.append({
                "hash": parts[0], "short_hash": parts[0][:7],
                "author": parts[1], "date": parts[2], "message": parts[3]
            })
    if rc != 0 and not commits:
        return {"commits": [], "total": 0, "error": err or "git error"}
    return {"commits": commits, "total": len(commits)}


def stash_pop(idx="0"):
    """Pop a stash entry."""
    return _run(["git", "stash", "pop", f"stash@{{{idx}}}"])


def stash_drop(idx="0"):
    """Drop a stash entry."""
    return _run(["git", "stash", "drop", f"stash@{{{idx}}}"])


def file_commit_diff(commit_hash, file_path):
    """Diff of a specific file introduced by a specific commit."""
    out, _, _ = _run(["git", "show", "-p", "--stat", commit_hash, "--", file_path])
    return out


def checkout_branch(name):
    """Checkout a branch, handling remote tracking branches."""
    branch = (name or "").strip()
    if not branch:
        return "", "No branch specified", -1
    if branch.startswith("origin/"):
        local_branch = _strip_origin_prefix(branch)
        if _ref_exists(local_branch):
            return _run(["git", "checkout", local_branch])
        return _run(["git", "checkout", "-b", local_branch, "--track", branch])
    return _run(["git", "checkout", branch])


def create_branch(name, base=None):
    """创建新分支，可选基于 base 分支"""
    cmd = ["git", "checkout", "-b", name]
    if base:
        cmd.append(base)
    return _run(cmd)


def delete_branch_local(name, force=False):
    """删除本地分支；force=True 时用 -D 强制删除未合并分支"""
    flag = "-D" if force else "-d"
    return _run(["git", "branch", flag, name])


def delete_branch_remote(name):
    """删除远端分支，name 应为不含 origin/ 前缀的短名"""
    short = name.replace("origin/", "", 1) if name.startswith("origin/") else name
    return _run(["git", "push", "origin", "--delete", short])


def fetch():
    """Fetch all remotes with pruning."""
    out, err, rc = _run(["git", "fetch", "--all", "--prune", "--verbose"])
    combined = (out + "\n" + err).strip()
    return combined, err, rc


def pull_current(mode="merge"):
    """拉取最新代码（--verbose 返回完整日志）"""
    branch = current_branch()
    if mode == "rebase":
        out, err, rc = _run(["git", "pull", "--rebase", "--verbose", "origin", branch])
        if rc != 0: out, err, rc = _run(["git", "pull", "--rebase", "--verbose", "origin", "HEAD"])
    elif mode == "ff":
        out, err, rc = _run(["git", "pull", "--ff-only", "--verbose", "origin", branch])
        if rc != 0: out, err, rc = _run(["git", "pull", "--ff-only", "--verbose", "origin", "HEAD"])
    else:
        out, err, rc = _run(["git", "pull", "--no-rebase", "--verbose", "origin", branch])
        if rc != 0:
            out2, err2, rc2 = _run(["git", "pull", "--verbose"])
            if rc2 == 0: return (out2 + "\n" + err2).strip(), err2, rc2
            out, err, rc = _run(["git", "pull", "--no-rebase", "--verbose", "origin", "HEAD"])
    combined = (out + "\n" + err).strip()
    return combined, err, rc


def set_upstream():
    """Set tracking upstream for current branch."""
    b = current_branch()
    return _run(["git", "branch", "--set-upstream-to", f"origin/{b}", b])


def push_set_upstream():
    """Push current branch and set upstream."""
    b = current_branch()
    return _run(["git", "push", "-u", "origin", b])


def get_conflicts():
    """Return list of files with merge conflicts."""
    out, _, _ = _run(["git", "diff", "--name-only", "--diff-filter=U"])
    return [f.strip() for f in out.splitlines() if f.strip()]


def get_conflict_detail(fp):
    """Return conflict detail for a file: raw content, ours, theirs, and parsed blocks."""
    try:
        with open(fp, "r", encoding="utf-8", errors="replace") as f:
            raw = f.read()
    except Exception:
        raw = ""
    ours, _, _ = _run(["git", "show", f":2:{fp}"])
    theirs, _, _ = _run(["git", "show", f":3:{fp}"])
    blocks = _parse_blocks(raw)
    return {"raw": raw, "ours": ours, "theirs": theirs, "blocks": blocks}


def _parse_blocks(raw):
    """Parse conflict markers in raw file content into structured blocks."""
    blocks = []; lines = raw.split("\n"); i = 0; cur = {"type": "normal", "lines": []}

    def flush():
        if cur["lines"]: blocks.append(cur)
        return {"type": "normal", "lines": []}

    while i < len(lines):
        l = lines[i]
        if l.startswith("<<<<<<<"):
            flush(); cur = {"type": "conflict", "ours": "", "theirs": ""}; ours = []; i += 1
            while i < len(lines) and not lines[i].startswith("======="):
                ours.append(lines[i]); i += 1
            i += 1; theirs = []
            while i < len(lines) and not lines[i].startswith(">>>>>>>"):
                theirs.append(lines[i]); i += 1
            i += 1; cur["ours"] = "\n".join(ours); cur["theirs"] = "\n".join(theirs)
            blocks.append(cur); cur = {"type": "normal", "lines": []}
        else:
            cur["lines"].append(l); i += 1
    flush()
    return blocks


def _get_merge_type():
    """Return the current in-progress merge type: 'merge', 'rebase', 'cherry-pick', or None."""
    cwd = os.getcwd()
    if os.path.exists(os.path.join(cwd, ".git", "CHERRY_PICK_HEAD")):
        return "cherry-pick"
    if os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
       os.path.exists(os.path.join(cwd, ".git", "rebase-apply")):
        return "rebase"
    if os.path.exists(os.path.join(cwd, ".git", "MERGE_HEAD")):
        return "merge"
    return None


def _get_merge_default_msg():
    """Return the default commit message for the current merge (reads .git/MERGE_MSG)."""
    cwd = os.getcwd()
    merge_msg_file = os.path.join(cwd, ".git", "MERGE_MSG")
    if os.path.exists(merge_msg_file):
        try:
            with open(merge_msg_file, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            pass
    return "Merge resolved"


def _complete_merge_step():
    """After all conflicts are resolved, complete the merge/rebase/cherry-pick."""
    env = {"GIT_EDITOR": "true"}
    cwd = os.getcwd()
    if os.path.exists(os.path.join(cwd, ".git", "CHERRY_PICK_HEAD")):
        return _run(["git", "cherry-pick", "--continue"], env=env)
    if os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
       os.path.exists(os.path.join(cwd, ".git", "rebase-apply")):
        return _run(["git", "rebase", "--continue"], env=env)
    if os.path.exists(os.path.join(cwd, ".git", "MERGE_HEAD")):
        return _run(["git", "commit", "--no-edit"], env=env)
    return "", "No merge/rebase/cherry-pick in progress", -1


def resolve_conflict(fp, resolution):
    """Resolve a conflict file with 'ours', 'theirs', or custom content."""
    if resolution == "ours": _run(["git", "checkout", "--ours", fp])
    elif resolution == "theirs": _run(["git", "checkout", "--theirs", fp])
    else:
        with open(fp, "w", encoding="utf-8") as f: f.write(resolution)
    out, err, rc = _run(["git", "add", fp])
    all_resolved = rc == 0 and not get_conflicts()
    return out, err, rc, all_resolved


def get_file_commits(file_path, page=1, per_page=20):
    """Get commit history for a specific file."""
    branch = current_branch()
    fmt = "--pretty=format:%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"
    skip = (page - 1) * per_page if per_page > 0 else 0
    if per_page > 0:
        args = ["git", "log", branch, date_fmt, fmt, f"--skip={skip}", f"-n{per_page}", "--", file_path]
    else:
        args = ["git", "log", branch, date_fmt, fmt, "--", file_path]
    out, _, _ = _run(args)
    commits = []
    for line in out.splitlines():
        parts = line.split("||", 3)
        if len(parts) == 4:
            commits.append({"hash": parts[0], "short_hash": parts[0][:7],
                            "author": parts[1], "date": parts[2], "message": parts[3]})
    total_out, _, _ = _run(["git", "rev-list", "--count", "HEAD", "--", file_path])
    total = int(total_out.strip()) if total_out.strip().isdigit() else len(commits)
    return {"commits": commits, "total": total, "page": page, "per_page": per_page, "file": file_path}


def get_uncommitted_changes():
    """Return list of uncommitted files with their diffs."""
    changed = set()
    for cmd in [["git", "diff", "--name-only"],
                ["git", "diff", "--cached", "--name-only"],
                ["git", "ls-files", "--others", "--exclude-standard"]]:
        out, _, _ = _run(cmd)
        for l in out.splitlines():
            l = l.strip()
            if l: changed.add(l)
    files = []
    for p in sorted(changed):
        diff, _, _ = _run(["git", "diff", "--", p])
        files.append({"path": p, "diff": diff})
    return files


def get_commit_log(page=1, per_page=10, search="", order="desc"):
    """Return paginated commit log with optional search."""
    branch = current_branch()
    skip = (page - 1) * per_page if per_page > 0 else 0
    fmt = "--pretty=format:%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"

    root_out, _, _ = _run(["git", "rev-list", "--max-parents=0", "HEAD"])
    root_hashes = set(h.strip() for h in root_out.splitlines() if h.strip())

    def _parse(lines):
        result = []
        for line in lines:
            line = line.strip()
            if not line: continue
            parts = line.split("||", 3)
            if len(parts) == 4:
                h = parts[0]
                result.append({"hash": h, "short_hash": h[:7],
                                "author": parts[1], "date": parts[2], "message": parts[3],
                                "is_root": h in root_hashes})
        return result

    if not search:
        rev_order = [] if order == "desc" else ["--reverse"]
        count_out, _, _ = _run(["git", "rev-list", "--count", branch])
        total = int(count_out.strip()) if count_out.strip().isdigit() else 0
        out, _, _ = _run(["git", "log", branch, date_fmt, fmt,
                          "--skip", str(skip), "-n", str(per_page)] + rev_order)
        commits = _parse(out.splitlines())
        return {"commits": commits, "total": total, "page": page, "per_page": per_page, "order": order}

    base_args = ["git", "log", branch, date_fmt, fmt, "-n", "500"]
    hash_set = set()
    all_lines = []

    out_m, _, _ = _run(base_args + [f"--grep={search}", "-i", "-E"])
    for l in out_m.splitlines():
        l = l.strip()
        if l:
            h = l.split("||", 1)[0]
            if h and h not in hash_set:
                hash_set.add(h); all_lines.append(l)

    out_a, _, _ = _run(base_args + [f"--author={search}"])
    for l in out_a.splitlines():
        l = l.strip()
        if l:
            h = l.split("||", 1)[0]
            if h and h not in hash_set:
                hash_set.add(h); all_lines.append(l)

    if all(c in "0123456789abcdefABCDEF" for c in search):
        out_rev, _, _ = _run(["git", "rev-list", "--all", "--max-count", "50"])
        for rev in out_rev.splitlines():
            rev = rev.strip()
            if rev and (search.lower() in rev.lower()) and rev not in hash_set:
                out_show, _, _ = _run(["git", "show", "--no-patch",
                    "--pretty=format:%H||%an||%ad||%s",
                    "--date=format:%Y-%m-%d %H:%M", rev])
                for l in out_show.splitlines():
                    l = l.strip()
                    if l:
                        hash_set.add(rev); all_lines.append(l)

    total = len(all_lines)
    all_lines.sort(reverse=(order == "desc"))
    commits = _parse(all_lines)
    page_commits = commits[skip:skip + per_page] if per_page > 0 else commits
    return {"commits": page_commits, "total": total, "page": page, "per_page": per_page, "order": order}


def reset_to(hash, mode="soft"):
    """Reset to a commit with the given mode."""
    return _run(["git", "reset", f"--{mode}", hash])


def revert_commit(hash):
    """Create a revert commit for the given hash."""
    return _run(["git", "revert", hash, "--no-edit"])


def squash_commits(from_h, to_h, msg):
    """Squash commits from from_h to to_h into a single commit with msg."""
    _, _, rc = _run(["git", "rev-parse", "--verify", from_h + "^"])
    if rc != 0:
        return "", "Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.", 1
    parent = from_h + "~1"
    _run(["git", "reset", "--soft", parent])
    return _run(["git", "commit", "-m", msg])


def abort_merge_or_rebase():
    """Abort any in-progress merge, rebase, or cherry-pick."""
    for cmd in [["git", "merge", "--abort"],
                ["git", "rebase", "--abort"],
                ["git", "cherry-pick", "--abort"]]:
        out, err, rc = _run(cmd)
        if rc == 0: return out, err, rc
    return "", "no ongoing merge/rebase/cherry-pick", 0
