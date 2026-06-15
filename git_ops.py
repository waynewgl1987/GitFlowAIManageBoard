#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
git_ops.py — Git helper functions for Git Manage Board.
All git operations, state globals, and streaming helpers live here.
"""

import os, json, subprocess, socket, configparser, threading

PORT    = 8989
PROJECT_PATH = os.getcwd()  # current git project directory
_MSGLOG = []          # in-memory operation log
_PUSH_JOBS = {}       # {job_id: {lines:[], done:bool, ok:bool, error:str, authRequired:bool}}
_PUSH_JOBS_LOCK = threading.Lock()
_MSGLOG_LOCK    = threading.Lock()


def set_project_path(path):
    """Switch to a new git project directory. Returns (ok, message)."""
    global PROJECT_PATH
    path = os.path.abspath(os.path.expanduser(path))
    if not os.path.isdir(path):
        return False, f"Directory not found: {path}"
    git_dir = os.path.join(path, ".git")
    if not os.path.isdir(git_dir) and not os.path.isfile(git_dir):
        return False, f"Not a git repository (no .git): {path}"
    PROJECT_PATH = path
    os.chdir(path)
    return True, path


def get_project_path():
    """Return the current project path (always up-to-date)."""
    return PROJECT_PATH


def _get_git_env(extra=None):
    """Return a copy of os.environ with git interactive prompts disabled."""
    env = os.environ.copy()
    env["GIT_TERMINAL_PROMPT"] = "0"
    env["GIT_ASKPASS"] = "echo"
    if extra:
        env.update(extra)
    return env


def _load_app_config():
    """Read config.ini next to this script. Returns (app_name, app_version, exact_set, contains_list, network_timeout)."""
    cfg = configparser.ConfigParser()
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    if os.path.exists(cfg_path):
        cfg.read(cfg_path, encoding="utf-8")
    name    = cfg.get("app", "name",    fallback="Git Manage Board")
    version = cfg.get("app", "version", fallback="v1.0.0")
    raw_exact    = cfg.get("protection", "protected_branches_exact",    fallback="develop,main")
    raw_contains = cfg.get("protection", "protected_branches_contains", fallback="release")
    exact    = {b.strip() for b in raw_exact.split(",")    if b.strip()}
    contains = [b.strip().lower() for b in raw_contains.split(",") if b.strip()]
    try:
        network_timeout = int(cfg.get("git", "network_timeout", fallback="120"))
        if network_timeout < 1:
            network_timeout = 120
    except (ValueError, configparser.Error):
        network_timeout = 120
    return name, version, exact, contains, network_timeout


def get_network_timeout():
    """Return the configured network timeout in seconds for push/pull/fetch operations."""
    *_, timeout = _load_app_config()
    return timeout


def save_network_timeout(seconds):
    """Persist network_timeout to config.ini. Returns (ok, value_or_error)."""
    try:
        seconds = int(seconds)
        if seconds < 1:
            return False, "Timeout must be at least 1 second"
    except (ValueError, TypeError):
        return False, "Timeout must be a positive integer"

    cfg = configparser.ConfigParser()
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    if os.path.exists(cfg_path):
        cfg.read(cfg_path, encoding="utf-8")
    if not cfg.has_section("git"):
        cfg.add_section("git")
    cfg.set("git", "network_timeout", str(seconds))
    with open(cfg_path, "w", encoding="utf-8") as f:
        cfg.write(f)
    return True, seconds


def get_protected_config():
    """Return protected branch config as {"exact": [...], "contains": [...]}."""
    _, _, exact, contains, _ = _load_app_config()
    return {"exact": sorted(exact), "contains": sorted(contains)}


def is_branch_protected(short_name):
    """Return True if short_name matches any protection rule."""
    _, _, exact, contains, _ = _load_app_config()
    if short_name in exact:
        return True
    low = short_name.lower()
    return any(kw in low for kw in contains)


def _run(cmd, cwd=None, timeout=None, env=None):
    """Run a git command and return (stdout, stderr, returncode)."""
    if timeout is None:
        timeout = get_network_timeout()
    run_env = _get_git_env(env)
    try:
        r = subprocess.run(cmd, capture_output=True,
                           cwd=cwd or PROJECT_PATH, timeout=timeout, env=run_env)
        stdout = r.stdout.decode("utf-8", errors="replace").strip()
        stderr = r.stderr.decode("utf-8", errors="replace").strip()
        return stdout, stderr, r.returncode
    except subprocess.TimeoutExpired:
        return "", f"git command timed out after {timeout}s: {' '.join(cmd)}", -1
    except Exception as e:
        return "", str(e), -1


def _run_push_streaming(job_id, branch, extra_env=None, force=False, is_ssh=False, remote_branch=None):
    """Run git push in a background thread, streaming output lines into _PUSH_JOBS[job_id].
    
    remote_branch: if specified, push to origin/<remote_branch> instead of origin/<branch>.
    """
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

    # Determine the effective remote ref (local:remote mapping)
    target_remote = remote_branch if remote_branch else branch
    push_refspec = f"{branch}:{target_remote}" if target_remote != branch else branch

    try:
        url_out, _, _ = _run(["git", "remote", "get-url", "origin"])
        remote_url = url_out.strip()
    except Exception:
        remote_url = "origin"

    def _try_push(cmd, timeout=None):
        if timeout is None:
            timeout = get_network_timeout()
        _append_raw('$ ' + ' '.join(cmd))
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, cwd=PROJECT_PATH, env=run_env)
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
        _append(f'🌿 Branch: {branch}' + (f' → origin/{target_remote}' if target_remote != branch else ''))
        _append(f'{"⚠️  Force push (--force-with-lease)" if force else "🚀 Normal push"}')
        _append_raw('─' * 52)

        rc, timed_out = _try_push(push_base + ["origin", push_refspec])

        if rc != 0 and not timed_out:
            with _PUSH_JOBS_LOCK:
                combined_so_far = '\n'.join(job['lines'])
            no_upstream = any(x in combined_so_far.lower() for x in [
                "no upstream", "has no upstream", "set-upstream", "set the upstream"])
            if no_upstream:
                _append_raw('')
                _append(f'ℹ️  Branch has no upstream tracking. Retrying with: git push origin HEAD:{target_remote}')
                _append('   (This sets the remote branch to the same name — only affects branch "{}")'.format(target_remote))
                _append_raw('')
                rc, timed_out = _try_push(push_base + ["origin", f"HEAD:{target_remote}"])

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
                               text=True, cwd=PROJECT_PATH, env=run_env)
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

        timeout = get_network_timeout()
        try:
            proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            proc.kill()
            _append(f'⏱ Operation timed out after {timeout}s — check your network.')

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
    app_name, app_version, _, _, _ = _load_app_config()
    dir_name = os.path.basename(os.path.abspath(PROJECT_PATH))
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


def stash_changes(msg=None, paths=None):
    """Run git stash, optionally with a message and/or specific file paths."""
    cmd = ["git", "stash", "push"]
    if msg and msg.strip():
        cmd += ["-m", msg.strip()]
    if paths:
        cmd += ["--"] + list(paths)
    return _run(cmd)


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


def checkout_branch(name, force=False):
    """Checkout a branch, handling remote tracking branches."""
    branch = (name or "").strip()
    if not branch:
        return "", "No branch specified", -1
    flag = ["-f"] if force else []
    if branch.startswith("origin/"):
        local_branch = _strip_origin_prefix(branch)
        if _ref_exists(local_branch):
            return _run(["git", "checkout"] + flag + [local_branch])
        return _run(["git", "checkout", "-b", local_branch, "--track", branch])
    return _run(["git", "checkout"] + flag + [branch])


def create_branch(name, base=None):
    """创建新分支，可选基于 base 分支"""
    cmd = ["git", "checkout", "-b", name]
    if base:
        cmd.append(base)
    return _run(cmd)


# ── Git Worktree Operations ──────────────────────────────────────────────

def worktree_list():
    """List all worktrees for the main repository.
    Returns a list of dicts: {path, head, branch, detached, is_current, is_main}"""
    out, err, rc = _run(["git", "worktree", "list", "--porcelain"])
    if rc != 0:
        return [], err, rc
    worktrees = []
    current = None
    for line in out.splitlines():
        if line.startswith("worktree "):
            current = {"path": line[9:].strip(), "head": "", "branch": "", "detached": False, "is_current": False, "is_main": False}
            worktrees.append(current)
        elif line.startswith("HEAD "):
            if current:
                current["head"] = line[5:].strip()
        elif line.startswith("branch "):
            if current:
                current["branch"] = line[7:].strip()
        elif line.startswith("detached"):
            if current:
                current["detached"] = True
        elif line == "bare":
            pass  # bare worktree — skip
    # Mark current worktree (the one matching PROJECT_PATH)
    main = get_project_path()
    for wt in worktrees:
        if os.path.realpath(wt["path"]) == os.path.realpath(main):
            wt["is_current"] = True
        # Main worktree has .git as a directory; worktrees have .git as a file
        git_path = os.path.join(wt["path"], ".git")
        if os.path.isdir(git_path):
            wt["is_main"] = True
    return worktrees, "", 0


def worktree_add(path, branch):
    """Create a new worktree at `path` for `branch`.
    Branch is required — creates a new branch if it doesn't exist (via -b flag).
    Returns (stdout, stderr, returncode)."""
    path = os.path.abspath(os.path.expanduser(path))
    if not branch:
        return "", "Branch name is required", -1
    # Check if path already exists
    if os.path.exists(path):
        return "", f"Path already exists: {path}", -1
    return _run(["git", "worktree", "add", path, branch])


def worktree_remove(path, force=False):
    """Remove a worktree at `path`.
    Uses `git worktree remove` (safe) or `--force` for dirty worktrees.
    Returns (stdout, stderr, returncode)."""
    path = os.path.abspath(os.path.expanduser(path))
    cmd = ["git", "worktree", "remove"]
    if force:
        cmd.append("--force")
    cmd.append(path)
    return _run(cmd)


def worktree_prune():
    """Prune stale worktree metadata (after manual deletion).
    Returns (stdout, stderr, returncode)."""
    return _run(["git", "worktree", "prune"])


def delete_branch_local(name, force=False):
    """删除本地分支；force=True 时用 -D 强制删除未合并分支"""
    flag = "-D" if force else "-d"
    return _run(["git", "branch", flag, name])


def delete_branch_remote(name):
    """删除远端分支，name 应为不含 origin/ 前缀的短名"""
    short = name.replace("origin/", "", 1) if name.startswith("origin/") else name
    return _run(["git", "push", "origin", "--delete", short])


def rename_branch(old_name, new_name):
    """Rename a local branch using git branch -m."""
    if not old_name or not new_name:
        return "", "Branch name required", -1
    if old_name == new_name:
        return "", "New name is the same as old name", -1
    return _run(["git", "branch", "-m", old_name, new_name])


def rebase_abort():
    """Abort an in-progress rebase."""
    return _run(["git", "rebase", "--abort"])


def rebase_skip():
    """Skip the current conflicting commit during a rebase."""
    return _run(["git", "rebase", "--skip"])


def rebase_continue():
    """Continue an in-progress rebase after conflicts are resolved."""
    env = {"GIT_EDITOR": "true"}
    return _run(["git", "rebase", "--continue"], env=env)


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


_BINARY_EXTENSIONS = {
    # Images
    "png","jpg","jpeg","gif","webp","bmp","ico","tiff","tif","svg","heic","raw",
    # Video / Audio
    "mp4","mov","avi","mkv","mp3","wav","flac","m4a","aac","ogg","webm",
    # Archives / packages
    "zip","tar","gz","bz2","xz","7z","rar","jar","war","ear",
    # Compiled / executables
    "exe","dll","so","dylib","class","pyc","pyd","o","a","lib",
    # Fonts / Documents
    "ttf","otf","woff","woff2","pdf","doc","docx","xls","xlsx","ppt","pptx",
    # Database / data
    "db","sqlite","sqlite3",
}

# Structured file extensions that CANNOT be safely merged by concatenating ours+theirs.
# These formats (Xcode project, plist, lock files) have strict syntax; concatenation
# produces a corrupt/invalid file that breaks the project (e.g. Xcode loses all schemes).
_STRUCTURED_NO_CONCAT_EXTENSIONS = {
    # Xcode project / workspace / scheme files
    "pbxproj", "xcworkspacedata", "xcscheme", "xcbreakpointlist",
    "xcuserstate", "xctestplan",
    # Property lists (XML or binary format)
    "plist",
    # Package manager lock files / resolved manifests
    "lock", "resolved",
}

# Exact basenames that are always structured, regardless of extension
_STRUCTURED_NO_CONCAT_NAMES = {
    "Package.resolved",
    "Podfile.lock",
    "Cartfile.resolved",
    "Gemfile.lock",
}


def _is_structured_file(fp):
    """Return True if fp cannot be safely merged by concatenating both conflict sides.

    Xcode project files, plists, and lock files have strict structured formats;
    the naïve 'both' strategy (ours + theirs) produces an invalid file that
    corrupts the Xcode project (schemas disappear, build settings break, etc.).
    Such files must be resolved with 'ours', 'theirs', or a manual edit.
    """
    basename = os.path.basename(fp)
    if basename in _STRUCTURED_NO_CONCAT_NAMES:
        return True
    ext = os.path.splitext(fp)[1].lstrip(".").lower()
    return ext in _STRUCTURED_NO_CONCAT_EXTENSIONS


def _is_binary_file(fp):
    """Return True if fp is a binary file, by extension first, then null-byte scan."""
    ext = os.path.splitext(fp)[1].lstrip(".").lower()
    if ext in _BINARY_EXTENSIONS:
        return True
    # Null-byte scan of working tree file
    try:
        with open(fp, "rb") as f:
            chunk = f.read(8192)
        if b"\x00" in chunk:
            return True
    except Exception:
        pass
    # Fall back: check staged :2 (ours) via subprocess in binary mode
    try:
        import subprocess as _sp
        r = _sp.run(["git", "show", f":2:{fp}"], capture_output=True, timeout=10)
        if b"\x00" in r.stdout[:512]:
            return True
    except Exception:
        pass
    return False


def get_conflict_detail(fp):
    """Return conflict detail for a file: raw content, ours, theirs, and parsed blocks.

    For binary files, returns ``is_binary=True`` with no blocks.
    Callers should present "Use Ours / Use Theirs" buttons instead of a diff editor.
    """
    binary = _is_binary_file(fp)
    structured = _is_structured_file(fp)

    if binary:
        return {
            "is_binary": True,
            "is_structured": False,
            "raw": "",
            "ours": "",
            "theirs": "",
            "blocks": [],
            "path": fp,
        }

    try:
        with open(fp, "r", encoding="utf-8", errors="replace") as f:
            raw = f.read()
    except Exception:
        raw = ""
    ours, _, _ = _run(["git", "show", f":2:{fp}"])
    theirs, _, _ = _run(["git", "show", f":3:{fp}"])
    blocks = _parse_blocks(raw)
    return {"is_binary": False, "is_structured": structured, "raw": raw, "ours": ours, "theirs": theirs, "blocks": blocks}


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
    cwd = PROJECT_PATH
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
    cwd = PROJECT_PATH
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
    cwd = PROJECT_PATH
    if os.path.exists(os.path.join(cwd, ".git", "CHERRY_PICK_HEAD")):
        return _run(["git", "cherry-pick", "--continue"], env=env)
    if os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
       os.path.exists(os.path.join(cwd, ".git", "rebase-apply")):
        return _run(["git", "rebase", "--continue"], env=env)
    if os.path.exists(os.path.join(cwd, ".git", "MERGE_HEAD")):
        return _run(["git", "commit", "--no-edit"], env=env)
    return "", "No merge/rebase/cherry-pick in progress", -1


def resolve_conflict(fp, resolution):
    """Resolve a conflict file with 'ours', 'theirs', 'both', or custom text content.

    ``resolution`` is either the literal string ``'ours'``/``'theirs'`` (which
    runs ``git checkout --ours/--theirs``), ``'both'`` (which concatenates ours
    then theirs), or arbitrary text content to write.
    Binary files must always use ``'ours'`` or ``'theirs'`` — passing empty
    content for a binary file is rejected to avoid corrupting the file.
    """
    if resolution == "ours":
        _run(["git", "checkout", "--ours", fp])
    elif resolution == "theirs":
        _run(["git", "checkout", "--theirs", fp])
    elif resolution == "both":
        if _is_structured_file(fp):
            name = os.path.basename(fp)
            return (
                "",
                f"'Accept Both' is not supported for structured file '{name}'. "
                "Xcode project files, plists, and lock files cannot be safely merged "
                "by concatenation — doing so would corrupt the file and break your "
                "Xcode project (schemas, build targets, etc. would be lost). "
                "Please use 'Accept Ours', 'Accept Theirs', or resolve manually.",
                1,
                False,
            )
        ours, _, _ = _run(["git", "show", f":2:{fp}"])
        theirs, _, _ = _run(["git", "show", f":3:{fp}"])
        combined = ours.rstrip("\n") + "\n" + theirs.lstrip("\n")
        with open(fp, "w", encoding="utf-8") as f:
            f.write(combined)
    else:
        # Safety: never overwrite a binary file with empty text content
        if not resolution and _is_binary_file(fp):
            return "", "Cannot resolve binary file with empty content — use 'ours' or 'theirs'", 1, False
        with open(fp, "w", encoding="utf-8") as f:
            f.write(resolution)
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
    """Return list of uncommitted files with their diffs.

    Uses `git diff HEAD` so that BOTH staged and unstaged changes are shown
    together — prevents the bug where a file modified twice (first change staged,
    second change unstaged) only shows the second (unstaged) change.
    """
    unstaged = set()
    out, _, _ = _run(["git", "diff", "--name-only"])
    for l in out.splitlines():
        l = l.strip()
        if l: unstaged.add(l)

    staged = set()
    out, _, _ = _run(["git", "diff", "--cached", "--name-only"])
    for l in out.splitlines():
        l = l.strip()
        if l: staged.add(l)

    untracked = set()
    out, _, _ = _run(["git", "ls-files", "--others", "--exclude-standard"])
    for l in out.splitlines():
        l = l.strip()
        if l: untracked.add(l)

    all_changed = unstaged | staged | untracked
    files = []
    for p in sorted(all_changed):
        if p in untracked:
            # New file not yet added — no diff available from git
            files.append({"path": p, "diff": ""})
            continue

        # `git diff HEAD` shows ALL changes (staged + unstaged) compared to
        # the last commit, so a file edited twice with a git-add in between
        # will show the complete combined diff.
        diff, _, _ = _run(["git", "diff", "HEAD", "--", p])
        if not diff.strip():
            # No HEAD yet (fresh repo) or edge case — fall back to cached
            diff, _, _ = _run(["git", "diff", "--cached", "--", p])
        files.append({"path": p, "diff": diff})
    return files


def _get_unpushed_hashes(branch: str) -> set:
    """Return set of commit hashes on branch that have NOT been pushed to origin."""
    remote = f"origin/{branch}"
    # Check if the remote tracking branch exists at all
    check_out, _, check_rc = _run(["git", "rev-parse", "--verify", remote])
    if check_rc != 0:
        # No remote tracking branch — treat everything as unpushed
        out, _, rc = _run(["git", "rev-list", branch])
        if rc == 0:
            return set(h.strip() for h in out.splitlines() if h.strip())
        return set()
    out, _, rc = _run(["git", "log", f"{remote}..{branch}", "--pretty=format:%H"])
    if rc != 0:
        return set()
    return set(h.strip() for h in out.splitlines() if h.strip())


def get_commit_log(page=1, per_page=10, search="", order="desc"):
    """Return paginated commit log with optional search.

    Each commit dict includes a ``pushed`` boolean indicating whether the
    commit is present on the remote tracking branch (origin/<branch>).
    """
    branch = current_branch()
    skip = (page - 1) * per_page if per_page > 0 else 0
    fmt = "--pretty=format:%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"

    root_out, _, _ = _run(["git", "rev-list", "--max-parents=0", "HEAD"])
    root_hashes = set(h.strip() for h in root_out.splitlines() if h.strip())

    # Collect unpushed hashes once for the current branch
    unpushed = _get_unpushed_hashes(branch)

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
                                "is_root": h in root_hashes,
                                "pushed": h not in unpushed})
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


def drop_commit(hash):
    """Remove a commit from history entirely using rebase --onto. No new commit is created."""
    return _run(["git", "rebase", "--onto", hash + "^", hash])


def squash_commits(from_h, to_h, msg):
    """Squash commits from from_h to to_h into a single commit with msg."""
    _, _, rc = _run(["git", "rev-parse", "--verify", from_h + "^"])
    if rc != 0:
        return "", "Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.", 1
    parent = from_h + "~1"
    _run(["git", "reset", "--soft", parent])
    return _run(["git", "commit", "-m", msg])



_MAX_DIFF_LINES_PER_FILE = 400   # safety cap to keep JSON response manageable

def _parse_diff_by_file(diff_text):
    """Parse a unified diff into per-file sections with +/- line counts."""
    files = []
    current_file = None
    current_lines = []
    added = 0
    removed = 0

    for line in (diff_text or "").splitlines():
        if line.startswith("diff --git "):
            if current_file is not None:
                diff_content = "\n".join(current_lines[:_MAX_DIFF_LINES_PER_FILE])
                if len(current_lines) > _MAX_DIFF_LINES_PER_FILE:
                    diff_content += f"\n... ({len(current_lines) - _MAX_DIFF_LINES_PER_FILE} more lines — open in Tab to view full diff)"
                files.append({
                    "path": current_file,
                    "added": added,
                    "removed": removed,
                    "diff": diff_content,
                })
            parts = line.split(" b/", 1)
            current_file = parts[1].strip() if len(parts) == 2 else line.split()[-1].strip()
            current_lines = [line]
            added = 0
            removed = 0
        elif current_file is not None:
            current_lines.append(line)
            if line.startswith("+") and not line.startswith("+++"):
                added += 1
            elif line.startswith("-") and not line.startswith("---"):
                removed += 1

    if current_file is not None:
        diff_content = "\n".join(current_lines[:_MAX_DIFF_LINES_PER_FILE])
        if len(current_lines) > _MAX_DIFF_LINES_PER_FILE:
            diff_content += f"\n... ({len(current_lines) - _MAX_DIFF_LINES_PER_FILE} more lines — open in Tab to view full diff)"
        files.append({
            "path": current_file,
            "added": added,
            "removed": removed,
            "diff": diff_content,
        })
    return files


def get_latest_commit_diff():
    """Return parsed diff for the latest commit (HEAD vs HEAD~1)."""
    fmt = "%H||%h||%an||%ad||%s"
    info_out, _, info_rc = _run(
        ["git", "log", "-1", "--format=" + fmt, "--date=format:%Y-%m-%d %H:%M"]
    )
    if info_rc != 0 or not info_out.strip():
        return {"ok": False, "error": "No commits found"}

    parts = info_out.strip().split("||", 4)
    if len(parts) < 5:
        return {"ok": False, "error": "Could not parse commit info"}

    commit_hash, short_hash, author, date, message = parts

    parent_out, _, parent_rc = _run(["git", "rev-parse", "--verify", "HEAD~1"])
    has_parent = parent_rc == 0

    if has_parent:
        diff_out, diff_err, diff_rc = _run(["git", "diff", "HEAD~1", "HEAD"])
    else:
        diff_out, diff_err, diff_rc = _run(["git", "show", "--format=", "-p", "HEAD"])
        if diff_out.startswith("\n"):
            diff_out = diff_out.lstrip("\n")

    if diff_rc != 0:
        return {"ok": False, "error": diff_err or "git diff failed"}

    files = _parse_diff_by_file(diff_out)
    return {
        "ok": True,
        "commit": commit_hash,
        "short_hash": short_hash,
        "author": author,
        "date": date,
        "message": message,
        "parent": "HEAD~1" if has_parent else "(initial commit)",
        "files": files,
        "total_added": sum(f["added"] for f in files),
        "total_removed": sum(f["removed"] for f in files),
    }

def get_commit_diff_compare(base_hash, head_hash):
    """Return parsed diff between two commit hashes (base_hash..head_hash)."""
    fmt = "%H||%h||%an||%ad||%s"
    # Get info for both commits
    head_info, _, head_rc = _run(
        ["git", "log", "-1", "--format=" + fmt, "--date=format:%Y-%m-%d %H:%M", head_hash]
    )
    base_info, _, base_rc = _run(
        ["git", "log", "-1", "--format=" + fmt, "--date=format:%Y-%m-%d %H:%M", base_hash]
    )
    if head_rc != 0 or base_rc != 0:
        return {"ok": False, "error": "Could not resolve one or both commits"}

    def parse_info(line):
        parts = (line or "").strip().split("||", 4)
        if len(parts) < 5:
            return None
        return {"commit": parts[0], "short_hash": parts[1], "author": parts[2], "date": parts[3], "message": parts[4]}

    head_data = parse_info(head_info)
    base_data = parse_info(base_info)
    if not head_data or not base_data:
        return {"ok": False, "error": "Could not parse commit info"}

    diff_out, diff_err, diff_rc = _run(["git", "diff", base_hash, head_hash])
    if diff_rc != 0:
        return {"ok": False, "error": diff_err or "git diff failed"}

    files = _parse_diff_by_file(diff_out)
    return {
        "ok": True,
        "commit": head_data["commit"],
        "short_hash": head_data["short_hash"],
        "author": head_data["author"],
        "date": head_data["date"],
        "message": head_data["message"],
        "base_commit": base_data["commit"],
        "base_short_hash": base_data["short_hash"],
        "base_message": base_data["message"],
        "base_date": base_data["date"],
        "parent": base_hash,
        "files": files,
        "total_added": sum(f["added"] for f in files),
        "total_removed": sum(f["removed"] for f in files),
    }


def abort_merge_or_rebase():
    """Abort any in-progress merge, rebase, or cherry-pick."""
    for cmd in [["git", "merge", "--abort"],
                ["git", "rebase", "--abort"],
                ["git", "cherry-pick", "--abort"]]:
        out, err, rc = _run(cmd)
        if rc == 0: return out, err, rc
    return "", "no ongoing merge/rebase/cherry-pick", 0


def get_git_graph(max_commits=150):
    """Return structured commit graph data for branch graph visualization.

    The current HEAD branch always occupies lane 0 (leftmost position).
    refs/stash commits are excluded.
    """
    fmt = "%H||%P||%D||%s||%an||%ad"

    def _parse_raw(raw):
        rows = []
        for line in raw.splitlines():
            line = line.strip()
            if not line:
                continue
            p = line.split("||", 5)
            if len(p) == 6:
                rows.append(p)
        return rows

    # Run 1: HEAD branch first → these commits occupy lane 0
    out1, _, _ = _run([
        "git", "log", "--topo-order",
        f"--pretty=format:{fmt}", "--date=short", f"-n{max_commits}", "HEAD"
    ])
    rows1 = _parse_raw(out1)

    # Run 2: all other refs, excluding stash explicitly
    # Use --all --exclude=refs/stash instead of --branches --remotes --tags
    # so worktree stashes and any non-standard stash refs are all excluded
    out2, _, _ = _run([
        "git", "log", "--all", "--exclude=refs/stash",
        "--topo-order", f"--pretty=format:{fmt}", "--date=short",
        f"-n{max_commits}", "--not", "HEAD"
    ])
    rows2 = _parse_raw(out2)

    # Combine, HEAD commits first, deduplicate
    seen_hashes = {r[0] for r in rows1}
    rows = rows1 + [r for r in rows2 if r[0] not in seen_hashes]
    rows = rows[:max_commits]

    if not rows:
        return {"commits": [], "edges": [], "max_lane": 0}

    commits = []
    for h, parents_str, refs, msg, author, date in rows:
        parents = [p.strip() for p in parents_str.split() if p.strip()]

        labels = []
        is_head = False
        for ref in refs.split(","):
            ref = ref.strip()
            # Exclude stash refs and symbolic HEAD pointers (origin/HEAD etc.)
            if not ref or ref == 'refs/stash' or ref.startswith('refs/stash@') \
                    or ref == 'stash' or ref.startswith('stash@'):
                continue
            # Skip symbolic remote HEAD pointers (e.g. origin/HEAD) — not real branches
            if ref == 'HEAD' or ref.endswith('/HEAD'):
                if ref == 'HEAD':
                    is_head = True
                continue
            if ref.startswith("HEAD -> "):
                labels.insert(0, ref[8:])
                is_head = True
            elif ref.startswith("tag: "):
                labels.append("🏷 " + ref[5:])
            else:
                labels.append(ref)

        commits.append({
            "hash": h, "short": h[:7],
            "parents": parents, "labels": labels,
            "is_head": is_head,
            "msg": msg[:80], "author": author, "date": date,
            "lane": 0,
        })

    if not commits:
        return {"commits": [], "edges": [], "max_lane": 0}

    # Lane assignment — topo order (newest first): reserve lanes for parents
    lane_map = {}   # parent_hash -> reserved lane index
    free = []
    nxt = [0]

    def alloc():
        if free: return free.pop(0)
        l = nxt[0]; nxt[0] += 1; return l

    def release(l):
        free.append(l); free.sort()

    for c in commits:
        h, parents = c["hash"], c["parents"]
        my_lane = lane_map.pop(h, None)
        if my_lane is None:
            my_lane = alloc()
        c["lane"] = my_lane

        if parents:
            if parents[0] not in lane_map:
                lane_map[parents[0]] = my_lane
            else:
                release(my_lane)
            for p in parents[1:]:
                if p not in lane_map:
                    lane_map[p] = alloc()
        else:
            release(my_lane)

    max_lane = max((c["lane"] for c in commits), default=0)

    hash_to_row = {c["hash"]: i for i, c in enumerate(commits)}
    edges = []
    for i, c in enumerate(commits):
        first_parent = True
        for ph in c["parents"]:
            if ph in hash_to_row:
                pi = hash_to_row[ph]
                parent = commits[pi]
                if first_parent and parent["lane"] != c["lane"]:
                    c["branch_from"] = {
                        "idx": pi,
                        "short": parent["short"],
                        "date": parent["date"],
                        "labels": parent["labels"][:3],
                        "msg": parent["msg"][:50],
                    }
                edges.append([i, c["lane"], pi, parent["lane"]])
            first_parent = False

    # A branch is cut exactly ONCE per lane. Keep only the OLDEST branch_from
    # per lane (highest row index = oldest commit in topo order = true branch start).
    # All others are topology artifacts from merged commits and lane reuse.
    oldest_bf_row_per_lane = {}
    for i, c in enumerate(commits):
        if c.get("branch_from"):
            lane = c["lane"]
            if lane not in oldest_bf_row_per_lane or i > oldest_bf_row_per_lane[lane]:
                oldest_bf_row_per_lane[lane] = i
    for i, c in enumerate(commits):
        if c.get("branch_from") and i != oldest_bf_row_per_lane.get(c["lane"]):
            del c["branch_from"]

    return {"commits": commits, "edges": edges, "max_lane": max_lane}
