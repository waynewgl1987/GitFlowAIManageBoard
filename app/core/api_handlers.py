#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
api_handlers.py — API endpoint handlers for Git Manage Board.
Dispatches GET and POST API requests to git_ops functions.
"""

import os, json, re, threading, time, shlex
from uuid import uuid4 as _uuid4
from ai_module.ai_provider import (
    test_provider as ai_test_provider,
    start_chat_job, get_job_status,
    call_llm,
)
from core.git_ops import (
    PORT, set_project_path, _MSGLOG, _MSGLOG_LOCK, _PUSH_JOBS, _PUSH_JOBS_LOCK,
    _run, _run_push_streaming, _run_gitop_streaming,
    _write_local_log,
    current_branch, display_branch, get_project_info,
    get_project_path, get_protected_config, is_branch_protected,
    get_network_timeout, save_network_timeout,
    get_gpg_sign, save_gpg_sign,
    check_unsigned_commits, get_unsigned_commit_list, squash_unsigned_commits,
    resign_branch_commits, resign_branch_commits_with_autostash,
    detect_base_branch,
    _ref_exists, _resolve_ref_for_compare,
    get_branches, has_uncommitted, get_git_state, get_branch_diverge_status, stash_changes,
    stash_list, stash_diff, commit_diff, commit_files, search_diff_code,
    stash_pop, stash_drop, file_commit_diff,
    pull_request_diff,
    checkout_branch, create_branch,
    delete_branch_local, delete_branch_remote, rename_branch,
    fetch, pull_current, set_upstream, push_set_upstream,
    rebase_current_onto, is_rebase_in_progress, rebase_rebuild_keep_head_and_force_push,
    check_rebase_safety,
    get_conflicts, get_conflict_detail,
    _get_merge_type, _get_merge_default_msg,
    resolve_conflict, get_file_commits,
    get_uncommitted_changes, get_commit_log, get_pull_requests,
    is_valid_commit_path,
    reset_to, revert_commit, drop_commit, squash_commits, squash_selected_commits, squash_conflict_check, abort_merge_or_rebase,
    rebase_abort, rebase_skip, rebase_continue,
    worktree_list, worktree_add, worktree_remove, worktree_prune,
    get_git_graph,
)

_AI_AUTOFIX_JOBS = {}
_AI_AUTOFIX_LOCK = threading.Lock()
_AI_AUTOFIX_TIMEOUT = 180
_ALLOWED_GIT_SUBCOMMANDS = {
    "fetch", "pull", "push", "rebase", "merge", "checkout", "switch",
    "branch", "reset", "restore", "clean", "stash", "remote", "config",
    "add", "commit", "cherry-pick", "revert", "update-ref"
}


def _set_autofix_job(job_id, patch):
    with _AI_AUTOFIX_LOCK:
        cur = dict(_AI_AUTOFIX_JOBS.get(job_id, {}))
        cur.update(patch)
        _AI_AUTOFIX_JOBS[job_id] = cur
        return dict(cur)


def _get_autofix_job(job_id):
    with _AI_AUTOFIX_LOCK:
        d = _AI_AUTOFIX_JOBS.get(job_id)
        return dict(d) if d else None


def _extract_json_object(text):
    raw = (text or "").strip()
    if not raw:
        return None
    if "```" in raw:
        raw = re.sub(r"^```[a-zA-Z0-9_-]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    try:
        return json.loads(raw)
    except Exception:
        pass
    m = re.search(r"\{[\s\S]*\}", raw)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None


def _sanitize_ai_commands(cmds):
    safe = []
    for item in cmds or []:
        cmd_str = (item.get("cmd") if isinstance(item, dict) else item) or ""
        reason = item.get("reason", "") if isinstance(item, dict) else ""
        cmd_str = str(cmd_str).strip()
        if not cmd_str:
            continue
        # Never run shell-composed commands
        if any(x in cmd_str for x in ["&&", "||", ";", "|", "$(", "`", ">", "<"]):
            continue
        try:
            parts = shlex.split(cmd_str)
        except Exception:
            continue
        if len(parts) < 2:
            continue
        if parts[0] != "git":
            continue
        if parts[1] not in _ALLOWED_GIT_SUBCOMMANDS:
            continue
        safe.append({
            "cmd": cmd_str,
            "parts": parts,
            "reason": str(reason or "").strip()
        })
    return safe


def _collect_autofix_context(op_name, err_text):
    status_out, status_err, _ = _run(["git", "status", "--short", "--branch"])
    branch_out, _, _ = _run(["git", "branch", "--show-current"])
    remote_out, _, _ = _run(["git", "remote", "-v"])
    rebase_out, _, _ = _run(["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
    return {
        "operation": op_name or "",
        "error": err_text or "",
        "branch": branch_out.strip(),
        "status": status_out.strip() or status_err.strip(),
        "remote": remote_out.strip(),
        "upstream": rebase_out.strip(),
        "project_path": get_project_path(),
    }


def _build_autofix_prompt(ctx, ui_lang):
    lang = "Simplified Chinese" if ui_lang == "zh" else "English"
    return (
        "You are an expert Git fixer. Analyze the failure and propose SAFE git-only fix commands.\n"
        "Rules:\n"
        "1) Output JSON only.\n"
        "2) Commands must be executable one-by-one and start with `git`.\n"
        "3) Never output shell chaining, redirection, or non-git commands.\n"
        "4) Prefer minimal-risk recovery first.\n"
        "5) Keep summary in " + lang + ".\n"
        "JSON schema:\n"
        "{\n"
        '  "summary": "short explanation",\n'
        '  "commands": [{"cmd":"git ...","reason":"why"}],\n'
        '  "post_check": "what should be true after fix"\n'
        "}\n"
        "Context:\n"
        + json.dumps(ctx, ensure_ascii=False, indent=2)
    )


def _build_lock_ref_fallback_plan(err_text):
    txt = err_text or ""
    low = txt.lower()
    is_lock_ref = ("cannot lock ref" in low) or ("unable to update local ref" in low)
    if not is_lock_ref:
        return None
    refs = set(re.findall(r"refs/remotes/[A-Za-z0-9._/\-]+", txt))
    short_refs = re.findall(r"'(origin/[A-Za-z0-9._/\-]+)'", txt)
    for sr in short_refs:
        refs.add("refs/remotes/" + sr)
    refs = sorted(refs)
    commands = [{
        "cmd": "git remote prune origin",
        "reason": "Clean stale remote-tracking refs that can block updates",
    }]
    for ref in refs[:5]:
        commands.append({
            "cmd": f"git update-ref -d {ref}",
            "reason": "Delete problematic local tracking ref so fetch can recreate it",
        })
    commands.append({
        "cmd": "git fetch origin --prune --verbose",
        "reason": "Re-sync remote-tracking refs after cleanup",
    })
    summary = (
        "Detected stale/locked remote-tracking refs. "
        "This fallback will clean lock files, prune stale refs, delete problematic tracking refs, then fetch again."
    )
    post_check = "Fetch should complete without cannot lock ref / expected OID mismatch errors."
    return {"summary": summary, "post_check": post_check, "commands": commands, "lock_refs": refs}


def _cleanup_remote_ref_lock_files(refs):
    """Remove .git/refs/remotes/... lock files for the extracted refs."""
    project = get_project_path()
    git_dir = os.path.abspath(os.path.join(project, ".git"))
    deleted = []
    not_found = []
    failed = []
    for ref in refs or []:
        if not isinstance(ref, str) or not ref.startswith("refs/remotes/"):
            continue
        rel_lock = ref + ".lock"
        lock_path = os.path.abspath(os.path.join(git_dir, rel_lock))
        if not lock_path.startswith(git_dir + os.sep):
            failed.append(f"{ref}: invalid path")
            continue
        try:
            if os.path.exists(lock_path):
                os.remove(lock_path)
                deleted.append(lock_path)
            else:
                not_found.append(lock_path)
        except Exception as e:
            failed.append(f"{lock_path}: {e}")
    return deleted, not_found, failed


def _autofix_analyze_job(job_id, provider, api_key, base_url, model, op_name, err_text, ui_lang):
    try:
        _set_autofix_job(job_id, {"phase": "analyzing", "progress": 20, "message": "Collecting context..."})
        ctx = _collect_autofix_context(op_name, err_text)
        prompt = _build_autofix_prompt(ctx, ui_lang)
        _set_autofix_job(job_id, {"progress": 45, "message": "Asking AI for a fix plan..."})
        ok, text = call_llm(
            provider,
            api_key,
            base_url,
            model,
            [
                {"role": "system", "content": "You output strict JSON only."},
                {"role": "user", "content": prompt},
            ],
        )
        if not ok:
            _set_autofix_job(job_id, {
                "done": True, "ok": False, "phase": "failed", "progress": 100,
                "error": text or "AI planning failed",
            })
            return
        payload = _extract_json_object(text)
        if not payload:
            _set_autofix_job(job_id, {
                "done": True, "ok": False, "phase": "failed", "progress": 100,
                "error": "AI response is not valid JSON",
                "raw": text[:1200],
            })
            return
        commands = _sanitize_ai_commands(payload.get("commands", []))
        if not commands:
            fallback = _build_lock_ref_fallback_plan(err_text)
            if fallback:
                commands = _sanitize_ai_commands(fallback.get("commands", []))
                if commands:
                    _set_autofix_job(job_id, {
                        "done": True,
                        "ok": True,
                        "phase": "await_confirm",
                        "progress": 100,
                        "summary": fallback.get("summary", ""),
                        "post_check": fallback.get("post_check", ""),
                        "commands": [{"cmd": c["cmd"], "reason": c["reason"]} for c in commands],
                        "_command_parts": [c["parts"] for c in commands],
                        "_lock_refs": fallback.get("lock_refs", []),
                        "context": ctx,
                        "message": "Fallback lock-ref plan ready",
                        "raw": text[:1200],
                    })
                    return
            _set_autofix_job(job_id, {
                "done": True, "ok": False, "phase": "failed", "progress": 100,
                "error": "No safe git commands found in AI plan",
                "summary": payload.get("summary", ""),
                "raw": text[:1200],
            })
            return
        _set_autofix_job(job_id, {
            "done": True,
            "ok": True,
            "phase": "await_confirm",
            "progress": 100,
            "summary": payload.get("summary", ""),
            "post_check": payload.get("post_check", ""),
            "commands": [{"cmd": c["cmd"], "reason": c["reason"]} for c in commands],
            "_command_parts": [c["parts"] for c in commands],
            "context": ctx,
            "message": "AI plan ready",
        })
    except Exception as e:
        _set_autofix_job(job_id, {
            "done": True, "ok": False, "phase": "failed", "progress": 100,
            "error": f"Internal autofix analyze error: {e}",
        })


def _autofix_apply_job(job_id):
    job = _get_autofix_job(job_id)
    if not job:
        return False, "Job not found"
    parts_list = job.get("_command_parts") or []
    if not parts_list:
        _set_autofix_job(job_id, {
            "done": True, "ok": False, "phase": "failed", "progress": 100,
            "error": "No commands to apply",
        })
        return False, "No commands to apply"
    _set_autofix_job(job_id, {
        "done": False, "ok": False, "phase": "applying", "progress": 10,
        "message": "Applying AI fix...",
        "apply_logs": [],
    })
    logs = []
    lock_refs = job.get("_lock_refs") or []
    if lock_refs:
        deleted, not_found, failed = _cleanup_remote_ref_lock_files(lock_refs)
        lock_msg = {
            "cmd": "[internal] cleanup ref lock files",
            "ok": len(failed) == 0,
            "stdout": (
                f"deleted={len(deleted)}, missing={len(not_found)}"
                + (f"\n{chr(10).join(deleted[:10])}" if deleted else "")
            ),
            "stderr": "\n".join(failed[:10]) if failed else "",
        }
        logs.append(lock_msg)
        _set_autofix_job(job_id, {
            "progress": 20,
            "apply_logs": logs,
            "message": "Cleaned lock files",
        })
        if failed:
            _set_autofix_job(job_id, {
                "done": True,
                "ok": False,
                "phase": "failed",
                "progress": 100,
                "error": "Failed to clean one or more lock files",
                "apply_logs": logs,
            })
            return True, ""

    total = len(parts_list)
    for i, parts in enumerate(parts_list):
        cmd_str = " ".join(parts)
        out, err, rc = _run(parts, timeout=_AI_AUTOFIX_TIMEOUT)
        logs.append({
            "cmd": cmd_str,
            "ok": rc == 0,
            "stdout": out[:2000],
            "stderr": err[:2000],
        })
        progress = min(95, int(((i + 1) / total) * 100))
        _set_autofix_job(job_id, {
            "progress": progress,
            "apply_logs": logs,
            "message": f"Applying step {i + 1}/{total}",
        })
        if rc != 0:
            _set_autofix_job(job_id, {
                "done": True,
                "ok": False,
                "phase": "failed",
                "progress": 100,
                "error": err or out or f"Command failed: {cmd_str}",
                "apply_logs": logs,
            })
            return True, ""
    _set_autofix_job(job_id, {
        "done": True,
        "ok": True,
        "phase": "applied",
        "progress": 100,
        "message": "AI fix applied",
        "apply_logs": logs,
    })
    return True, ""


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

    elif path == "/api/gpg-sign":
        send_json({"gpg_sign": get_gpg_sign()})
        return True

    elif path == "/api/detect-base":
        send_json({"ok": True, "base": detect_base_branch()})
        return True

    elif path == "/api/unsigned-commits":
        base = params.get("base", [None])[0] or detect_base_branch()
        send_json(check_unsigned_commits(base))
        return True

    elif path == "/api/unsigned-commit-list":
        base = params.get("base", [None])[0] or detect_base_branch()
        send_json(get_unsigned_commit_list(base))
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

    elif path == "/api/git-state":
        send_json(get_git_state())
        return True

    elif path == "/api/branch-diverge-status":
        remote_branch = data.get("remote_branch", "").strip() or None
        send_json(get_branch_diverge_status(remote_branch))
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

    elif path == "/api/commit-files":
        commit = params.get("commit", [""])[0]
        send_json({"files": commit_files(commit)})
        return True

    elif path == "/api/file-commit-diff":
        commit = params.get("commit", [""])[0]
        file_path = params.get("file", [""])[0]
        send_json({"diff": file_commit_diff(commit, file_path)})
        return True

    elif path == "/api/pull-request-diff":
        number = params.get("number", [""])[0]
        out, err, rc = pull_request_diff(number)
        send_json({"ok": rc == 0, "diff": out if rc == 0 else "", "error": err if rc != 0 else ""})
        return True

    elif path == "/api/conflicts":
        cf = get_conflicts()
        send_json({
            "files": cf,
            "count": len(cf),
            "branch": current_branch(),
            "merge_type": _get_merge_type(),
        })
        return True

    elif path == "/api/head-hash":
        branch = current_branch()
        head_out, _, _ = _run(["git", "rev-parse", "HEAD"])
        head_hash = head_out.strip() if head_out else ""
        count_out, _, _ = _run(["git", "rev-list", "--count", branch])
        total = int(count_out.strip()) if count_out.strip().isdigit() else 0
        send_json({"branch": branch, "hash": head_hash, "total": total})
        return True

    elif path == "/api/commits":
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["10"])[0])
        search = params.get("search", [""])[0]
        order = params.get("order", ["desc"])[0]
        unsigned_only = params.get("unsigned_only", ["0"])[0] == "1"
        send_json(get_commit_log(page, per_page, search, order, unsigned_only))
        return True

    elif path == "/api/pull-requests":
        page = int(params.get("page", ["1"])[0])
        per_page = int(params.get("per_page", ["10"])[0])
        search = params.get("search", [""])[0]
        state = params.get("state", ["in_review"])[0]
        send_json(get_pull_requests(page, per_page, state, search))
        return True

    elif path == "/api/search-diff":
        pattern = params.get("pattern", [""])[0]
        max_count = int(params.get("max_count", ["200"])[0])
        send_json(search_diff_code(pattern, max_count))
        return True

    elif path == "/api/head-reflog":
        limit = 40
        try:
            limit = max(5, min(200, int(params.get("limit", ["40"])[0])))
        except Exception:
            pass
        # Prefer `git reflog HEAD` for a decoded view; fall back to raw file.
        out, err, rc = _run(["git", "reflog", "HEAD", f"-n{limit}", "--date=iso"], timeout=15)
        if rc != 0 or not (out or "").strip():
            try:
                gd = _resolve_git_dir()
                p = os.path.join(gd, "logs", "HEAD")
                with open(p, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.read().splitlines()
                out = "\n".join(lines[-limit:])
            except Exception as e:
                out = ""
                err = err or str(e)
        head_out, _, _ = _run(["git", "rev-parse", "HEAD"], timeout=10)
        br_out, _, _ = _run(["git", "rev-parse", "--abbrev-ref", "HEAD"], timeout=10)
        send_json({
            "ok": True,
            "head": (head_out or "").strip(),
            "branch": (br_out or "").strip(),
            "reflog": out or "",
            "error": err or "",
        })
        return True

    elif path == "/api/check-commits-present":
        raw = params.get("hashes", [""])[0]
        hashes = [h.strip() for h in raw.split(",") if h.strip()]
        present_local = []
        present_remote = []
        try:
            br = current_branch() or ""
        except Exception:
            br = ""
        for h in hashes:
            _, _, rc = _run(["git", "merge-base", "--is-ancestor", h, "HEAD"], timeout=15)
            if rc == 0:
                present_local.append(h)
            if br:
                _, _, rc2 = _run(["git", "merge-base", "--is-ancestor", h, "refs/remotes/origin/" + br], timeout=15)
                if rc2 == 0:
                    present_remote.append(h)
        send_json({
            "ok": True,
            "branch": br,
            "present_local": present_local,
            "present_remote": present_remote,
        })
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

    elif path == "/api/ai/git-autofix-status":
        job_id = params.get("jobId", [""])[0]
        status = _get_autofix_job(job_id)
        if not status:
            send_json({"ok": False, "error": "Job not found"}, 404)
        else:
            status.pop("_command_parts", None)
            status.pop("_lock_refs", None)
            send_json({"ok": True, "job": status})
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
        if not is_valid_commit_path(fp):
            send_json({"ok": False, "error": f"Invalid commit path: {fp}"}, 400)
            return True
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
        clean_paths = [p for p in paths if is_valid_commit_path(p)]
        if not clean_paths:
            send_json({"ok": False, "error": "No valid files to commit"}, 400)
            return True
        for p in clean_paths:
            _run(["git", "add", p])
        _, _, diff_rc = _run(["git", "diff", "--cached", "--quiet"])
        if diff_rc == 0:
            send_json({"ok": False, "error": "Nothing to commit — selected files have no staged changes."}, 400)
            return True
        cmd = ["git", "commit"]
        if get_gpg_sign():
            cmd.append("-S")
        cmd.extend(["-m", msg])
        stdout, stderr, rc = _run(cmd)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout}, 400)
        return True

    elif path == "/api/checkout":
        branch = data.get("branch", "")
        force  = bool(data.get("force", False))
        stdout, stderr, rc = checkout_branch(branch, force=force)
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
        force = bool(data.get("force", False))
        log, stderr, rc = pull_current(mode, force=force)
        if rc == 0:
            send_json({"ok": True, "log": log})
        else:
            # Detect divergence-guard rejection so the frontend can render a
            # dedicated warning modal instead of a generic error.
            body = {"ok": False, "error": stderr or log, "log": log}
            if isinstance(log, str) and log.startswith("Pull blocked: branch is diverged"):
                body["divergedBlocked"] = True
            send_json(body, 400)
        return True

    elif path == "/api/network-timeout":
        seconds = data.get("network_timeout")
        ok, result = save_network_timeout(seconds)
        if ok:
            send_json({"ok": True, "network_timeout": result})
        else:
            send_json({"ok": False, "error": result}, 400)
        return True

    elif path == "/api/gpg-sign":
        enabled = data.get("gpg_sign", False)
        ok, result = save_gpg_sign(enabled)
        if ok:
            send_json({"ok": True, "gpg_sign": result})
        else:
            send_json({"ok": False, "error": result}, 400)
        return True

    elif path == "/api/resign-commits":
        base = data.get("base") or detect_base_branch()
        ok, msg = resign_branch_commits(base)
        if ok:
            send_json({"ok": True, "message": msg})
        else:
            send_json({"ok": False, "error": msg}, 400)
        return True

    elif path == "/api/squash-unsigned":
        base = data.get("base") or detect_base_branch()
        message = data.get("message") or None
        ok, msg = squash_unsigned_commits(base, message)
        if ok:
            send_json({"ok": True, "message": msg})
        else:
            send_json({"ok": False, "error": msg}, 400)
        return True

    elif path == "/api/resign-commits-autofix":
        base = data.get("base") or detect_base_branch()
        ok, msg = resign_branch_commits_with_autostash(base)
        if ok:
            send_json({"ok": True, "message": msg})
        else:
            send_json({"ok": False, "error": msg}, 400)
        return True

    elif path == "/api/fetch":
        log, stderr, rc = fetch()
        if rc == 0:
            send_json({"ok": True, "log": log})
        else:
            send_json({"ok": False, "error": stderr or log, "log": log}, 400)
        return True

    elif path == "/api/gitop-start":
        op = data.get("op", "fetch")
        mode = data.get("mode", "merge")
        force = bool(data.get("force", False))
        job_id = str(_uuid4())[:8]
        with _PUSH_JOBS_LOCK:
            _PUSH_JOBS[job_id] = {'lines': [], 'done': False, 'ok': False,
                                  'error': '', 'authRequired': False}
        threading.Thread(
            target=_run_gitop_streaming,
            args=(job_id, op, mode, force),
            daemon=True,
        ).start()
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
        import tempfile, stat as _stat
        branch = current_branch()
        # Resolve detached HEAD → real branch name using symbolic-ref fallback
        if not branch or branch in ("HEAD", "unknown"):
            sym_out, _, sym_rc = _run(["git", "symbolic-ref", "--short", "HEAD"])
            if sym_rc == 0 and sym_out.strip():
                branch = sym_out.strip()
            else:
                # Last resort: find which branch points at HEAD
                ref_out, _, ref_rc = _run(["git", "branch", "--points-at", "HEAD", "--format=%(refname:short)"])
                candidates = [r.strip() for r in ref_out.splitlines() if r.strip() and r.strip() != "HEAD"]
                if candidates:
                    branch = candidates[0]
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        force = bool(data.get("force", False))
        remote_branch = data.get("remote_branch", "").strip() or None
        remote_url, _, _ = _run(["git", "remote", "get-url", "origin"])
        is_ssh = remote_url.startswith("git@") or remote_url.startswith("ssh://")
        job_id = str(_uuid4())[:8]
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

    elif path == "/api/rebase-preflight":
        source = data.get("branch", "").strip()
        if not source:
            send_json({"ok": False, "error": "No branch specified"}, 400)
            return True
        safety = check_rebase_safety(source)
        send_json({"ok": True, **safety})
        return True

    elif path == "/api/rebase":
        source = data.get("branch", "").strip()
        if not source:
            send_json({"ok": False, "error": "No branch specified"}, 400)
            return True
        out, err, rc = rebase_current_onto(source)
        combined = (out + "\n" + err).strip()
        has_conflict = rc != 0 and ("CONFLICT" in combined or "conflict" in combined.lower())
        already_up_to_date = rc == 0 and "is up to date" in combined
        rebase_in_progress = is_rebase_in_progress()
        send_json({
            "ok": rc == 0,
            "log": combined,
            "hasConflict": has_conflict,
            "rebaseInProgress": rebase_in_progress,
            "alreadyUpToDate": already_up_to_date,
            "error": combined if rc != 0 else "",
        })
        return True

    elif path == "/api/rebase-rebuild-force-push":
        base_branch = data.get("base_branch", "").strip()
        remote_branch = data.get("remote_branch", "").strip() or None
        if not base_branch:
            send_json({"ok": False, "error": "base_branch is required"}, 400)
            return True
        stdout, stderr, rc = rebase_rebuild_keep_head_and_force_push(base_branch, remote_branch=remote_branch)
        if rc == 0:
            send_json({"ok": True, "stdout": stdout})
        else:
            send_json({"ok": False, "error": stderr or stdout, "stdout": stdout}, 400)
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
            remaining = get_conflicts()
            merge_type = _get_merge_type()
            resp = {
                "ok": True,
                "all_resolved": all_resolved,
                "resolved_file": fp,
                "remaining_files": remaining,
                "remaining_count": len(remaining),
                "branch": current_branch(),
                "merge_type": merge_type,
            }
            if all_resolved:
                resp["default_msg"] = _get_merge_default_msg()
            send_json(resp)
        else:
            send_json({"ok": False, "error": stderr or "failed"}, 400)
        return True

    elif path == "/api/complete-merge":
        msg = data.get("message", "")
        cwd = get_project_path()
        env = {"GIT_EDITOR": "true"}
        gpg_flag = ["-S"] if get_gpg_sign() else []
        if os.path.exists(os.path.join(cwd, ".git", "CHERRY_PICK_HEAD")):
            # --continue does not accept -S; GPG signing is controlled by commit.gpgsign config
            stdout, stderr, rc = _run(["git", "cherry-pick", "--continue"], env=env)
        elif os.path.exists(os.path.join(cwd, ".git", "rebase-merge")) or \
             os.path.exists(os.path.join(cwd, ".git", "rebase-apply")):
            # --continue does not accept -S; GPG signing is controlled by commit.gpgsign config
            stdout, stderr, rc = _run(["git", "rebase", "--continue"], env=env)
        elif os.path.exists(os.path.join(cwd, ".git", "MERGE_HEAD")):
            if msg:
                stdout, stderr, rc = _run(["git", "commit"] + gpg_flag + ["-m", msg])
            else:
                stdout, stderr, rc = _run(["git", "commit", "--no-edit"] + gpg_flag, env=env)
        else:
            if not msg:
                send_json({"ok": False, "error": "Commit message required"}, 400)
                return True
            stdout, stderr, rc = _run(["git", "commit"] + gpg_flag + ["-m", msg])
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

    elif path == "/api/squash-conflict-check":
        hashes = data.get("hashes", [])
        result = squash_conflict_check(hashes)
        send_json(result)
        return True

    elif path == "/api/squash-selected":
        hashes = data.get("hashes", [])
        msg = data.get("message", "")
        # Always use server-side GPG setting; client hint is secondary
        gpg_sign = get_gpg_sign() or bool(data.get("gpg_sign", False))
        if is_rebase_in_progress():
            send_json({
                "ok": False,
                "error": (
                    "Another rebase is already in progress. "
                    "Please finish it first (Continue/Skip) or abort it, then retry squash."
                ),
                "rebaseInProgress": True,
            }, 409)
            return True
        if not hashes or len(hashes) < 2:
            send_json({"ok": False, "error": "Need at least 2 commit hashes"}, 400)
            return True
        # Snapshot HEAD before/after so client can visibly confirm the branch
        # ref actually moved. This exposes the case where old backend code (or
        # a hook) silently no-ops the rewrite while returning ok=True.
        pre_head_out, _, _ = _run(["git", "rev-parse", "HEAD"])
        pre_head_snap = (pre_head_out or "").strip()
        # Also snapshot origin/<branch> so we can later detect "reset to origin".
        try:
            _pre_branch = current_branch() or ""
        except Exception:
            _pre_branch = ""
        _pre_origin = ""
        if _pre_branch:
            _po, _, _po_rc = _run(["git", "rev-parse", "refs/remotes/origin/" + _pre_branch], timeout=10)
            if _po_rc == 0:
                _pre_origin = (_po or "").strip()
        _write_local_log("squash-selected:start", [
            f"branch={_pre_branch}  pre_HEAD={pre_head_snap}",
            f"pre_origin/{_pre_branch}={_pre_origin or '-'}",
            f"gpg_sign={gpg_sign}",
            f"count={len(hashes)}",
            "hashes=" + ",".join(h[:12] for h in hashes),
            "message=" + (msg or "")[:200],
        ])
        ok, result_msg, squash_hash = squash_selected_commits(hashes, msg, gpg_sign)
        post_head_out, _, _ = _run(["git", "rev-parse", "HEAD"])
        post_head_snap = (post_head_out or "").strip()
        _write_local_log("squash-selected:end", [
            f"branch={_pre_branch}  ok={ok}  squash_hash={squash_hash}",
            f"pre_HEAD={pre_head_snap}  post_HEAD={post_head_snap}",
            f"moved={pre_head_snap != post_head_snap and bool(post_head_snap)}",
            "result_msg=" + (result_msg or "")[:400],
        ])
        if ok:
            # Defense-in-depth: if HEAD didn't move even though squash_selected_commits
            # returned ok, force-fail so the UI cannot mislead the user.
            if not post_head_snap or post_head_snap == pre_head_snap:
                _write_local_log("squash-selected:head-did-not-move", [
                    f"branch={_pre_branch}",
                    f"pre_HEAD={pre_head_snap}",
                    f"post_HEAD={post_head_snap}",
                    "server reported ok=True but rev-parse HEAD is unchanged",
                ])
                send_json({
                    "ok": False,
                    "error": (
                        "Squash reported success but HEAD did not move.\n"
                        f"pre_head={pre_head_snap[:12]}  post_head={post_head_snap[:12] or '-'}\n"
                        "This means the branch ref was not updated. Likely causes: "
                        "detached HEAD, a git hook that aborts commit silently, or "
                        "the Python server is running stale code — restart the "
                        "GitAutoManageBoard service and hard-refresh the browser, "
                        "then retry."
                    ),
                    "pre_head": pre_head_snap,
                    "post_head": post_head_snap,
                    "backend_version": "squash-v2-headmove",
                }, 400)
                return True
            send_json({
                "ok": True,
                "message": result_msg,
                "squash_commit_hash": squash_hash,
                "pre_head": pre_head_snap,
                "post_head": post_head_snap,
                "backend_version": "squash-v2-headmove",
            })
        else:
            send_json({
                "ok": False,
                "error": result_msg,
                "pre_head": pre_head_snap,
                "post_head": post_head_snap,
                "backend_version": "squash-v2-headmove",
            }, 400)
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

    elif path == "/api/ai/git-autofix-start":
        provider = data.get("provider", "openai")
        api_key = data.get("api_key", "")
        base_url = data.get("base_url", "")
        model = data.get("model", "")
        err_text = (data.get("error") or "").strip()
        op_name = (data.get("operation") or "").strip()
        ui_lang = (data.get("lang") or "en").strip().lower()
        if not err_text:
            send_json({"ok": False, "error": "error is required"}, 400)
            return True
        if not model:
            send_json({"ok": False, "error": "model is required"}, 400)
            return True
        if provider != "ollama" and not str(api_key or "").strip():
            send_json({"ok": False, "error": f"API key required for provider: {provider}"}, 400)
            return True
        if provider == "custom" and not str(base_url or "").strip():
            send_json({"ok": False, "error": "base_url is required for custom provider"}, 400)
            return True
        job_id = str(_uuid4())[:8]
        _set_autofix_job(job_id, {
            "jobId": job_id,
            "created_at": int(time.time()),
            "done": False,
            "ok": False,
            "phase": "queued",
            "progress": 0,
            "message": "Queued",
            "error": "",
            "operation": op_name,
        })
        threading.Thread(
            target=_autofix_analyze_job,
            args=(job_id, provider, api_key, base_url, model, op_name, err_text, ui_lang),
            daemon=True
        ).start()
        send_json({"ok": True, "jobId": job_id})
        return True

    elif path == "/api/ai/git-autofix-apply":
        job_id = (data.get("jobId") or "").strip()
        if not job_id:
            send_json({"ok": False, "error": "jobId required"}, 400)
            return True
        job = _get_autofix_job(job_id)
        if not job:
            send_json({"ok": False, "error": "Job not found"}, 404)
            return True
        if job.get("phase") == "applying":
            send_json({"ok": False, "error": "Job is already applying"}, 400)
            return True
        threading.Thread(target=_autofix_apply_job, args=(job_id,), daemon=True).start()
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
