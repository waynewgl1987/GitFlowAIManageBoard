#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
api_handlers.py — API endpoint handlers for Git Manage Board.
Dispatches GET and POST API requests to git_ops functions.
"""

import os, json, re
from ai_module.ai_provider import (
    test_provider as ai_test_provider,
    start_chat_job, get_job_status,
)
from git_ops import (
    PORT, set_project_path, _MSGLOG, _MSGLOG_LOCK, _PUSH_JOBS, _PUSH_JOBS_LOCK,
    _run, _run_push_streaming, _run_gitop_streaming,
    current_branch, display_branch, get_project_info,
    get_project_path, get_protected_config, is_branch_protected,
    get_network_timeout, save_network_timeout,
    _ref_exists, _resolve_ref_for_compare,
    get_branches, has_uncommitted, stash_changes,
    stash_list, stash_diff, commit_diff, search_diff_code,
    stash_pop, stash_drop, file_commit_diff,
    checkout_branch, create_branch,
    delete_branch_local, delete_branch_remote, rename_branch,
    fetch, pull_current, set_upstream, push_set_upstream,
    get_conflicts, get_conflict_detail,
    _get_merge_type, _get_merge_default_msg,
    resolve_conflict, get_file_commits,
    get_uncommitted_changes, get_commit_log,
    reset_to, revert_commit, drop_commit, squash_commits, abort_merge_or_rebase,
    rebase_abort, rebase_skip, rebase_continue,
    worktree_list, worktree_add, worktree_remove, worktree_prune,
    get_git_graph,
)


def json_result(rc, stdout="", stderr="", extra=None):
    """Canonical API response: {"ok": bool, "stdout": str, "error": str, ...}"""
    result = {
        "ok": rc == 0,
        "stdout": stdout,
        "error": (stderr or stdout) if rc != 0 else ""
    }
    if extra:
        result.update(extra)
    return result


def handle_get(path, params, send_json, send_stream=None):
    """Dispatch GET API requests. Returns True if handled."""

    if path == "/api/files":
        send_json({"files": get_uncommitted_changes()})
        return True

    elif path == "/api/current-branch":
        send_json({"branch": display_branch()})
        return True

    elif path == "/api/project-name":
        send_json(get_project_info())
        return True

    elif path == "/api/project-path":
        send_json({"path": get_project_path()})
        return True

    elif path == "/api/check-project-path":
        import os as _os
        check_path = params.get("path", [""])[0]
        check_path = _os.path.abspath(_os.path.expanduser(check_path))
        git_dir = _os.path.join(check_path, ".git")
        valid = _os.path.isdir(check_path) and (_os.path.isdir(git_dir) or _os.path.isfile(git_dir))
        send_json({"valid": valid, "path": check_path})
        return True

    elif path == "/api/network-timeout":
        send_json({"network_timeout": get_network_timeout()})
        return True

    elif path == "/api/protected-branches":
        send_json(get_protected_config())
        return True

    elif path == "/api/git-graph":
        max_n = int(params.get("max", ["150"])[0])
        send_json(get_git_graph(max_n))
        return True

    elif path == "/api/branches":
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["20"])[0])
        send_json(get_branches(page, per_page))
        return True

    elif path == "/api/has-uncommitted":
        send_json({"hasChanges": has_uncommitted()})
        return True

    elif path == "/api/unpushed-count":
        out, _, rc = _run(["git", "rev-list", "--count", "@{u}..HEAD"])
        count = int(out.strip()) if rc == 0 and out.strip().isdigit() else 0
        send_json({"count": count})
        return True

    elif path == "/api/stash-list":
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["10"])[0])
        send_json(stash_list(page, per_page))
        return True

    elif path == "/api/stash-diff":
        idx = params.get("index", ["0"])[0]
        send_json({"diff": stash_diff(idx)})
        return True

    elif path == "/api/commit-diff":
        commit = params.get("commit", [""])[0]
        send_json({"diff": commit_diff(commit)})
        return True

    elif path == "/api/file-commit-diff":
        commit = params.get("commit", [""])[0]
        file_path = params.get("file", [""])[0]
        send_json({"diff": file_commit_diff(commit, file_path)})
        return True

    elif path == "/api/conflicts":
        cf = get_conflicts()
        send_json({"files": cf, "count": len(cf)})
        return True

    elif path == "/api/commits":
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["10"])[0])
        search = params.get("search", [""])[0]
        order = params.get("order", ["desc"])[0]
        send_json(get_commit_log(page, per_page, search, order))
        return True

    elif path == "/api/search-diff":
        pattern = params.get("pattern", [""])[0]
        max_count = int(params.get("max_count", ["200"])[0])
        send_json(search_diff_code(pattern, max_count))
        return True

    elif path == "/api/file-commits":
        file_path = params.get("file", [""])[0]
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["20"])[0])
        send_json(get_file_commits(file_path, page, per_page))
        return True

    elif path == "/api/push-status":
        job_id = params.get("jobId", [""])[0]
        with _PUSH_JOBS_LOCK:
            job = _PUSH_JOBS.get(job_id)
        if not job:
            send_json({"ok": False, "error": "Job not found"}, 404)
        else:
            with _PUSH_JOBS_LOCK:
                send_json(dict(job))
        return True

    elif path == "/api/compare":
        base = params.get("base", [""])[0]
        head = params.get("head", [""])[0]
        base_source = params.get("base_source", ["auto"])[0]
        head_source = params.get("head_source", ["auto"])[0]
        if not base or not head:
            send_json({"ok": False, "error": "base and head required"}, 400)
            return True
        cwd = get_project_path()
        base_ref = _resolve_ref_for_compare(base, base_source)
        head_ref = _resolve_ref_for_compare(head, head_source)
        if not _ref_exists(base_ref):
            send_json({"ok": False, "error": f"Branch A not found: {base_ref}"}, 400)
            return True
        if not _ref_exists(head_ref):
            send_json({"ok": False, "error": f"Branch B not found: {head_ref}"}, 400)
            return True
        diff_cmd = ["git", "diff", f"{head_ref}...{base_ref}"]
        stat_cmd = ["git", "diff", "--stat", f"{head_ref}...{base_ref}"]
        log_cmd = ["git", "log", "--oneline", f"{head_ref}..{base_ref}"]
        diff_out, diff_err, diff_rc = _run(diff_cmd)
        stat_out, _, _ = _run(stat_cmd)
        log_out, _, _ = _run(log_cmd)
        commits = [l for l in log_out.splitlines() if l.strip()]
        file_lines = [l for l in stat_out.splitlines() if " | " in l or "=>" in l]
        send_json({
            "base": base, "head": head,
            "base_source": base_source, "head_source": head_source,
            "base_ref": base_ref, "head_ref": head_ref,
            "diff": diff_out,
            "diff_err": diff_err,
            "diff_rc": diff_rc,
            "stat": stat_out,
            "commits": commits,
            "file_count": len(file_lines),
            "cwd": cwd,
            "cmd": " ".join(diff_cmd)
        })
        return True

    elif path == "/api/ignored-list":
        gitignore_path = os.path.join(get_project_path(), '.gitignore')
        try:
            with open(gitignore_path, 'r') as gf:
                entries = [l.strip() for l in gf.read().splitlines()
                           if l.strip() and not l.strip().startswith('#')]
        except FileNotFoundError:
            entries = []
        send_json({"entries": entries})
        return True

    elif path == "/api/ai/chat-status":
        job_id = params.get("jobId", [""])[0]
        status = get_job_status(job_id)
        if not status:
            send_json({"ok": False, "error": "Job not found"}, 404)
        else:
            send_json(status)
        return True

    elif path == "/api/latest-commit-diff":
        from git_ops import get_latest_commit_diff
        send_json(get_latest_commit_diff())
        return True

    elif path == "/api/commit-diff-compare":
        from git_ops import get_commit_diff_compare
        base_hash = params.get("base", [""])[0].strip()
        head_hash = params.get("head", ["HEAD"])[0].strip() or "HEAD"
        if not base_hash:
            send_json({"ok": False, "error": "base commit hash required"}, 400)
            return True
        send_json(get_commit_diff_compare(base_hash, head_hash))
        return True

    elif path == "/api/worktrees":
        trees, err, rc = worktree_list()
        send_json({"ok": rc == 0, "worktrees": trees, "error": err if rc != 0 else ""})
        return True

    return False


def handle_post(path, data, send_json):

    if path == "/api/switch-project":
        new_path = data.get("path", "").strip()
        if not new_path:
            send_json({"ok": False, "error": "path required"}, 400)
            return True
        ok, msg = set_project_path(new_path)
        send_json({"ok": ok, "path": msg if ok else "", "error": msg if not ok else ""})
        return True

    if path == "/api/browse-project":
        import subprocess, platform
        selected = ""
        try:
            system = platform.system()
            if system == "Darwin":
                r = subprocess.run(
                    ["osascript", "-e",
                     'POSIX path of (choose folder with prompt "Select Git Project")'],
                    capture_output=True, text=True, timeout=300,
                )
                selected = r.stdout.strip()
            elif system == "Windows":
                import tempfile, os as _os
                vbs = (
                    'Set objShell = CreateObject("Shell.Application")\r\n'
                    'Set objFolder = objShell.BrowseForFolder(0, "Select Git Project", 0, 17)\r\n'
                    'If Not objFolder Is Nothing Then\r\n'
                    '    WScript.Echo objFolder.Self.Path\r\n'
                    'End If'
                )
                tmp = tempfile.NamedTemporaryFile(suffix=".vbs", delete=False, mode="w")
                tmp.write(vbs)
                tmp.close()
                r = subprocess.run(
                    ["cscript", "//Nologo", tmp.name],
                    capture_output=True, text=True, timeout=300,
                )
                _os.unlink(tmp.name)
                selected = r.stdout.strip()
            else:
                # Linux: try zenity, then kdialog
                for cmd in (["zenity", "--file-selection", "--directory", "--title=Select Git Project"],
                             ["kdialog", "--getexistingdirectory"]):
                    try:
                        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
                        if r.returncode == 0 and r.stdout.strip():
                            selected = r.stdout.strip()
                            break
                    except Exception:
                        pass
        except Exception:
            selected = ""
        send_json({"ok": True, "path": selected if selected else ""})
        return True

    if path == "/api/toggle":
        fp = data.get("path", "")
        action = data.get("action")
        if action == "add":
            stdout, stderr, rc = _run(["git", "add", fp])
        else:
            stdout, stderr, rc = _run(["git", "reset", "--", fp])
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/ignore":
        fp = data.get("path", "").strip()
        if not fp:
            send_json({"ok": False, "error": "No path"}, 400)
            return True
        abs_fp = os.path.join(get_project_path(), fp)
        entry = fp.rstrip('/') + ('/' if (os.path.isdir(abs_fp) or fp.endswith('/')) else '')
        gitignore_path = os.path.join(get_project_path(), '.gitignore')
        try:
            with open(gitignore_path, 'r') as gf: lines = gf.read().splitlines()
        except FileNotFoundError:
            lines = []
        if entry not in lines:
            lines.append(entry)
            with open(gitignore_path, 'w') as gf: gf.write('\n'.join(lines) + '\n')
        _run(["git", "rm", "--cached", "-r", "--ignore-unmatch", "--", fp])
        send_json({"ok": True, "entry": entry})
        return True

    elif path == "/api/unignore":
        entry = data.get("entry", "").strip()
        gitignore_path = os.path.join(get_project_path(), '.gitignore')
        try:
            with open(gitignore_path, 'r') as gf: lines = gf.read().splitlines()
            lines = [l for l in lines if l.strip() != entry]
            with open(gitignore_path, 'w') as gf: gf.write('\n'.join(lines) + '\n')
            send_json({"ok": True})
        except Exception as e:
            send_json({"ok": False, "error": str(e)}, 400)
        return True

    elif path == "/api/commit":
        msg = data.get("message", "")
        paths = data.get("paths", [])
        if not msg:
            send_json({"ok": False, "error": "empty msg"}, 400)
            return True
        if not paths:
            send_json({"ok": False, "error": "no files"}, 400)
            return True
        for p in paths: _run(["git", "add", p])
        _, _, diff_rc = _run(["git", "diff", "--cached", "--quiet"])
        if diff_rc == 0:
            send_json({"ok": False, "error": "Nothing to commit — selected files have no staged changes."}, 400)
            return True
        stdout, stderr, rc = _run(["git", "commit", "-m", msg])
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/checkout":
        branch = data.get("branch", "")
        stdout, stderr, rc = checkout_branch(branch)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/create-branch":
        name = data.get("name", "")
        base = data.get("base", "")
        stdout, stderr, rc = create_branch(name, base if base else None)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/delete-branch":
        name = data.get("name", "")
        scope = data.get("scope", "local")
        force = data.get("force", False)
        if not name:
            send_json({"ok": False, "error": "branch name required"}, 400)
            return True
        short_name = name.replace("origin/", "", 1) if name.startswith("origin/") else name
        if is_branch_protected(short_name):
            send_json({"ok": False, "error": f"Branch '{short_name}' is protected and cannot be deleted."}, 403)
            return True
        if scope == "remote":
            stdout, stderr, rc = delete_branch_remote(name)
        else:
            stdout, stderr, rc = delete_branch_local(name, force=force)
        combined = (stdout + "\n" + stderr).strip()
        not_merged = rc != 0 and ("not fully merged" in stderr or "not fully merged" in stdout)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout, "stderr": stderr,
                       "output": combined, "not_merged": not_merged})
        else:
            send_json({"ok": False, "error": stderr or stdout,
                       "output": combined, "not_merged": not_merged}, 400)
        return True

    elif path == "/api/stash":
        msg = data.get("message", "").strip()
        paths = data.get("paths") or []
        stdout, stderr, rc = stash_changes(msg or None, paths or None)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/stash-pop":
        idx = str(data.get("index", 0))
        stdout, stderr, rc = stash_pop(idx)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/stash-drop":
        idx = str(data.get("index", 0))
        stdout, stderr, rc = stash_drop(idx)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/pull":
        mode = data.get("mode", "merge")
        log, stderr, rc = pull_current(mode)
        if rc == 0:
            send_json({"ok": True, "log": log})
        else:
            send_json({"ok": False, "error": stderr or log, "log": log}, 400)
        return True

    elif path == "/api/network-timeout":
        seconds = data.get("network_timeout")
        ok, result = save_network_timeout(seconds)
        if ok:
            send_json({"ok": True, "network_timeout": result})
        else:
            send_json({"ok": False, "error": result}, 400)
        return True

    elif path == "/api/fetch":
        log, stderr, rc = fetch()
        if rc == 0:
            send_json({"ok": True, "log": log})
        else:
            send_json({"ok": False, "error": stderr or log, "log": log}, 400)
        return True

    elif path == "/api/gitop-start":
        import uuid, threading
        op = data.get("op", "fetch")
        mode = data.get("mode", "merge")
        job_id = str(uuid.uuid4())[:8]
        with _PUSH_JOBS_LOCK:
            _PUSH_JOBS[job_id] = {'lines': [], 'done': False, 'ok': False,
                                  'error': '', 'authRequired': False}
        threading.Thread(target=_run_gitop_streaming, args=(job_id, op, mode), daemon=True).start()
        send_json({"ok": True, "jobId": job_id})
        return True

    elif path == "/api/set-upstream":
        stdout, stderr, rc = set_upstream()
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/push-upstream":
        stdout, stderr, rc = push_set_upstream()
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/push":
        import uuid, threading, tempfile, stat as _stat
        branch = current_branch()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        force = bool(data.get("force", False))
        remote_branch = data.get("remote_branch", "").strip() or None
        remote_url, _, _ = _run(["git", "remote", "get-url", "origin"])
        is_ssh = remote_url.startswith("git@") or remote_url.startswith("ssh://")
        job_id = str(uuid.uuid4())[:8]
        with _PUSH_JOBS_LOCK:
            _PUSH_JOBS[job_id] = {'lines': [], 'done': False, 'ok': False,
                                  'error': '', 'authRequired': False}
        extra_env = None
        tmp_file = None
        if username and password:
            script = f'#!/bin/sh\ncase "$1" in\n  *Username*) echo "{username}";;\n  *Password*) echo "{password}";;\nesac\n'
            with tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False) as f:
                f.write(script); tmp_file = f.name
            os.chmod(tmp_file, _stat.S_IRWXU)
            extra_env = {"GIT_ASKPASS": tmp_file, "GIT_TERMINAL_PROMPT": "0"}
        def _job():
            try:
                _run_push_streaming(job_id, branch, extra_env, force=force, is_ssh=is_ssh, remote_branch=remote_branch)
            finally:
                if tmp_file:
                    try: os.unlink(tmp_file)
                    except: pass
        threading.Thread(target=_job, daemon=True).start()
        send_json({"ok": True, "jobId": job_id})
        return True

    elif path == "/api/merge":
        source = data.get("branch", "").strip()
        message = data.get("message", "").strip()
        if not source:
            send_json({"ok": False, "error": "No branch specified"}, 400)
            return True
        if not message:
            send_json({"ok": False, "error": "Commit message is required"}, 400)
            return True
        out, err, rc = _run(["git", "merge", "--squash", source])
        combined = (out + "\n" + err).strip()
        has_conflict = rc != 0 and ("CONFLICT" in combined or "Automatic merge failed" in combined)
        if rc == 0:
            _, _, diff_rc = _run(["git", "diff", "--cached", "--quiet"])
            if diff_rc == 0:
                send_json({"ok": False, "log": combined, "hasConflict": False,
                           "alreadyUpToDate": True,
                           "error": "Branches are already up to date — no differences to merge."})
            else:
                cout, cerr, crc = _run(["git", "commit", "-m", message])
                combined = (combined + "\n" + cout + "\n" + cerr).strip()
                send_json({"ok": crc == 0, "log": combined, "hasConflict": False,
                           "error": cerr if crc != 0 else ""})
        else:
            send_json({"ok": False, "log": combined, "hasConflict": has_conflict, "error": combined})
        return True

    elif path == "/api/rebase":
        source = data.get("branch", "").strip()
        if not source:
            send_json({"ok": False, "error": "No branch specified"}, 400)
            return True
        out, err, rc = _run(["git", "rebase", source])
        combined = (out + "\n" + err).strip()
        has_conflict = rc != 0 and ("CONFLICT" in combined or "conflict" in combined.lower())
        already_up_to_date = rc == 0 and "is up to date" in combined
        send_json({
            "ok": rc == 0,
            "log": combined,
            "hasConflict": has_conflict,
            "alreadyUpToDate": already_up_to_date,
            "error": combined if rc != 0 else "",
        })
        return True

    elif path == "/api/switch-remote-ssh":
        remote_url, _, rc = _run(["git", "remote", "get-url", "origin"])
        if rc != 0:
            send_json({"ok": False, "error": "Cannot get remote URL"}, 400)
            return True
        url = remote_url.strip()
        new_url = re.sub(r'^https://([^/]+)/(.+)$', r'git@\1:\2', url)
        if new_url == url:
            send_json({"ok": False, "error": "Remote is already SSH or unsupported format"})
        else:
            _, err, rc2 = _run(["git", "remote", "set-url", "origin", new_url])
            if rc2 == 0:
                send_json({"ok": True, "newUrl": new_url})
            else:
                send_json({"ok": False, "error": err}, 400)
        return True

    elif path == "/api/reset-file":
        fp = data.get("file", "")
        commit = data.get("commit", "")
        stdout, stderr, rc = _run(["git", "checkout", commit, "--", fp])
        if rc == 0:
            send_json({"ok": True})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/conflict-detail":
        fp = data.get("path", "")
        send_json(get_conflict_detail(fp))
        return True

    elif path == "/api/resolve-conflict":
        fp = data.get("path", "")
        resolution = data.get("resolution")
        content = data.get("content")
        if resolution:
            stdout, stderr, rc, all_resolved = resolve_conflict(fp, resolution)
        elif content is not None:
            stdout, stderr, rc, all_resolved = resolve_conflict(fp, content)
        else:
            send_json({"ok": False, "error": "no resolution"}, 400)
            return True
        if rc == 0:
            resp = {"ok": True, "all_resolved": all_resolved}
            if all_resolved:
                resp["merge_type"] = _get_merge_type()
                resp["default_msg"] = _get_merge_default_msg()
            send_json(resp)
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/complete-merge":
        msg = data.get("message", "")
        cwd = get_project_path()
        env = {"GIT_EDITOR": "true"}
        if os.path.exists(os.path.join(cwd, ".git", "CHERRY_PICK_HEAD")):
            stdout, stderr, rc = _run(["git", "cherry-pick", "--continue"], env=env)
        elif os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
             os.path.exists(os.path.join(cwd, ".git", "rebase-apply")):
            stdout, stderr, rc = _run(["git", "rebase", "--continue"], env=env)
        elif os.path.exists(os.path.join(cwd, ".git", "MERGE_HEAD")):
            if msg:
                stdout, stderr, rc = _run(["git", "commit", "-m", msg])
            else:
                stdout, stderr, rc = _run(["git", "commit", "--no-edit"], env=env)
        else:
            if not msg:
                send_json({"ok": False, "error": "Commit message required"}, 400)
                return True
            stdout, stderr, rc = _run(["git", "commit", "-m", msg])
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/reset":
        commit = data.get("commit", "")
        mode = data.get("mode", "soft")
        stdout, stderr, rc = reset_to(commit, mode)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/revert":
        commit = data.get("commit", "")
        stdout, stderr, rc = revert_commit(commit)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/drop_commit":
        commit = data.get("commit", "")
        stdout, stderr, rc = drop_commit(commit)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/squash":
        from_h = data.get("from", "")
        to_h = data.get("to", "")
        msg = data.get("message", "")
        stdout, stderr, rc = squash_commits(from_h, to_h, msg)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/rename-branch":
        old_name = data.get("old_name", "").strip()
        new_name = data.get("new_name", "").strip()
        if not old_name or not new_name:
            send_json({"ok": False, "error": "Both old and new branch names are required"}, 400)
            return True
        if is_branch_protected(old_name):
            send_json({"ok": False, "error": f"Cannot rename protected branch '{old_name}'"}, 403)
            return True
        if is_branch_protected(new_name):
            send_json({"ok": False, "error": f"Cannot rename to protected branch name '{new_name}'"}, 403)
            return True
        stdout, stderr, rc = rename_branch(old_name, new_name)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/rebase-abort":
        stdout, stderr, rc = rebase_abort()
        combined = (stdout + "\n" + stderr).strip()
        if rc == 0:
            send_json({"ok": True, "stdout": combined or "Rebase aborted"})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/rebase-skip":
        stdout, stderr, rc = rebase_skip()
        combined = (stdout + "\n" + stderr).strip()
        if rc == 0:
            send_json({"ok": True, "stdout": combined or "Commit skipped"})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/rebase-continue":
        stdout, stderr, rc = rebase_continue()
        combined = (stdout + "\n" + stderr).strip()
        if rc == 0:
            send_json({"ok": True, "stdout": combined or "Rebase continued"})
        else:
            has_conflict = "CONFLICT" in combined or "conflict" in combined.lower()
            send_json({"ok": False, "error": stderr or stdout, "hasConflict": has_conflict}, 400)
        return True

    elif path == "/api/abort":
        stdout, stderr, rc = abort_merge_or_rebase()
        if rc == 0:
            send_json({"ok": True, "stdout": stdout or "reset"})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/ai/test-provider":
        provider = data.get("provider", "")
        api_key  = data.get("api_key", "")
        base_url = data.get("base_url", "")
        model    = data.get("model", "")
        if not provider:
            send_json({"ok": False, "error": "provider is required"}, 400)
            return True
        ok, msg = ai_test_provider(provider, api_key, base_url, model)
        if ok:
            send_json({"ok": True, "message": msg})
        else:
            send_json({"ok": False, "error": msg})
        return True

    elif path == "/api/ai/chat":
        provider = data.get("provider", "openai")
        api_key  = data.get("api_key", "")
        base_url = data.get("base_url", "")
        model    = data.get("model", "")
        messages = data.get("messages", [])
        if not messages:
            send_json({"ok": False, "error": "messages required"}, 400)
            return True
        job_id = start_chat_job(provider, api_key, base_url, model, messages)
        send_json({"ok": True, "jobId": job_id})
        return True

    elif path == "/api/worktree-add":
        path = data.get("path", "").strip()
        branch = data.get("branch", "").strip()
        stdout, stderr, rc = worktree_add(path, branch)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/worktree-remove":
        path = data.get("path", "").strip()
        force = data.get("force", False)
        stdout, stderr, rc = worktree_remove(path, force=force)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/worktree-switch":
        new_path = data.get("path", "").strip()
        if not new_path:
            send_json({"ok": False, "error": "path required"}, 400)
            return True
        ok, msg = set_project_path(new_path)
        send_json({"ok": ok, "path": msg if ok else "", "error": msg if not ok else ""})
        return True

    return False
