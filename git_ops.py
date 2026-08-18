#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
git_ops.py — Git helper functions for Git Manage Board.
All git operations, state globals, and streaming helpers live here.
"""

import os, re, json, subprocess, socket, configparser, threading, datetime, shlex

def _shell_quote(s):
    """Return a shell-safe single-quoted version of string s."""
    return shlex.quote(str(s))

PORT    = 8989
PROJECT_PATH = os.getcwd()  # current git project directory
_MSGLOG = []          # in-memory operation log
_PUSH_JOBS = {}       # {job_id: {lines:[], done:bool, ok:bool, error:str, authRequired:bool}}
_PUSH_JOBS_LOCK = threading.Lock()
_MSGLOG_LOCK    = threading.Lock()

# Local persistent log — never committed to the repo (.gitignored)
_LOCAL_LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gitboard.log")
_LOCAL_LOG_LOCK = threading.Lock()

def _write_local_log(section: str, lines):
    """Append a timestamped entry to gitboard.log (local only, not committed)."""
    try:
        ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        body = "\n".join(lines) if isinstance(lines, (list, tuple)) else str(lines)
        entry = f"\n[{ts}] [{section}]\n{body}\n{'─'*60}\n"
        with _LOCAL_LOG_LOCK:
            with open(_LOCAL_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(entry)
    except Exception:
        pass  # logging must never break the main flow


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


def get_gpg_sign():
    """Return whether GPG signing is enabled for commits."""
    cfg = configparser.ConfigParser()
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    if os.path.exists(cfg_path):
        cfg.read(cfg_path, encoding="utf-8")
    return cfg.getboolean("git", "gpg_sign", fallback=False)


def save_gpg_sign(enabled):
    """Persist gpg_sign setting to config.ini. Returns (ok, value_or_error)."""
    enabled = bool(enabled)
    cfg = configparser.ConfigParser()
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    if os.path.exists(cfg_path):
        cfg.read(cfg_path, encoding="utf-8")
    if not cfg.has_section("git"):
        cfg.add_section("git")
    cfg.set("git", "gpg_sign", str(enabled).lower())
    with open(cfg_path, "w", encoding="utf-8") as f:
        cfg.write(f)
    return True, enabled


def detect_base_branch():
    """Detect the most appropriate base branch for the current branch.

    Priority order:
    1. Configured upstream tracking ref (@{u}) — most accurate
    2. Closest origin/ ref by commit distance among common candidates
       (release/*, develop, main, master)

    Always returns an 'origin/' ref so we use the remote state, not a
    potentially stale local branch.
    """
    # 1. Try the configured upstream tracking ref
    up_out, _, up_rc = _run(["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
    if up_rc == 0:
        upstream = (up_out or "").strip()
        if upstream and upstream != "HEAD":
            # Normalise to origin/ prefix
            if not upstream.startswith("origin/"):
                upstream = f"origin/{upstream}"
            # Verify the ref resolves
            _, _, vrc = _run(["git", "rev-parse", "--verify", upstream])
            if vrc == 0:
                return upstream

    # 2. Find the closest remote ref among common candidates
    candidates_raw, _, _ = _run(["git", "branch", "-r", "--format=%(refname:short)"])
    remote_refs = [r.strip() for r in (candidates_raw or "").splitlines() if r.strip()]

    # Build ordered candidate list: release/* branches first, then develop/main/master
    release_refs = sorted([r for r in remote_refs if "/release/" in r or r.startswith("origin/release")])
    priority_refs = release_refs + ["origin/develop", "origin/main", "origin/master"]
    candidates = [r for r in priority_refs if r in remote_refs]
    # De-duplicate while preserving order
    seen = set()
    candidates = [r for r in candidates if not (r in seen or seen.add(r))]

    cur_branch = current_branch() or ""
    best_ref = None
    best_dist = None

    for ref in candidates:
        # Skip if this ref IS the current branch
        ref_branch = ref.replace("origin/", "", 1)
        if ref_branch == cur_branch or ref == cur_branch:
            continue
        # Get commit distance (number of commits on branch not in ref)
        count_out, _, count_rc = _run(["git", "rev-list", "--count", f"{ref}..HEAD"])
        if count_rc != 0:
            continue
        try:
            dist = int((count_out or "").strip())
        except ValueError:
            continue
        if best_dist is None or dist < best_dist:
            best_dist = dist
            best_ref = ref

    return best_ref or "origin/develop"


def check_unsigned_commits(base="develop"):
    """Check if current branch has unsigned commits relative to base.
    Returns {"has_unsigned": bool, "unsigned_count": int, "total_count": int}."""
    branch = current_branch()
    if not branch or branch == base:
        return {"has_unsigned": False, "unsigned_count": 0, "total_count": 0}
    # List commits on this branch not in base, with signature status
    out, _, rc = _run(["git", "log", "--format=%H %G?", f"{base}..HEAD"])
    if rc != 0 or not out.strip():
        return {"has_unsigned": False, "unsigned_count": 0, "total_count": 0}
    lines = [l.strip() for l in out.strip().splitlines() if l.strip()]
    total = len(lines)
    # G=good, U=good untrusted, B=bad, X=expired, Y=expired key, R=revoked, E=error, N=none
    unsigned = [l for l in lines if l.split()[-1] in ("N", "B", "E")]
    return {"has_unsigned": len(unsigned) > 0, "unsigned_count": len(unsigned), "total_count": total}


def get_unsigned_commit_list(base="develop"):
    """Return detailed list of unsigned commits on current branch relative to base.

    Returns {"unsigned": [{"hash": str, "short": str, "subject": str}],
             "total_count": int, "unsigned_count": int}.
    Signature codes N (none), B (bad), E (error) are treated as unsigned."""
    branch = current_branch()
    if not branch or branch == base:
        return {"unsigned": [], "total_count": 0, "unsigned_count": 0}

    # Prefer remote ref to avoid stale local branch
    resolved_base = base
    if not base.startswith("origin/"):
        remote_ref = f"origin/{base}"
        _, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
        if probe_rc == 0:
            resolved_base = remote_ref

    out, _, rc = _run(["git", "log", "--format=%H\x1f%h\x1f%G?\x1f%s", f"{resolved_base}..HEAD"])
    if rc != 0 or not (out or "").strip():
        return {"unsigned": [], "total_count": 0, "unsigned_count": 0}

    all_commits = []
    unsigned = []
    for line in out.strip().splitlines():
        parts = line.split("\x1f", 3)
        if len(parts) < 4:
            continue
        full_h, short_h, sig, subject = parts
        all_commits.append(full_h)
        if sig in ("N", "B", "E"):
            unsigned.append({"hash": full_h.strip(), "short": short_h.strip(), "subject": subject.strip()})

    return {"unsigned": unsigned, "total_count": len(all_commits), "unsigned_count": len(unsigned)}


def squash_unsigned_commits(base="develop", message=None):
    """Squash all commits on current branch (relative to base) into one signed commit.

    Uses git reset --soft to the merge-base then re-commits with GPG sign (-S).
    The combined commit message is built from individual commit subjects unless
    *message* is provided explicitly.
    Returns (ok: bool, message: str).
    """
    branch = current_branch()
    if not branch:
        return False, "Not on any branch"

    # Prefer remote ref
    resolved_base = base
    if not base.startswith("origin/"):
        remote_ref = f"origin/{base}"
        _, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
        if probe_rc == 0:
            resolved_base = remote_ref

    if branch == resolved_base or branch == base:
        return False, f"Cannot squash: currently on base branch '{base}'"

    mb_out, mb_err, mb_rc = _run(["git", "merge-base", "HEAD", resolved_base])
    if mb_rc != 0 or not (mb_out or "").strip():
        return False, mb_err or "Cannot determine merge-base"
    merge_base = mb_out.strip()

    # Collect subjects for combined commit message
    if not message:
        log_out, _, _ = _run(["git", "log", "--format=%s", f"{merge_base}..HEAD"])
        subjects = [s.strip() for s in (log_out or "").strip().splitlines() if s.strip()]
        subjects.reverse()  # oldest first
        message = "\n".join(subjects) if subjects else "squash unsigned commits"

    # Count commits being squashed
    count_out, _, _ = _run(["git", "rev-list", "--count", f"{merge_base}..HEAD"])
    count = int((count_out or "0").strip()) if (count_out or "").strip().isdigit() else 0

    # Soft-reset to merge-base, then re-commit with GPG sign
    _, reset_err, reset_rc = _run(["git", "reset", "--soft", merge_base])
    if reset_rc != 0:
        return False, reset_err or "git reset --soft failed"

    commit_out, commit_err, commit_rc = _run(["git", "commit", "-S", "-m", message])
    if commit_rc != 0:
        # Attempt to restore — re-commit without signing so nothing is lost
        _run(["git", "commit", "-m", message])
        return False, commit_err or commit_out or "git commit -S failed"

    _write_local_log("squash-unsigned", [
        f"branch={branch}  base={resolved_base}  merge_base={merge_base}",
        f"squashed {count} commit(s) into 1 signed commit",
        commit_out.strip() if commit_out else "",
    ])
    return True, f"Squashed {count} commit(s) into 1 signed commit"


def resign_branch_commits(base="develop"):
    """Re-sign all commits on current branch relative to base using GPG.

    Signs commits IN-PLACE by rebasing from the merge-base of HEAD and the
    remote base ref.  This does NOT move the branch base (no conflicts), it
    only re-signs each commit with -S --amend.
    Returns (ok, message)."""
    branch = current_branch()
    if not branch:
        return False, "Not on any branch"

    # Always prefer the origin/ remote ref to avoid stale local branch issues
    if not base.startswith("origin/"):
        remote_ref = f"origin/{base}"
        _, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
        if probe_rc == 0:
            base = remote_ref

    if branch == base:
        return False, f"Cannot re-sign: currently on base branch '{base}'"

    # Check if there are commits to re-sign
    info = check_unsigned_commits(base)
    if not info["has_unsigned"]:
        return True, "All commits are already signed"

    # Find the actual fork point (merge-base) so we rebase IN-PLACE without
    # moving commits onto the tip of origin/develop.  This avoids conflicts
    # that would occur if origin/develop has advanced beyond the branch's base.
    mb_out, mb_err, mb_rc = _run(["git", "merge-base", "HEAD", base])
    if mb_rc != 0 or not (mb_out or "").strip():
        return False, mb_err or mb_out or f"Cannot determine merge-base with {base}"
    merge_base = mb_out.strip()

    # Re-sign in-place: rebase from merge-base, exec amend+sign on every commit.
    # --allow-empty handles commits that are already empty after amend.
    resign_exec = "git commit --amend --no-edit -S --allow-empty || true"
    stdout, stderr, rc = _run(
        ["git", "rebase", "--exec", resign_exec, merge_base],
        timeout=180
    )
    if rc != 0:
        _run(["git", "rebase", "--abort"])
        _write_local_log("resign-commits", [
            f"branch={branch}  merge_base={merge_base}  rc={rc}",
            f"unsigned={info['unsigned_count']}/{info['total_count']}",
            ("ERROR: " + (stderr or stdout or "Rebase failed")),
        ])
        return False, stderr or stdout or "Rebase failed"
    _write_local_log("resign-commits", [
        f"branch={branch}  merge_base={merge_base}  rc={rc}",
        f"re-signed {info['unsigned_count']} of {info['total_count']} commit(s)",
        stdout.strip() if stdout else "",
    ])
    return True, f"Successfully re-signed {info['unsigned_count']} commit(s)"


def resign_branch_commits_with_autostash(base="develop"):
    """Auto-stash local changes, re-sign commits, then return (ok, message)."""
    branch = current_branch()
    if not branch:
        return False, "Not on any branch"
    if branch == base:
        return False, f"Cannot re-sign: currently on base branch '{base}'"

    # Clear leftover rebase state if present; ignore "no rebase in progress".
    _run(["git", "rebase", "--abort"])

    dirty_out, dirty_err, dirty_rc = _run(["git", "status", "--porcelain"])
    if dirty_rc != 0:
        return False, dirty_err or dirty_out or "Failed to inspect working tree"

    stashed = False
    if dirty_out.strip():
        import time as _time
        stash_label = f"auto-stash-before-resign-{int(_time.time())}"
        stash_out, stash_err, stash_rc = _run(["git", "stash", "push", "-u", "-m", stash_label])
        if stash_rc != 0:
            return False, stash_err or stash_out or "Failed to stash local changes"
        stashed = True

    ok, msg = resign_branch_commits(base)
    if not ok:
        return False, msg
    if stashed:
        return True, f"{msg}. Local changes were auto-stashed."
    return True, msg


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

    # Resolve detached HEAD → real branch name so the refspec is always valid
    if not branch or branch in ("HEAD", "unknown"):
        sym_out, _, sym_rc = _run(["git", "symbolic-ref", "--short", "HEAD"])
        if sym_rc == 0 and sym_out.strip():
            branch = sym_out.strip()

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
            _append('⬇️ Operation: fetch origin --prune --verbose')
            cmd = ["git", "fetch", "origin", "--prune", "--verbose"]
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

        def _exec_cmd(command):
            """Execute command, stream output, return exit code."""
            try:
                proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                   text=True, cwd=PROJECT_PATH, env=run_env)
            except Exception as e:
                _append(f'ERROR: {e}')
                return -1

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
            return proc.returncode

        rc = _exec_cmd(cmd)

        # Auto-fix "cannot lock ref" errors by pruning stale refs and retrying
        if rc != 0 and op == 'fetch':
            lines_text = '\n'.join(job['lines'])
            if 'cannot lock ref' in lines_text or 'unable to update local ref' in lines_text:
                _append_raw('')
                _append('🔧 Detected stale ref lock — running gc & prune, then retrying...')
                _append_raw('$ git gc --prune=now')
                try:
                    subprocess.run(["git", "gc", "--prune=now"], cwd=PROJECT_PATH, env=run_env,
                                 capture_output=True, text=True, timeout=60)
                except subprocess.TimeoutExpired:
                    _append('⚠️ git gc timed out — skipping')
                _append_raw('$ git remote prune origin')
                try:
                    subprocess.run(["git", "remote", "prune", "origin"], cwd=PROJECT_PATH, env=run_env,
                                 capture_output=True, text=True, timeout=30)
                except subprocess.TimeoutExpired:
                    _append('⚠️ git remote prune timed out — skipping')
                _append_raw('$ ' + ' '.join(cmd))
                rc = _exec_cmd(cmd)

        with _PUSH_JOBS_LOCK:
            job['done'] = True
            job['ok'] = (rc == 0)
            if rc != 0:
                # Only include actual error lines, not verbose status output
                err_lines = [l for l in job['lines'] if any(k in l.lower() for k in ['error', 'fatal', 'failed', 'timed out', 'couldn\'t', 'unable'])]
                job['error'] = '\n'.join(err_lines) if err_lines else '\n'.join(job['lines'][-10:])
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


def get_git_state():
    """Return a snapshot of the current git working-tree state.

    Fields:
      rebaseInProgress – True when .git/rebase-merge or rebase-apply exists
      hasUnmerged      – True when any file is in an unmerged state (UU/AA/DD/…)
      hasUncommitted   – True when there are any uncommitted changes
      unmergedFiles    – list of paths with merge conflicts
    """
    cwd = get_project_path()
    rebase_in_progress = (
        os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or
        os.path.exists(os.path.join(cwd, ".git", "rebase-apply"))
    )
    out, _, _ = _run(["git", "status", "--porcelain"])
    lines = (out or "").splitlines()
    # Unmerged statuses start with UU, AA, DD, AU, UA, DU, UD
    unmerged = [l[3:] for l in lines if len(l) >= 3 and l[:2] in
                {"UU", "AA", "DD", "AU", "UA", "DU", "UD"}]
    return {
        "rebaseInProgress": rebase_in_progress,
        "hasUnmerged": bool(unmerged),
        "unmergedFiles": unmerged,
        "hasUncommitted": bool(out.strip()),
    }


def get_branch_diverge_status(remote_branch=None):
    """Check whether the current branch has diverged from its remote counterpart.

    Returns:
      ahead        – commits local has that remote doesn't
      behind       – commits remote has that local doesn't
      diverged     – True when both ahead > 0 AND behind > 0
      onlyBehind   – True when only behind (no local rewrites, just need pull)
      remoteRef    – the remote tracking ref used for comparison
      ownCommits   – count of commits authored by the current git user (ahead set)
    """
    branch = current_branch()
    if not branch:
        return {"error": "not on a branch"}

    # Determine remote ref to compare against
    remote_ref = remote_branch
    if not remote_ref:
        # Try configured upstream
        up_out, _, up_rc = _run(["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
        if up_rc == 0 and up_out.strip():
            remote_ref = up_out.strip()
        else:
            remote_ref = f"origin/{branch}"

    # Verify the remote ref exists
    _, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
    if probe_rc != 0:
        return {"error": f"remote ref not found: {remote_ref}", "remoteRef": remote_ref}

    ahead_out, _, _ = _run(["git", "rev-list", "--count", f"{remote_ref}..HEAD"])
    behind_out, _, _ = _run(["git", "rev-list", "--count", f"HEAD..{remote_ref}"])

    try:
        ahead = int(ahead_out.strip())
        behind = int(behind_out.strip())
    except ValueError:
        ahead = behind = 0

    # Count own commits in the ahead set
    user_email_out, _, _ = _run(["git", "config", "user.email"])
    user_email = user_email_out.strip()
    own = 0
    if ahead > 0 and user_email:
        own_out, _, _ = _run(["git", "log", "--format=%ae", f"{remote_ref}..HEAD"])
        own = sum(1 for e in own_out.splitlines() if e.strip() == user_email)

    return {
        "branch": branch,
        "remoteRef": remote_ref,
        "ahead": ahead,
        "behind": behind,
        "diverged": ahead > 0 and behind > 0,
        "onlyBehind": ahead == 0 and behind > 0,
        "ownCommits": own,
    }


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


def commit_files(commit_hash):
    """List changed file paths for a specific commit."""
    out, _, _ = _run(["git", "show", "--name-only", "--pretty=format:", commit_hash])
    files = [l.strip() for l in out.splitlines() if l.strip()]
    return files


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
    If branch exists, check it out; if not, create it with -b.
    Returns (stdout, stderr, returncode)."""
    path = os.path.abspath(os.path.expanduser(path))
    if not branch:
        return "", "Branch name is required", -1
    # Check if path already exists
    if os.path.exists(path):
        return "", f"Path already exists: {path}", -1
    # Check if branch already exists (local or remote tracking)
    _, _, rc = _run(["git", "rev-parse", "--verify", branch])
    if rc == 0:
        return _run(["git", "worktree", "add", path, branch])
    # Check if there's a remote tracking branch
    _, _, rc2 = _run(["git", "rev-parse", "--verify", f"origin/{branch}"])
    if rc2 == 0:
        return _run(["git", "worktree", "add", path, branch])
    # Branch doesn't exist — create it with -b
    return _run(["git", "worktree", "add", "-b", branch, path])


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


def is_rebase_in_progress():
    """Return True when .git has an in-progress rebase state."""
    cwd = get_project_path()
    return os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
        os.path.exists(os.path.join(cwd, ".git", "rebase-apply"))


def check_rebase_safety(source):
    """
    Pre-flight check before rebasing current branch onto source.

    Returns a dict:
      hasMergeCommits  – True if branch-exclusive history has merge commits
      foreignCommits   – list of {hash, author, subject} for commits not by the
                         current git user found in the branch-exclusive range
      ownCommitCount   – number of commits authored by current user in range
      totalCommitCount – total commits in range
      warning          – human-readable warning string (empty if safe)
    """
    result = {
        "hasMergeCommits": False,
        "foreignCommits": [],
        "ownCommitCount": 0,
        "totalCommitCount": 0,
        "warning": "",
    }

    # Resolve the base ref (prefer origin/ remote ref when available)
    base_ref = source
    remote_ref = source if source.startswith("origin/") else f"origin/{source}"
    probe, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
    if probe_rc == 0:
        base_ref = remote_ref

    merge_base_out, _, mb_rc = _run(["git", "merge-base", "HEAD", base_ref])
    if mb_rc != 0:
        return result
    merge_base = merge_base_out.strip()
    if not merge_base:
        return result

    # Detect merge commits in branch-exclusive range
    mc_out, _, _ = _run(["git", "log", "--merges", "--oneline", f"{merge_base}..HEAD"])
    if (mc_out or "").strip():
        result["hasMergeCommits"] = True

    # Get current user email for author comparison
    user_email_out, _, _ = _run(["git", "config", "user.email"])
    user_email = (user_email_out or "").strip().lower()
    user_name_out, _, _ = _run(["git", "config", "user.name"])
    user_name = (user_name_out or "").strip().lower()

    # List all commits in range with author info
    log_out, _, log_rc = _run([
        "git", "log", "--no-merges",
        "--format=%H\x1f%ae\x1f%an\x1f%s",
        f"{merge_base}..HEAD"
    ])
    if log_rc != 0:
        return result

    for line in (log_out or "").splitlines():
        parts = line.split("\x1f", 3)
        if len(parts) < 4:
            continue
        h, ae, an, subj = parts
        result["totalCommitCount"] += 1
        is_own = (user_email and ae.strip().lower() == user_email) or \
                 (user_name and an.strip().lower() == user_name)
        if is_own:
            result["ownCommitCount"] += 1
        else:
            result["foreignCommits"].append({
                "hash": h.strip()[:8],
                "author": an.strip() or ae.strip(),
                "subject": subj.strip(),
            })

    warnings = []
    if result["hasMergeCommits"]:
        warnings.append(
            "Branch history contains merge commits. Rebasing will replay all "
            "merged commits as new commits on this branch, including commits "
            "from other authors."
        )
    if result["foreignCommits"]:
        authors = list({c["author"] for c in result["foreignCommits"]})
        warnings.append(
            f"Found {len(result['foreignCommits'])} commit(s) from other "
            f"author(s) ({', '.join(authors[:3])}) in branch-exclusive history. "
            "These will be replayed by rebase."
        )
    result["warning"] = " ".join(warnings)
    return result


def rebase_current_onto(source, fetch_first=True):
    """Rebase current branch onto source.

    Always fetches from origin first (unless fetch_first=False) so that remote
    tracking refs are up to date before the merge-base is computed.
    Prefers origin/<source> over a potentially stale local branch ref.
    """
    if fetch_first:
        _run(["git", "fetch", "origin", "--prune"])

    # Use the remote tracking ref when available so we rebase on the latest
    # remote state, not a possibly stale local branch.
    base_ref = source
    if not source.startswith("origin/"):
        remote_ref = f"origin/{source}"
        _, _, probe_rc = _run(["git", "rev-parse", "--verify", remote_ref])
        if probe_rc == 0:
            base_ref = remote_ref

    out, err, rc = _run(["git", "-c", "rebase.autoStash=false", "rebase", base_ref])
    branch = current_branch() or "?"
    _write_local_log("rebase-onto", [
        f"branch={branch}  onto={base_ref}  rc={rc}",
        out.strip() if out else "",
        ("ERROR: " + err.strip()) if err and rc != 0 else (err.strip() if err else ""),
    ])
    return out, err, rc


def rebase_abort():
    """Abort an in-progress rebase."""
    return _run(["git", "rebase", "--abort"])


def rebase_skip():
    """Skip the current conflicting commit during a rebase."""
    return _run(["git", "rebase", "--skip"])


def rebase_continue():
    """Continue an in-progress rebase after conflicts are resolved."""
    env = {"GIT_EDITOR": "true"}
    out, err, rc = _run(["git", "rebase", "--continue"], env=env)
    _write_local_log("rebase-continue", [
        f"rc={rc}",
        out.strip() if out else "",
        ("ERROR: " + err.strip()) if err and rc != 0 else (err.strip() if err else ""),
    ])
    return out, err, rc

def rebase_rebuild_keep_head_and_force_push(base_branch, remote_branch=None):
    """
    Rebuild current branch on top of base_branch by keeping only the current HEAD commit,
    then force-push to origin.

    Sequence:
      1) ensure clean working tree
      2) capture current HEAD hash
      3) reset --hard <base_branch>
      4) cherry-pick captured HEAD commit
      5) git push --force-with-lease origin <branch>:<remote_branch>
    """
    base = (base_branch or "").strip()
    if not base:
        return "", "base_branch is required", -1

    branch = (current_branch() or "").strip()
    if not branch or branch == "HEAD":
        return "", "Detached HEAD is not supported for this operation", -1

    target_remote = (remote_branch or branch).strip() or branch
    refspec = f"{branch}:{target_remote}" if target_remote != branch else branch
    logs = []

    def _record(cmd, out, err, rc):
        logs.append("$ " + " ".join(cmd))
        if out:
            logs.append(out.strip())
        if err:
            logs.append(err.strip())
        logs.append(f"[rc={rc}]")
        logs.append("")

    # Safety: require clean working tree.
    s_out, s_err, s_rc = _run(["git", "status", "--porcelain"])
    _record(["git", "status", "--porcelain"], s_out, s_err, s_rc)
    if s_rc != 0:
        return "\n".join(logs).strip(), s_err or s_out or "Failed to check working tree", s_rc
    if (s_out or "").strip():
        return "\n".join(logs).strip(), "Working tree is not clean. Please commit/stash changes first.", -1

    # Validate base exists.
    b_out, b_err, b_rc = _run(["git", "rev-parse", "--verify", base])
    _record(["git", "rev-parse", "--verify", base], b_out, b_err, b_rc)
    if b_rc != 0:
        return "\n".join(logs).strip(), b_err or b_out or f"Base branch not found: {base}", b_rc

    # Capture original HEAD commit to keep.
    h_out, h_err, h_rc = _run(["git", "rev-parse", "HEAD"])
    _record(["git", "rev-parse", "HEAD"], h_out, h_err, h_rc)
    if h_rc != 0 or not (h_out or "").strip():
        return "\n".join(logs).strip(), h_err or h_out or "Cannot resolve HEAD commit", h_rc if h_rc != 0 else -1
    keep_commit = h_out.strip()

    # Reset branch to base.
    r_cmd = ["git", "reset", "--hard", base]
    r_out, r_err, r_rc = _run(r_cmd)
    _record(r_cmd, r_out, r_err, r_rc)
    if r_rc != 0:
        return "\n".join(logs).strip(), r_err or r_out or "Reset to base failed", r_rc

    # Re-apply the previous HEAD commit (with GPG signing if enabled).
    gpg_flag = ["-S"] if get_gpg_sign() else []
    c_cmd = ["git", "cherry-pick"] + gpg_flag + [keep_commit]
    c_out, c_err, c_rc = _run(c_cmd)
    _record(c_cmd, c_out, c_err, c_rc)
    if c_rc != 0:
        # Handle "empty cherry-pick" state by skipping it.
        combined = ((c_out or "") + "\n" + (c_err or "")).lower()
        if "previous cherry-pick is now empty" in combined or "nothing to commit" in combined:
            sk_cmd = ["git", "cherry-pick", "--skip"]
            sk_out, sk_err, sk_rc = _run(sk_cmd)
            _record(sk_cmd, sk_out, sk_err, sk_rc)
            if sk_rc != 0:
                _write_local_log("rebuild-force-push", logs + [f"FAILED: {sk_err or sk_out}"])
                return "\n".join(logs).strip(), sk_err or sk_out or "Empty cherry-pick skip failed", sk_rc
        else:
            _write_local_log("rebuild-force-push", logs + [f"FAILED: {c_err or c_out}"])
            return "\n".join(logs).strip(), c_err or c_out or "Cherry-pick failed", c_rc

    # Force push to remote.
    p_cmd = ["git", "push", "--force-with-lease", "origin", refspec]
    p_out, p_err, p_rc = _run(p_cmd)
    _record(p_cmd, p_out, p_err, p_rc)
    if p_rc != 0:
        _write_local_log("rebuild-force-push", logs + [f"FAILED push: {p_err or p_out}"])
        return "\n".join(logs).strip(), p_err or p_out or "Force push failed", p_rc

    _write_local_log("rebuild-force-push", logs + ["SUCCESS"])
    return "\n".join(logs).strip(), "", 0


def fetch():
    """Fetch from origin with pruning."""
    out, err, rc = _run(["git", "fetch", "origin", "--prune", "--verbose"])
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


def is_valid_commit_path(path):
    """Return True if path is safe and meaningful for staging/commit UI actions."""
    p = (path or "").strip().replace("\\", "/")
    if not p:
        return False
    if p in {".", "./"}:
        return False
    # Prevent path traversal / out-of-repo paths.
    if p.startswith("/") or p.startswith("../") or "/../" in p:
        return False
    low = p.lower().rstrip("/")
    # Exclude noisy/generated package folders that should not appear in commit list.
    if low in {"sourcepackage", "sourcepackages"}:
        return False
    if low.startswith("sourcepackage/") or low.startswith("sourcepackages/"):
        return False
    return True


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
        if not is_valid_commit_path(p):
            continue
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


def _release_refs_for_commit(commit_hash: str) -> list:
    """Return release-like refs containing the commit (local/remote branches or tags)."""
    if not commit_hash:
        return []
    out, _, rc = _run([
        "git", "for-each-ref",
        "--format=%(refname:short)",
        "--contains", commit_hash,
        "refs/heads", "refs/remotes/origin", "refs/tags",
    ])
    if rc != 0 or not out.strip():
        return []
    seen = set()
    labels = []
    for raw in out.splitlines():
        name = (raw or "").strip()
        if not name:
            continue
        low = name.lower()
        if low == "origin/head" or low.endswith("/head"):
            continue
        if "release" not in low:
            continue
        if name.startswith("origin/"):
            name = name[7:]
        if name not in seen:
            seen.add(name)
            labels.append(name)
        if len(labels) >= 6:
            break
    return labels


def _attach_release_refs(commits: list) -> list:
    """Attach release refs for each commit row."""
    for c in commits:
        h = c.get("hash", "")
        c["release_refs"] = _release_refs_for_commit(h)
    return commits


def get_commit_log(page=1, per_page=10, search="", order="desc", unsigned_only=False):
    """Return paginated commit log with optional search.

    Each commit dict includes:
      - ``pushed``     boolean – whether the commit is on origin/<branch>
      - ``gpg_status`` string  – git %G? value: G=good, U=untrusted, N=none, B=bad, E=error
    When ``unsigned_only=True`` only commits with gpg_status in (N, B, E) are returned.
    """
    branch = current_branch()
    skip = (page - 1) * per_page if per_page > 0 else 0
    fmt = "--pretty=format:%H||%an||%ad||%G?||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"

    root_out, _, _ = _run(["git", "rev-list", "--max-parents=0", "HEAD"])
    root_hashes = set(h.strip() for h in root_out.splitlines() if h.strip())

    # Collect unpushed hashes once for the current branch
    unpushed = _get_unpushed_hashes(branch)

    _UNSIGNED = frozenset(("N", "B", "E"))

    def _parse(lines):
        result = []
        for line in lines:
            line = line.strip()
            if not line: continue
            parts = line.split("||", 4)
            if len(parts) == 5:
                h, author, date, gpg, message = parts
            elif len(parts) == 4:
                # fallback: no gpg field (old format)
                h, author, date, message = parts
                gpg = ""
            else:
                continue
            result.append({"hash": h, "short_hash": h[:7],
                            "author": author, "date": date, "message": message,
                            "gpg_status": gpg,
                            "is_root": h in root_hashes,
                            "pushed": h not in unpushed})
        return result

    if not search:
        if unsigned_only:
            # Fetch all commits and filter client-side for unsigned
            out, _, _ = _run(["git", "log", branch, date_fmt, fmt])
            commits = _parse(out.splitlines())
            commits = [c for c in commits if c["gpg_status"] in _UNSIGNED]
            if order == "asc":
                commits = list(reversed(commits))
            total = len(commits)
            page_commits = commits[skip:skip + per_page] if per_page > 0 else commits
            page_commits = _attach_release_refs(page_commits)
            return {"commits": page_commits, "total": total, "page": page, "per_page": per_page, "order": order}

        rev_order = [] if order == "desc" else ["--reverse"]
        count_out, _, _ = _run(["git", "rev-list", "--count", branch])
        total = int(count_out.strip()) if count_out.strip().isdigit() else 0
        out, _, _ = _run(["git", "log", branch, date_fmt, fmt,
                          "--skip", str(skip), "-n", str(per_page)] + rev_order)
        commits = _attach_release_refs(_parse(out.splitlines()))
        return {"commits": commits, "total": total, "page": page, "per_page": per_page, "order": order}

    # Full-text search on ALL commits reachable from current branch (no 50/500 cap).
    # This is intentionally exhaustive for reliable hash lookup.
    out, _, _ = _run(["git", "log", branch, date_fmt, fmt])
    q = search.lower()
    all_lines = []
    for l in out.splitlines():
        l = l.strip()
        if not l:
            continue
        parts = l.split("||", 4)
        if len(parts) not in (4, 5):
            continue
        h = parts[0]
        author = parts[1]
        msg = parts[4] if len(parts) == 5 else parts[3]
        gpg = parts[3] if len(parts) == 5 else ""
        if q in h.lower() or q in (author or "").lower() or q in (msg or "").lower():
            if unsigned_only and gpg not in _UNSIGNED:
                continue
            all_lines.append(l)

    if order == "asc":
        all_lines = list(reversed(all_lines))
    total = len(all_lines)
    commits = _parse(all_lines)
    page_commits = commits[skip:skip + per_page] if per_page > 0 else commits
    page_commits = _attach_release_refs(page_commits)
    return {"commits": page_commits, "total": total, "page": page, "per_page": per_page, "order": order}


def _pr_state_query_clause(state: str) -> str:
    if state == "in_review":
        return "is:open"
    if state == "closed":
        return "is:closed -is:merged"
    return "is:merged"


def _pull_request_total_count(state="in_review", search=""):
    owner, repo = _gh_repo_slug()
    if not owner or not repo:
        owner, repo = _origin_repo_slug()
    if not owner or not repo:
        return None
    q_parts = [f"repo:{owner}/{repo}", "is:pr", _pr_state_query_clause(state)]
    if (search or "").strip():
        q_parts.append((search or "").strip())
    query_str = " ".join(p for p in q_parts if p).strip()
    gql = "query($q: String!) { search(query: $q, type: ISSUE) { issueCount } }"
    out, _, rc = _run([
        "gh", "api", "graphql",
        "-f", "query=" + gql,
        "-f", "q=" + query_str,
    ])
    if rc != 0:
        return None
    try:
        data = json.loads(out or "{}")
        return int((((data or {}).get("data") or {}).get("search") or {}).get("issueCount", 0))
    except Exception:
        return None


_PR_AUTHOR_NAME_CACHE = {}
def _author_name_from_commit(head_sha):
    sha = (head_sha or "").strip()
    if not sha:
        return ""
    cached = _PR_AUTHOR_NAME_CACHE.get(sha)
    if cached is not None:
        return cached
    out, _, rc = _run(["git", "show", "-s", "--format=%an", sha])
    name = out.strip() if rc == 0 and out.strip() else ""
    _PR_AUTHOR_NAME_CACHE[sha] = name
    return name


def get_pull_requests(page=1, per_page=10, state="in_review", search=""):
    """Return paginated pull requests from current repo via gh CLI."""
    if state == "in_review":
        gh_state = "open"
        gh_search = ""
    elif state == "closed":
        gh_state = "closed"
        gh_search = "is:closed -is:merged"
    else:
        gh_state = "merged"
        gh_search = ""
    if per_page == 0:
        # "All" mode still needs a hard cap.
        fetch_limit = 1000
    else:
        # Incremental fetch: only request enough for current pagination window,
        # with a small buffer to keep UX smooth on next-page clicks.
        needed = max(1, page) * max(1, per_page)
        fetch_limit = min(1000, max(100, needed + 40))
    user_search = (search or "").strip()
    cli_search = " ".join(x for x in [gh_search, user_search] if x).strip()
    cmd = [
        "gh", "pr", "list",
        "--state", gh_state,
        "--limit", str(fetch_limit),
        "--json", "number,title,author,updatedAt,createdAt,state,isDraft,url,headRefName,baseRefName,mergedAt,headRefOid",
    ]
    if cli_search:
        cmd.extend(["--search", cli_search])
    out, err, rc = _run(cmd)
    if rc != 0:
        return {
            "pull_requests": [],
            "total": 0,
            "page": page,
            "per_page": per_page,
            "state": state,
            "error": err or out or "Failed to load pull requests",
        }

    try:
        rows = json.loads(out or "[]")
    except json.JSONDecodeError:
        rows = []

    prs = []
    for r in rows:
        number = r.get("number")
        title = r.get("title", "")
        author_obj = r.get("author") or {}
        author_login = (author_obj.get("login") or "").strip()
        author_name = (author_obj.get("name") or "").strip()
        head_sha = (r.get("headRefOid") or "").strip()
        if not author_name:
            author_name = _author_name_from_commit(head_sha)
        author = author_login
        if author_name and author_login and author_name.lower() != author_login.lower():
            author_display = f"{author_name} (@{author_login})"
        else:
            author_display = author_name or author_login
        created = (r.get("createdAt") or "")[:16].replace("T", " ")
        updated = (r.get("updatedAt") or "")[:16].replace("T", " ")
        merged_at = (r.get("mergedAt") or "")[:16].replace("T", " ")
        item = {
            "number": number,
            "title": title,
            "author": author,
            "author_name": author_name,
            "author_login": author_login,
            "author_display": author_display,
            "created_at": created,
            "updated_at": updated,
            "merged_at": merged_at,
            "state": r.get("state", "").lower(),
            "is_draft": bool(r.get("isDraft")),
            "url": r.get("url", ""),
            "head_ref": r.get("headRefName", ""),
            "base_ref": r.get("baseRefName", ""),
            "head_sha": head_sha,
        }
        prs.append(item)

    total = len(prs)
    if per_page == 0:
        page_items = prs
    else:
        skip = max(0, (page - 1) * per_page)
        page_items = prs[skip:skip + per_page]
    return {
        "pull_requests": page_items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "state": state,
    }


def _origin_repo_slug():
    """Return (owner, repo) from origin URL, or ("","") if unavailable."""
    out, _, rc = _run(["git", "remote", "get-url", "origin"])
    if rc != 0 or not out.strip():
        return "", ""
    url = out.strip()
    m = re.search(r"github\.com[:/]+([^/]+)/([^/]+?)(?:\.git)?$", url)
    if not m:
        return "", ""
    return m.group(1), m.group(2)


def _gh_repo_slug():
    """Return (owner, repo) from gh repo context."""
    out, _, rc = _run(["gh", "repo", "view", "--json", "nameWithOwner"])
    if rc != 0:
        return "", ""
    try:
        data = json.loads(out or "{}")
        name = (data or {}).get("nameWithOwner", "")
        if "/" in name:
            owner, repo = name.split("/", 1)
            return owner.strip(), repo.strip()
    except Exception:
        pass
    return "", ""


def pull_request_diff(pr_number):
    """Return unified diff text for a pull request number."""
    num = str(pr_number or "").strip()
    if not num:
        return "", "Pull request number is required", 1

    # Prefer repo-context command; avoids parsing origin URL formats.
    out, err, rc = _run(["gh", "pr", "diff", num])
    if rc == 0 and (out or "").strip():
        return out, "", 0

    # Fallback to REST diff endpoint.
    owner, repo = _origin_repo_slug()
    if not owner or not repo:
        return "", err or "Cannot resolve GitHub owner/repo from origin URL", 1
    return _run([
        "gh", "api",
        "-H", "Accept: application/vnd.github.v3.diff",
        f"repos/{owner}/{repo}/pulls/{num}",
    ])


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


def squash_selected_commits(hashes, msg, gpg_sign=False):
    """Squash a specific set of commits (may be non-adjacent) into one commit.

    Adjacent selection  → fast path: git reset --soft (no conflict risk).
    Non-adjacent        → rebase -i: keep the oldest selected commit in place
                          (mark as `edit`), cherry-pick every other selected
                          commit's diff onto it via `exec`, then `drop` them at
                          their original position.  Middle commits are plain
                          `pick` and stay in their original relative order.

    Returns (ok: bool, message: str).
    """
    import tempfile, stat as _stat

    if not hashes or len(hashes) < 2:
        return False, "Need at least 2 commits to squash"

    branch = current_branch()
    if not branch:
        return False, "Not on any branch"

    selected_set = set(h.strip() for h in hashes)

    # Full commit list from HEAD, newest first → reverse to oldest first
    log_out, _, log_rc = _run(["git", "log", "--format=%H", "HEAD"])
    if log_rc != 0:
        return False, "Cannot read commit log"
    all_hashes_oldest_first = list(reversed(
        [h.strip() for h in log_out.strip().splitlines() if h.strip()]
    ))

    # Validate all selected hashes exist
    present = [h for h in all_hashes_oldest_first if h in selected_set]
    if len(present) < len(selected_set):
        return False, "Some selected commits were not found in branch history"

    # Oldest selected commit is the anchor (rebase base)
    oldest_selected = present[0]
    mb_out, _, mb_rc = _run(["git", "rev-parse", oldest_selected + "^"])
    if mb_rc != 0:
        return False, "Cannot squash: the oldest selected commit is the initial (root) commit"
    rebase_base = mb_out.strip()

    # All commits in the rebase range, oldest first
    range_out, _, _ = _run(["git", "log", "--format=%H", f"{rebase_base}..HEAD"])
    range_hashes = list(reversed(
        [h.strip() for h in range_out.strip().splitlines() if h.strip()]
    ))

    # Detect merge commits in the range
    merge_out, _, _ = _run(["git", "log", "--merges", "--format=%H", f"{rebase_base}..HEAD"])
    merge_set = set(h.strip() for h in merge_out.strip().splitlines() if h.strip())

    selected_merges = [h for h in present if h in merge_set]
    if selected_merges:
        return False, (
            f"Cannot squash merge commit(s): {', '.join(h[:8] for h in selected_merges)}. "
            "Please deselect merge commits and only squash regular commits."
        )

    selected_in_range = [h for h in range_hashes if h in selected_set]  # oldest→newest
    non_selected      = [h for h in range_hashes if h not in selected_set]

    # ── Fast path: all selected commits are adjacent ──────────────────────
    # Check adjacency: no non-selected commit between first and last selected
    first_pos = range_hashes.index(selected_in_range[0])
    last_pos  = range_hashes.index(selected_in_range[-1])
    is_adjacent = all(h in selected_set for h in range_hashes[first_pos:last_pos + 1])

    if is_adjacent:
        # git reset --soft to parent of oldest selected, then re-commit
        _, reset_err, reset_rc = _run(["git", "reset", "--soft", rebase_base])
        if reset_rc != 0:
            return False, reset_err or "git reset --soft failed"
        gpg_flag = ["-S"] if gpg_sign else []
        commit_out, commit_err, commit_rc = _run(["git", "commit"] + gpg_flag + ["-m", msg])
        if commit_rc != 0:
            return False, commit_err or commit_out or "git commit failed"
        return True, f"Squashed {len(selected_in_range)} adjacent commit(s) into 1"

    # ── Non-adjacent path ──────────────────────────────────────────────────
    # Use plain `git rebase -i` (NO --rebase-merges).
    # Merge commits in the range are automatically skipped by git, which means
    # no new merge-commit objects are created referencing unsigned develop
    # parents — solving GitHub "require signed commits" push rejections.
    #
    # Strategy:
    #   oldest selected  → edit  (rebase pauses; we cherry-pick extras + amend)
    #   other selected   → drop  (content already merged via cherry-pick above)
    #   everything else  → pick  (unchanged, replayed in order)
    # Middle non-selected non-merge commits survive unchanged.

    extra_selected = selected_in_range[1:]  # to be cherry-picked onto the first

    gpg_amend = "-S " if gpg_sign else ""
    msg_q = _shell_quote(msg)

    # exec commands inserted right after "edit oldest_selected"
    exec_lines = []
    for h in extra_selected:
        exec_lines.append(f"exec git cherry-pick --no-commit {h}")
    exec_lines.append(
        f"exec git commit --amend {gpg_amend}--allow-empty -m {msg_q}"
    )
    exec_block = "\n".join(exec_lines)


    seq_script = (
        "#!/usr/bin/env python3\n"
        "import sys, re\n"
        f"oldest = {repr(oldest_selected)}\n"
        f"extra  = {repr(set(extra_selected))}\n"
        f"exec_blk = {repr(exec_block)}\n"
        "lines = open(sys.argv[1]).readlines()\n"
        "out   = []\n"
        "for ln in lines:\n"
        "    m = re.match(r'^pick(\\s+)(\\S+)(.*)', ln.rstrip())\n"
        "    if m:\n"
        "        h = m.group(2)\n"
        "        if oldest.startswith(h) or h.startswith(oldest[:12]):\n"
        "            out.append('edit ' + h + m.group(3) + '\\n')\n"
        "            out.append(exec_blk + '\\n')\n"
        "            continue\n"
        "        if any(e.startswith(h[:12]) or h.startswith(e[:12]) for e in extra):\n"
        "            out.append('drop ' + h + m.group(3) + '\\n')\n"
        "            continue\n"
        "    out.append(ln)\n"
        "open(sys.argv[1], 'w').writelines(out)\n"
    )

    seq_f = tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, prefix="git_seq_")
    seq_editor_path = seq_f.name
    seq_f.write(seq_script)
    seq_f.close()
    os.chmod(seq_editor_path, os.stat(seq_editor_path).st_mode | _stat.S_IEXEC | _stat.S_IXGRP | _stat.S_IXOTH)

    ed_f = tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, prefix="git_ed_")
    editor_path = ed_f.name
    ed_f.write(
        "#!/usr/bin/env python3\nimport sys\n"
        + f"open(sys.argv[1],'w').write({repr(msg + chr(10))})\n"
    )
    ed_f.close()
    os.chmod(editor_path, os.stat(editor_path).st_mode | _stat.S_IEXEC | _stat.S_IXGRP | _stat.S_IXOTH)

    try:
        env = {
            "GIT_SEQUENCE_EDITOR": seq_editor_path,
            "GIT_EDITOR": editor_path,
        }
        if gpg_sign:
            env["GIT_COMMITTER_GPGSIGN"] = "true"

        # Do NOT use --rebase-merges: merge commits in the range are silently
        # skipped, preventing new merge-commit objects from being created that
        # reference unsigned base-branch commits (which would trigger GitHub's
        # require-signed-commits rule on push).
        out, err, rc = _run(
            ["git", "rebase", "-i", rebase_base],
            env=env, timeout=180
        )
        if rc != 0:
            _run(["git", "rebase", "--abort"])
            _write_local_log("squash-selected", [
                f"branch={branch}  rc={rc}  selected={len(hashes)}",
                "ERROR: " + (err or out or "rebase failed"),
            ])
            return False, err or out or "Interactive rebase failed"

        # Ensure we land back on the named branch (rebase can leave detached HEAD)
        post_branch = current_branch()
        if post_branch == "HEAD":
            _, _, sw_rc = _run(["git", "checkout", branch])
            if sw_rc != 0:
                _run(["git", "checkout", "-B", branch])

        _write_local_log("squash-selected", [
            f"branch={branch}  adjacent=False  squashed={len(selected_in_range)}",
            out.strip() if out else "",
        ])
        return True, f"Squashed {len(selected_in_range)} non-adjacent commit(s) into 1"
    finally:
        for p in (seq_editor_path, editor_path):

            try:
                os.unlink(p)
            except OSError:
                pass


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
