#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git Tool — branch, commit, conflict, i18n (en/zh)

Usage: python3 git_commit_tool.py
Browser opens http://127.0.0.1:8989
"""

import os, json, subprocess, socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

PORT    = 8989
_MSGLOG = []  # 内存中的操作日志
_PUSH_JOBS = {}  # {job_id: {lines:[], done:bool, ok:bool, error:str, authRequired:bool}}

def _run(cmd, cwd=None, timeout=120, env=None):
    import os as _os
    run_env = _os.environ.copy()
    # Always disable interactive git prompts — prevents subprocess from hanging
    run_env["GIT_TERMINAL_PROMPT"] = "0"
    run_env["GIT_ASKPASS"] = "echo"
    if env:
        run_env.update(env)
    try:
        r = subprocess.run(cmd, capture_output=True, text=True,
                           cwd=cwd or _os.getcwd(), timeout=timeout, env=run_env)
        return r.stdout.strip(), r.stderr.strip(), r.returncode
    except subprocess.TimeoutExpired:
        return "", f"git command timed out after {timeout}s: {' '.join(cmd)}", -1
    except Exception as e:
        return "", str(e), -1

def _run_push_streaming(job_id, branch, extra_env=None, force=False):
    """Run git push in a background thread, streaming output lines into _PUSH_JOBS[job_id]."""
    import os as _os, subprocess as _subp, threading
    run_env = _os.environ.copy()
    run_env["GIT_TERMINAL_PROMPT"] = "0"
    run_env["GIT_ASKPASS"] = "echo"
    if extra_env:
        run_env.update(extra_env)
    job = _PUSH_JOBS[job_id]

    def _append(line):
        line = (line or '').rstrip('\r\n')
        if line:
            job['lines'].append(line)

    push_base = ["git", "push", "--verbose", "--progress"]
    if force:
        push_base.append("--force-with-lease")

    def _try_push(cmd):
        _append('$ ' + ' '.join(cmd))
        try:
            proc = _subp.Popen(cmd, stdout=_subp.PIPE, stderr=_subp.PIPE,
                               text=True, cwd=_os.getcwd(), env=run_env)
        except Exception as e:
            _append('ERROR: ' + str(e))
            return -1
        def rd(stream):
            for l in stream:
                _append(l)
        t1 = threading.Thread(target=rd, args=(proc.stdout,), daemon=True)
        t2 = threading.Thread(target=rd, args=(proc.stderr,), daemon=True)
        t1.start(); t2.start()
        try:
            proc.wait(timeout=120)
        except _subp.TimeoutExpired:
            proc.kill()
            _append('ERROR: git push timed out after 120s')
            return -1
        t1.join(); t2.join()
        return proc.returncode

    try:
        rc = _try_push(push_base + ["origin", branch])
        if rc != 0:
            _append('--- Retrying with HEAD ref ---')
            rc = _try_push(push_base + ["origin", "HEAD"])
        combined = '\n'.join(job['lines'])
        is_auth_err = any(x in combined.lower() for x in [
            "authentication failed", "could not read username",
            "invalid username", "403", "401", "permission denied"])
        job['done'] = True
        job['ok'] = (rc == 0)
        job['authRequired'] = is_auth_err and rc != 0
        if rc != 0:
            job['error'] = combined
    except Exception as e:
        job['done'] = True
        job['ok'] = False
        job['error'] = str(e)

def current_branch():
    out, _, rc = _run(["git","rev-parse","--abbrev-ref","HEAD"])
    return out if rc==0 else "unknown"

def display_branch():
    return current_branch().lower()

def get_branches(page=1, per_page=20):
    cur = current_branch().lower()
    branches = {"current":cur,"local":[],"remote":[]}
    # Use for-each-ref to get name + committer date + unix timestamp
    fmt = "%(refname:short)||%(committerdate:format:%Y-%m-%d %H:%M)||%(committerdate:unix)"
    out,_,_ = _run(["git","for-each-ref","--format="+fmt,"refs/heads"])
    local_list = []
    for l in out.splitlines():
        parts = l.strip().split("||",2)
        if len(parts)==3 and parts[0]:
            ts = int(parts[2]) if parts[2].strip().isdigit() else 0
            local_list.append({"name":parts[0].lower(),"date":parts[1],"ts":ts})
    out,_,_ = _run(["git","for-each-ref","--format="+fmt,"refs/remotes"])
    all_remote = []
    for l in out.splitlines():
        parts = l.strip().split("||",2)
        if len(parts)==3 and parts[0] and "HEAD" not in parts[0]:
            ts = int(parts[2]) if parts[2].strip().isdigit() else 0
            all_remote.append({"name":parts[0].lower(),"date":parts[1],"ts":ts})
    branches["local"] = local_list
    total_remote = len(all_remote)
    total_local = len(local_list)
    if per_page > 0:
        skip = (page-1)*per_page
        branches["remote"] = all_remote[skip:skip+per_page]
    else:
        branches["remote"] = all_remote
    branches["total_remote"] = total_remote
    branches["total_local"] = total_local
    branches["page"] = page
    branches["per_page"] = per_page
    return branches

def has_uncommitted():
    out,_,_ = _run(["git","status","--porcelain"])
    return bool(out.strip())

def stash_changes():
    return _run(["git","stash"])

def stash_list(page=1, per_page=10):
    out,_,_ = _run(["git","stash","list"])
    all_stashes = [l.strip() for l in out.splitlines() if l.strip()]
    total = len(all_stashes)
    skip = (page-1)*per_page if per_page > 0 else 0
    items = all_stashes[skip:skip+per_page] if per_page > 0 else all_stashes
    return {"stashes":items,"total":total,"page":page,"per_page":per_page}

def stash_diff(idx="0"):
    out,_,_ = _run(["git","stash","show","-p",f"stash@{{{idx}}}"])
    return out

def commit_diff(commit_hash):
    out,_,_ = _run(["git","show","--stat","-p",commit_hash])
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
    return _run(["git","stash","pop",f"stash@{{{idx}}}"])

def stash_drop(idx="0"):
    return _run(["git","stash","drop",f"stash@{{{idx}}}"])

def file_commit_diff(commit_hash, file_path):
    """Diff of a specific file introduced by a specific commit."""
    out, _, _ = _run(["git", "show", "-p", "--stat", commit_hash, "--", file_path])
    return out

def checkout_branch(name):
    return _run(["git","checkout",name])

def create_branch(name, base=None):
    """创建新分支，可选基于 base 分支"""
    cmd = ["git","checkout","-b",name]
    if base: cmd.append(base)
    return _run(cmd)

def fetch():
    out,err,rc = _run(["git","fetch","--all","--prune","--verbose"])
    combined = (out+"\n"+err).strip()
    return combined, err, rc

def pull_current(mode="merge"):
    """拉取最新代码（--verbose 返回完整日志）"""
    branch = current_branch()
    if mode == "rebase":
        out,err,rc = _run(["git","pull","--rebase","--verbose","origin",branch])
        if rc != 0: out,err,rc = _run(["git","pull","--rebase","--verbose","origin","HEAD"])
    elif mode == "ff":
        out,err,rc = _run(["git","pull","--ff-only","--verbose","origin",branch])
        if rc != 0: out,err,rc = _run(["git","pull","--ff-only","--verbose","origin","HEAD"])
    else:
        out,err,rc = _run(["git","pull","--no-rebase","--verbose","origin",branch])
        if rc != 0:
            out2,err2,rc2 = _run(["git","pull","--verbose"])
            if rc2 == 0: return (out2+"\n"+err2).strip(), err2, rc2
            out,err,rc = _run(["git","pull","--no-rebase","--verbose","origin","HEAD"])
    combined = (out+"\n"+err).strip()
    return combined, err, rc

def set_upstream():
    b = current_branch()
    return _run(["git","branch","--set-upstream-to",f"origin/{b}",b])

def push_set_upstream():
    b = current_branch()
    return _run(["git","push","-u","origin",b])

def get_conflicts():
    out,_,_ = _run(["git","diff","--name-only","--diff-filter=U"])
    return [f.strip() for f in out.splitlines() if f.strip()]

def get_conflict_detail(fp):
    raw,_,_ = _run(["cat",fp])
    ours,_,_ = _run(["git","show",f":2:{fp}"])
    theirs,_,_ = _run(["git","show",f":3:{fp}"])
    blocks = _parse_blocks(raw)
    return {"raw":raw,"ours":ours,"theirs":theirs,"blocks":blocks}

def _parse_blocks(raw):
    blocks = []; lines = raw.split("\n"); i=0; cur={"type":"normal","lines":[]}
    def flush():
        if cur["lines"]: blocks.append(cur)
        return {"type":"normal","lines":[]}
    while i < len(lines):
        l = lines[i]
        if l.startswith("<<<<<<<"):
            flush(); cur={"type":"conflict","ours":"","theirs":""}; ours=[]; i+=1
            while i<len(lines) and not lines[i].startswith("======="):
                ours.append(lines[i]); i+=1
            i+=1; theirs=[]
            while i<len(lines) and not lines[i].startswith(">>>>>>>"):
                theirs.append(lines[i]); i+=1
            i+=1; cur["ours"]="\n".join(ours); cur["theirs"]="\n".join(theirs)
            blocks.append(cur); cur={"type":"normal","lines":[]}
        else:
            cur["lines"].append(l); i+=1
    flush()
    return blocks

def resolve_conflict(fp, resolution):
    if resolution=="ours": _run(["git","checkout","--ours",fp])
    elif resolution=="theirs": _run(["git","checkout","--theirs",fp])
    else:
        with open(fp,"w",encoding="utf-8") as f: f.write(resolution)
    return _run(["git","add",fp])

def get_file_commits(file_path, page=1, per_page=20):
    """Get commit history for a specific file."""
    branch = current_branch()
    fmt = "--pretty=format:%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"
    skip = (page-1)*per_page if per_page > 0 else 0
    if per_page > 0:
        args = ["git","log",branch,date_fmt,fmt,f"--skip={skip}",f"-n{per_page}","--",file_path]
    else:
        args = ["git","log",branch,date_fmt,fmt,"--",file_path]
    out,_,_ = _run(args)
    commits = []
    for line in out.splitlines():
        parts = line.split("||",3)
        if len(parts)==4:
            commits.append({"hash":parts[0],"short_hash":parts[0][:7],"author":parts[1],"date":parts[2],"message":parts[3]})
    total_out,_,_ = _run(["git","rev-list","--count","HEAD","--",file_path])
    total = int(total_out.strip()) if total_out.strip().isdigit() else len(commits)
    return {"commits":commits,"total":total,"page":page,"per_page":per_page,"file":file_path}

def get_uncommitted_changes():
    changed=set()
    for cmd in [["git","diff","--name-only"],["git","diff","--cached","--name-only"],["git","ls-files","--others","--exclude-standard"]]:
        out,_,_ = _run(cmd)
        for l in out.splitlines():
            l=l.strip()
            if l: changed.add(l)
    files=[]
    for p in sorted(changed):
        diff,_,_ = _run(["git","diff","--",p])
        files.append({"path":p,"diff":diff})
    return files

def get_commit_log(page=1, per_page=10, search="", order="desc"):
    branch = current_branch()
    skip = (page-1)*per_page if per_page > 0 else 0
    # %ct = unix timestamp (for reliable Python-side sorting), %ad = human-readable display date
    fmt = "--pretty=format:%ct||%H||%an||%ad||%s"
    date_fmt = "--date=format:%Y-%m-%d %H:%M"

    # Collect root commit hashes (commits with no parents) for frontend UI hints
    root_out,_,_ = _run(["git","rev-list","--max-parents=0","--all"])
    root_hashes = set(h.strip() for h in root_out.splitlines() if h.strip())

    def _sort_and_parse(lines, ord_):
        # Sort strictly by unix timestamp; git topo-order is unreliable across merges
        def _ts(line):
            try: return int(line.split("||",1)[0])
            except: return 0
        lines.sort(key=_ts, reverse=(ord_=="desc"))
        result = []
        for line in lines:
            parts = line.split("||",4)
            if len(parts)==5:
                h = parts[1]
                result.append({"hash":h,"short_hash":h[:7],
                                "author":parts[2],"date":parts[3],"message":parts[4],
                                "is_root": h in root_hashes})
        return result

    if not search:
        # Fetch all commits (no -n limit) so Python can sort reliably
        out,_,_ = _run(["git","log",branch,date_fmt,fmt])
        all_lines = [l.strip() for l in out.splitlines() if l.strip()]
        total = len(all_lines)
        sorted_commits = _sort_and_parse(all_lines, order)
        page_commits = sorted_commits[skip:skip+per_page] if per_page > 0 else sorted_commits
        return {"commits":page_commits,"total":total,"page":page,"per_page":per_page,"order":order}

    # 搜索模式：合并 message / author / hash 三个来源
    base_args = ["git","log",branch,date_fmt,fmt,"-n","500"]
    hash_set = set()
    all_lines = []

    # 1) 搜索 commit message
    out_m,_,_ = _run(base_args + [f"--grep={search}","-i","-E"])
    for l in out_m.splitlines():
        l = l.strip()
        if l:
            h = l.split("||",2)[1] if l.count("||")>=1 else ""
            if h and h not in hash_set:
                hash_set.add(h); all_lines.append(l)

    # 2) 搜索 author
    out_a,_,_ = _run(base_args + [f"--author={search}"])
    for l in out_a.splitlines():
        l = l.strip()
        if l:
            h = l.split("||",2)[1] if l.count("||")>=1 else ""
            if h and h not in hash_set:
                hash_set.add(h); all_lines.append(l)

    # 3) 搜索 hash（纯十六进制）
    if all(c in "0123456789abcdefABCDEF" for c in search):
        out_rev,_,_ = _run(["git","rev-list","--all","--max-count","50"])
        for rev in out_rev.splitlines():
            rev = rev.strip()
            if rev and (search.lower() in rev.lower()) and rev not in hash_set:
                out_show,_,_ = _run(["git","show","--no-patch",
                    "--pretty=format:%ct||%H||%an||%ad||%s",
                    "--date=format:%Y-%m-%d %H:%M", rev])
                for l in out_show.splitlines():
                    l = l.strip()
                    if l:
                        hash_set.add(rev); all_lines.append(l)

    total = len(all_lines)
    sorted_commits = _sort_and_parse(all_lines, order)
    page_commits = sorted_commits[skip:skip+per_page] if per_page > 0 else sorted_commits
    return {"commits":page_commits,"total":total,"page":page,"per_page":per_page,"order":order}

def reset_to(hash,mode="soft"):
    return _run(["git","reset",f"--{mode}",hash])

def revert_commit(hash):
    return _run(["git","revert",hash,"--no-edit"])

def squash_commits(from_h,to_h,msg):
    # Guard: root commit has no parent — reset to root~1 is invalid
    _,_,rc = _run(["git","rev-parse","--verify",from_h+"^"])
    if rc != 0:
        return "","Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.",1
    parent = from_h+"~1"
    _run(["git","reset","--soft",parent])
    return _run(["git","commit","-m",msg])

def abort_merge_or_rebase():
    for cmd in [["git","merge","--abort"],["git","rebase","--abort"],["git","cherry-pick","--abort"]]:
        out,err,rc = _run(cmd)
        if rc==0: return out,err,rc
    return "","no ongoing merge/rebase/cherry-pick",0

# ═══════════════════════════════════════════════════════════════
# HTML
# ═══════════════════════════════════════════════════════════════

_HTML_BYTES_CACHE = None

def get_html_bytes():
    global _HTML_BYTES_CACHE
    if _HTML_BYTES_CACHE is None:
        _HTML_BYTES_CACHE = make_html().encode("utf-8")
    return _HTML_BYTES_CACHE

def make_html():
    return r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Git Tool</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"PingFang SC","Microsoft YaHei","Segoe UI",sans-serif;background:#f5f7fa;color:#1a1a2e;padding:24px 16px}
.container{max-width:1280px;margin:0 auto}
.top-bar{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;margin-bottom:12px;overflow:visible;}
.top-bar h1{font-size:22px;margin-right:0}
.branch-tag{background:#1e40af;color:#fff;padding:5px 16px;border-radius:99px;font-size:14px;font-weight:700;white-space:nowrap;box-shadow:0 0 8px rgba(30,64,175,.4);cursor:default}
.branch-label{font-size:12px;color:#6b7280;white-space:nowrap}
.lang-sel{padding:4px 8px;border-radius:6px;border:1px solid #d1d5db;font-size:12px;cursor:pointer}
.btn{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:opacity .2s;background:#e5e7eb;color:#374151}
.btn:hover{opacity:.85}
.btn-primary{background:#3b82f6;color:#fff}
.btn-success{background:#10b981;color:#fff}
.btn-warning{background:#f59e0b;color:#fff}
.btn-danger{background:#ef4444;color:#fff}
.btn-secondary{background:#e5e7eb;color:#374151}
.btn-sm{padding:4px 12px;font-size:12px}
.git-action-btn{position:relative;display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;line-height:1;transition:filter 0.15s,transform 0.1s;white-space:nowrap;}
.git-action-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
.git-action-btn:active{transform:translateY(0);}
.git-action-btn .git-action-desc{visibility:hidden;opacity:0;position:fixed;background:#1f2937;color:#f9fafb;font-size:11px;font-weight:400;white-space:nowrap;padding:5px 10px;border-radius:5px;pointer-events:none;transition:opacity 0.15s;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.25);}
.git-action-btn:hover .git-action-desc{visibility:visible;opacity:1;}
.fetch-btn{background:#e5e7eb;color:#374151;}
.pull-btn{background:#fef3c7;color:#92400e;}
.push-btn{background:#d1fae5;color:#065f46;}
.sync-section{display:flex;align-items:center;gap:6px;padding:5px 12px;background:#fff;border:1.5px solid #6366f1;border-radius:8px;margin-left:8px;box-shadow:0 1px 4px rgba(99,102,241,0.10);}
.btn-tab{background:#e5e7eb;color:#6b7280;padding:8px 16px;border-radius:8px 8px 0 0;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .2s;border-bottom:3px solid transparent}
.btn-tab:hover{background:#d1d5db;color:#374151}
.btn-tab.active{background:#3b82f6;color:#fff;border-bottom-color:#1d4ed8}
.page{display:none}
.page.active{display:block}
.help-toggle{color:#3b82f6;cursor:pointer;font-size:12px;margin-left:4px;text-decoration:underline}
.help-box{display:none;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 14px;margin:6px 0 10px;font-size:13px;color:#1e40af;line-height:1.6}
.help-box.show{display:block}

/* msg area */
#msg-area{margin-bottom:14px}
#msg-area .msg-item{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:8px;font-size:13px;animation:slideDown .3s ease}
.msg-item.error{background:#fee2e2;color:#991b1b;border:1px solid #fecaca}
.msg-item.success{background:#d1fae5;color:#065f46;border:1px solid #a7f3d0}
.msg-item.info{background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe}
.msg-item .msg-text{flex:1;word-break:break-all;line-height:1.5}
.msg-item .msg-close{cursor:pointer;font-size:16px;line-height:1;opacity:.6;padding:0 4px;font-weight:bold}
.msg-item .msg-close:hover{opacity:1}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

/* file cards */
.file-card{background:#fff;border-radius:12px;padding:16px 20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.08);transition:box-shadow .2s}
.file-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.12)}
.file-header{display:flex;align-items:center;gap:12px;cursor:pointer;user-select:none;margin-bottom:10px;flex-wrap:wrap}
.file-header:hover{opacity:.8}
.file-path{font-weight:600;font-size:15px;color:#374151}
.file-toggle{color:#9ca3af;font-size:14px;transition:transform .2s;display:inline-block}
.file-toggle.open{transform:rotate(90deg)}
.file-body{overflow:hidden;transition:max-height .3s ease;max-height:0}
.file-body.expanded{max-height:5000px}
.cb-wrap{display:flex;align-items:center;gap:8px}
input[type="checkbox"]{width:23px;height:23px;cursor:pointer;accent-color:#3b82f6;flex-shrink:0}
.cb-wrap input[type="checkbox"]{width:23px;height:23px;cursor:pointer;accent-color:#3b82f6}
.diff-block{background:#f8fafc;border-radius:8px;padding:12px 16px;font-family:"SFMono-Regular","Cascadia Code","Consolas","Menlo",monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-all;max-height:420px;overflow-y:auto;border:1px solid #e5e7eb}
.diff-table{width:100%;border-collapse:collapse}
.diff-table tr{border-bottom:1px solid #f0f0f0}
.diff-prefix{color:#9ca3af;min-width:20px;text-align:right;padding-right:8px;user-select:none;vertical-align:top}
.diff-content{padding-left:8px;padding-right:12px}
.diff-add{background:#e6ffed;color:#059664;font-weight:600}
.diff-rem{background:#ffeef0;color:#dc2626;font-weight:600}
.diff-meta{color:#6b7280;font-style:italic}
.toolbar{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin-top:28px;padding:16px 20px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.toolbar input[type="text"]{flex:1;min-width:200px;padding:8px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:14px;outline:none;transition:border-color .2s}
.toolbar input[type="text"]:focus{border-color:#3b82f6}
#toast{position:fixed;top:20px;right:20px;z-index:999;padding:12px 20px;border-radius:10px;font-size:14px;box-shadow:0 4px 16px rgba(0,0,0,.15);opacity:0;transform:translateY(-12px);transition:all .3s ease;pointer-events:none}
#toast.show{opacity:1;transform:translateY(0);pointer-events:auto}
#toast.ok{background:#10b981;color:#fff}
#toast.err{background:#ef4444;color:#fff}
#toast.info{background:#3b82f6;color:#fff}
.empty{text-align:center;color:#6b7280;padding:48px 0;font-size:16px}
.branch-list{background:#fff;border-radius:12px;padding:8px 0;box-shadow:0 1px 3px rgba(0,0,0,.08);margin-bottom:20px}
.branch-list h3{padding:12px 20px;font-size:14px;color:#6b7280}
.branch-sort-hdr span:hover{color:#1d4ed8;background:#eff6ff;border-radius:4px}
.branch-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;transition:background .15s}
.branch-item:hover{background:#f3f4f6}
.branch-item .name{flex:1;font-size:14px;font-weight:500}
.branch-item.current .name{color:#3b82f6;font-weight:700}
.stash-item{display:flex;align-items:center;gap:10px;padding:10px 20px;border-bottom:1px solid #f3f4f6;background:#fff}
.stash-item .name{flex:1;font-size:14px}
.modal-bg{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:100;align-items:center;justify-content:center}
.modal-bg.show{display:flex}
.modal-box{background:#fff;border-radius:16px;padding:28px 32px;max-width:560px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto}
.modal-box h2{font-size:18px;margin-bottom:16px}
.modal-box p{color:#6b7280;font-size:14px;margin-bottom:24px;line-height:1.6}
.modal-box .modal-btns{display:flex;gap:10px;justify-content:flex-end}
.conflict-file{background:#fff;border-radius:12px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden}
.conflict-header{display:flex;align-items:center;gap:12px;padding:16px 20px;cursor:pointer;user-select:none}
.conflict-header:hover{background:#fafafa}
.conflict-path{flex:1;font-weight:600;font-size:14px;color:#374151}
.conflict-content{display:none;padding:0 20px 20px}
.conflict-content.expanded{display:block}
.side-by-side{display:flex;gap:8px}
.side-panel{flex:1;min-width:0}
.side-panel h4{font-size:12px;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
.side-panel pre{background:#f8fafc;border-radius:8px;padding:10px 14px;font-size:12px;line-height:1.6;overflow-x:auto;white-space:pre-wrap;max-height:360px;overflow-y:auto;border:1px solid #e5e7eb}
.side-panel.ours h4{color:#dc2626}
.side-panel.theirs h4{color:#3b82f6}
.conflict-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center}
.conflict-edit{margin-top:10px;display:none}
.conflict-edit textarea{width:100%;min-height:200px;border-radius:8px;border:1px solid #d1d5db;padding:10px;font-family:monospace;font-size:13px;resize:vertical}
.conflict-jump-bar{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:8px 12px;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;}
.conflict-jump-bar .jump-label{font-size:13px;font-weight:600;color:#856404;}
.conflict-block-normal{background:#f9fafb;border-radius:6px;margin-bottom:8px;overflow:hidden;}
.conflict-block-normal-header{display:flex;align-items:center;gap:8px;padding:5px 12px;cursor:pointer;font-size:12px;color:#6b7280;font-family:monospace;user-select:none;}
.conflict-block-normal-header:hover{background:#f0f0f0;}
.conflict-block-normal-body{display:none;padding:8px 14px;font-family:monospace;font-size:12px;white-space:pre-wrap;line-height:1.5;border-top:1px solid #e5e7eb;}
.conflict-block-normal-body.open{display:block;}
.conflict-zone{border:2px solid #ef4444;border-radius:8px;margin-bottom:14px;overflow:hidden;}
.conflict-zone-header{display:flex;align-items:center;gap:10px;padding:8px 14px;background:#fef2f2;}
.conflict-zone-num{font-size:12px;font-weight:700;color:#dc2626;background:#fee2e2;padding:2px 8px;border-radius:4px;}
.conflict-zone-status{font-size:12px;color:#6b7280;margin-left:auto;}
.conflict-zone-status.chosen-ours{color:#059669;font-weight:600;}
.conflict-zone-status.chosen-theirs{color:#2563eb;font-weight:600;}
.conflict-sides{display:grid;grid-template-columns:1fr 1fr;gap:0;}
.conflict-side{padding:10px 14px;}
.conflict-side-ours{background:#f0fdf4;border-right:1px solid #bbf7d0;}
.conflict-side-theirs{background:#eff6ff;}
.conflict-side h4{margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
.conflict-side-ours h4{color:#059669;}
.conflict-side-theirs h4{color:#2563eb;}
.conflict-side pre{margin:0;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-all;}
.conflict-zone-actions{display:flex;gap:8px;padding:10px 14px;background:#fafafa;border-top:1px solid #fee2e2;flex-wrap:wrap;align-items:center;}
.conflict-zone.resolved-ours{border-color:#10b981;}
.conflict-zone.resolved-ours .conflict-zone-header{background:#f0fdf4;}
.conflict-zone.resolved-theirs{border-color:#3b82f6;}
.conflict-zone.resolved-theirs .conflict-zone-header{background:#eff6ff;}
.conflict-zone.resolved-manual{border-color:#8b5cf6;}
.conflict-zone.resolved-manual .conflict-zone-header{background:#f5f3ff;}
.conflict-resolve-all{margin-top:14px;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.resolved-tag{background:#d1fae5;color:#065f46;font-size:12px;padding:2px 8px;border-radius:99px;font-weight:500}
.log-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.log-controls input{padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:13px;outline:none}
.log-controls input:focus{border-color:#3b82f6}
.log-controls select{padding:6px 10px;border-radius:8px;border:1px solid #d1d5db;font-size:13px}
.log-table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.log-table th{text-align:left;padding:10px 14px;font-size:12px;color:#6b7280;background:#f9fafb;border-bottom:1px solid #e5e7eb;text-transform:uppercase;letter-spacing:.5px}
.log-table th[onclick]:hover{background:#e5e7eb;color:#1d4ed8}
.log-table td{padding:10px 14px;font-size:13px;border-bottom:1px solid #f3f4f6}
.log-table tr:hover td{background:#f9fafb}
.log-hash{font-family:monospace;color:#3b82f6;font-weight:600;font-size:12px}
.log-date{color:#6b7280;font-size:12px;white-space:nowrap}
.log-author{font-size:12px;color:#374151}
.log-msg{max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.log-actions{white-space:nowrap}
.log-actions button{margin-right:4px}
.pagination{display:flex;gap:6px;align-items:center;margin-top:16px;justify-content:center;flex-wrap:wrap}
.pagination .page-num{padding:6px 12px;border-radius:6px;border:1px solid #d1d5db;cursor:pointer;font-size:13px;background:#fff}
.pagination .page-num:hover{background:#e5e7eb}
.pagination .page-num.active{background:#3b82f6;color:#fff;border-color:#3b82f6}
.pagination .page-info{font-size:13px;color:#6b7280;padding:0 8px}
.squash-bar{display:flex;gap:10px;align-items:center;padding:12px 16px;background:#fef3c7;border-radius:10px;margin-bottom:14px;border:1px solid #fcd34d}
.squash-bar input{flex:1;padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:13px;outline:none}
.abort-btn{margin-left:auto}
.msg-log-bar{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.msg-log-bar a{font-size:12px;color:#3b82f6;cursor:pointer;text-decoration:underline}
.spinner{display:inline-block;width:16px;height:16px;border:2px solid #e5e7eb;border-top-color:#3b82f6;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-bar{display:flex;align-items:center;justify-content:center;gap:8px;padding:40px 20px;color:#6b7280;font-size:14px}
#global-spinner{position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:8px 18px;display:none;align-items:center;gap:8px;font-size:13px;color:#374151;z-index:9998;box-shadow:0 4px 16px rgba(0,0,0,.12);white-space:nowrap}
#global-spinner.show{display:flex}
#global-spinner .spinner{width:14px;height:14px;margin:0}
.diff-search-result-info{font-size:13px;color:#6b7280;padding:4px 0;margin-bottom:8px}
.diff-search-highlight{background:#fef3c7;border-radius:3px;padding:0 2px}
.restore-page-file{font-size:13px;color:#374151;background:#f9fafb;border-radius:8px;padding:10px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;border:1px solid #e5e7eb}
.restore-page-file .filepath{font-family:monospace;font-weight:600;color:#1d4ed8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.restore-status{display:inline-block;padding:2px 12px;border-radius:99px;font-size:12px;font-weight:600}
.restore-status.ok{background:#d1fae5;color:#065f46}
.restore-status.err{background:#fee2e2;color:#dc2626}
.branch-search-wrap{display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
.branch-search-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.branch-tag{display:inline-block;padding:3px 12px;border-radius:99px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #d1d5db;background:#fff;color:#374151;transition:background .15s}
.branch-tag:hover{background:#e5e7eb}
.branch-tag.develop{border-color:#3b82f6;color:#1d4ed8;background:#eff6ff}
.branch-tag.release{border-color:#10b981;color:#065f46;background:#ecfdf5}
mark{background:#fef3c7;border-radius:2px;padding:0 1px}
#branch-name{
  display:inline-block;
  background:linear-gradient(135deg,#1d4ed8,#7c3aed);
  color:#fff;
  font-size:15px;
  font-weight:800;
  padding:6px 20px;
  border-radius:99px;
  border:none;
  cursor:default;
  letter-spacing:.3px;
  box-shadow:0 0 0 3px rgba(99,102,241,.25),0 4px 12px rgba(29,78,216,.4);
  animation:branch-pulse 2.5s ease-in-out infinite;
}
@keyframes branch-pulse{
  0%,100%{box-shadow:0 0 0 3px rgba(99,102,241,.25),0 4px 12px rgba(29,78,216,.4)}
  50%{box-shadow:0 0 0 6px rgba(99,102,241,.15),0 4px 18px rgba(29,78,216,.55)}
}
</style>
</head>
<body>
<div class="container">

<div class="top-bar">
  <h1>Git Tool</h1>
  <div style="display:flex;flex-direction:column;align-items:center;margin-left:25px">
    <span class="branch-label" data-i18n="current_branch_label" style="font-weight:700;margin-bottom:2px">Current Branch:</span>
    <span class="branch-tag" id="branch-name" title="Current Branch">...</span>
  </div>
  <button class="btn-tab active" id="tab-commit" onclick="switchPage('main')" data-i18n="tab_commit">Commit</button>
  <button class="btn-tab" id="tab-branches" onclick="loadBranches(1)" data-i18n="tab_branches">Branches</button>
  <button class="btn-tab" id="tab-log" onclick="loadLog(1)" data-i18n="tab_log">Commit Log</button>
  <button class="btn-tab" id="tab-conflicts" onclick="loadConflicts()" data-i18n="tab_conflicts">Conflicts</button>
  <button class="btn-tab" id="tab-stash" onclick="loadStash()" data-i18n="tab_stash">Stash</button>
  <div class="sync-section">
    <span style="font-size:10px;color:#6366f1;font-weight:700;letter-spacing:0.8px;margin-right:4px;">REMOTE</span>
    <button class="git-action-btn fetch-btn" onclick="doFetch()">
      ⬇ Fetch<span class="git-action-desc" data-i18n="fetch_desc">Check remote for new commits (no merge)</span>
    </button>
    <button class="git-action-btn pull-btn" onclick="doPull()">
      🔄 Pull<span class="git-action-desc" data-i18n="pull_desc">Fetch + rebase local onto remote</span>
    </button>
    <button class="git-action-btn push-btn" onclick="doManualPush()">
      🚀 Push<span class="git-action-desc" data-i18n="push_desc">Send local commits to remote</span>
    </button>
  </div>
  <select class="lang-sel" id="lang-sel" onchange="switchLang(this.value)" style="margin-left:auto;margin-right:25px">
    <option value="en">EN</option>
    <option value="zh">中文</option>
  </select>
</div>

<div class="msg-log-bar" style="margin-bottom:4px;">
  <span style="font-size:12px;color:#6b7280;" data-i18n="msg_count">Messages: 0</span>
  <a onclick="switchPage('msglog');loadMsgLog(1)" data-i18n="view_log">View Log</a>
</div>

<div id="msg-area"></div>

<!-- ═══════════ Main Page ═══════════ -->
<div class="page active" id="page-main">
  <div id="select-all-bar" style="display:none;margin-bottom:12px">
    <label class="cb-wrap" style="font-weight:600;font-size:14px;color:#374151">
      <input type="checkbox" id="select-all-cb"> <span data-i18n="select_all">Select / Deselect All</span>
    </label>
  </div>
  <div id="file-list"></div>
  <div class="toolbar" id="toolbar" style="display:none">
    <input type="text" id="msg-input" placeholder="commit message (required)...">
    <button class="btn btn-primary" id="commit-btn" data-i18n="confirm_commit">Commit</button>
    <button class="btn btn-secondary" id="reset-btn" data-i18n="deselect_all">Deselect All</button>
    <button class="btn btn-secondary" id="refresh-btn" onclick="loadFiles()" data-i18n="refresh">Refresh</button>
  </div>
</div>

<!-- ═══════════ Branches Page ═══════════ -->
<div class="page" id="page-branches">
  <button class="btn btn-secondary btn-back" onclick="switchPage('main')">← <span data-i18n="back">Back</span></button>
  <h2 style="margin-bottom:16px" data-i18n="branches_title">Branches</h2>
  <div style="display:flex;gap:8px;margin-bottom:14px">
    <input type="text" id="new-branch-name" data-i18n-placeholder="new_branch_placeholder" placeholder="New branch name..." style="flex:1;padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:13px;outline:none">
    <button class="btn btn-sm btn-success" onclick="createNewBranch()" data-i18n="create_branch_btn">+ Create Branch</button>
  </div>
  <div class="branch-search-wrap">
    <div class="branch-search-row">
      <input type="text" id="branch-search" data-i18n-placeholder="branch_search_placeholder" placeholder="Search branches (fuzzy)..." style="width:220px;padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:13px;outline:none" oninput="onBranchSearchInput()">
      <span style="font-size:12px;color:#9ca3af">Quick:</span>
      <span class="branch-tag develop" onclick="setBranchSearchTag('develop')">develop</span>
      <span class="branch-tag release" onclick="setBranchSearchTag('release')">release</span>
      <span class="branch-tag" onclick="setBranchSearchTag('feature')">feature</span>
      <span class="branch-tag" onclick="setBranchSearchTag('hotfix')">hotfix</span>
      <button class="btn btn-sm btn-secondary" id="branch-search-clear" onclick="clearBranchSearch()" style="display:none">✕ Clear</button>
    </div>
  </div>
  <div class="log-controls" style="margin-bottom:14px">
    <select id="branches-per-page" onchange="onPerPageChange(this,'branches')">
      <option value="10">10/pg</option><option value="20" selected>20/pg</option><option value="50">50/pg</option><option value="100">100/pg</option><option value="200">200/pg</option><option value="300">300/pg</option><option value="0">All ⚠️</option>
    </select>
    <span id="branches-all-warn" style="display:none;font-size:12px;color:#d97706;background:#fef3c7;padding:2px 10px;border-radius:6px" data-i18n="all_mode_slow">⚠️ Loading all may be slow</span>
  </div>
  <div id="branches-content"></div>
  <div class="pagination" id="branches-pagination"></div>
</div>

<!-- ═══════════ Restore File Page ═══════════ -->
<div class="page" id="page-restore">
  <button class="btn btn-secondary btn-back" onclick="switchPage('log')" data-i18n="back_to_log">← Back to Log</button>
  <h2 style="margin-bottom:8px" data-i18n="restore_page_title">Restore File to Commit</h2>
  <div class="restore-page-file" id="restore-file-info">
    <span class="filepath" id="restore-filepath"></span>
  </div>
  <p style="font-size:13px;color:#6b7280;margin-bottom:16px" data-i18n="restore_page_desc">Select a commit below to restore this file to that version. This will overwrite your current working copy.</p>
  <div id="restore-result" style="margin-bottom:12px"></div>
  <div id="restore-commits-content"></div>
  <div class="pagination" id="restore-pagination"></div>
</div>

<!-- ═══════════ Stash Page ═══════════ -->
<div class="page" id="page-stash">
  <button class="btn btn-secondary btn-back" onclick="switchPage('main')">← <span data-i18n="back">Back</span></button>
  <h2 style="margin-bottom:16px" data-i18n="stash_title">Stash List</h2>
  <div class="log-controls">
    <select id="stash-per-page" onchange="onPerPageChange(this,'stash')">
      <option value="1">1/pg</option><option value="5">5/pg</option><option value="10" selected>10/pg</option><option value="20">20/pg</option><option value="50">50/pg</option><option value="100">100/pg</option><option value="200">200/pg</option><option value="300">300/pg</option><option value="0">All ⚠️</option>
    </select>
    <span id="stash-all-warn" style="display:none;font-size:12px;color:#d97706;background:#fef3c7;padding:2px 10px;border-radius:6px" data-i18n="all_mode_slow">⚠️ Loading all may be slow</span>
  </div>
  <div id="stash-content"></div>
  <div class="pagination" id="stash-pagination"></div>
</div>

<!-- ═══════════ Conflicts Page ═══════════ -->
<div class="page" id="page-conflicts">
  <button class="btn btn-secondary btn-back" onclick="switchPage('main')">← <span data-i18n="back">Back</span></button>
  <h2 style="margin-bottom:16px" data-i18n="conflicts_title">Conflict Resolution</h2>
  <div id="conflicts-content"></div>
</div>

<!-- ═══════════ Log Page ═══════════ -->
<div class="page" id="page-log">
  <button class="btn btn-secondary btn-back" onclick="switchPage('main')">← <span data-i18n="back">Back</span></button>
  <h2 style="margin-bottom:16px" data-i18n="log_title">Commit Log</h2>
  <div class="log-controls">
    <input type="text" id="log-search" data-i18n-placeholder="log_search_placeholder" placeholder="Search hash / author / message..." style="width:200px" oninput="onLogSearchInput()">
    <input type="text" id="log-code-search" data-i18n-placeholder="code_search_placeholder" placeholder="Search code in diffs..." style="width:200px" oninput="filterCommitDiffs()">
    <button class="btn btn-sm btn-primary" id="log-search-btn" onclick="clearLogSearch()" style="display:none">✕</button>
    <select id="log-per-page" onchange="onPerPageChange(this,'log')">
      <option value="1">1/pg</option><option value="5">5/pg</option><option value="10" selected>10/pg</option><option value="20">20/pg</option><option value="50">50/pg</option><option value="100">100/pg</option><option value="200">200/pg</option><option value="300">300/pg</option><option value="0">All ⚠️</option>
    </select>
    <span id="log-all-warn" style="display:none;font-size:12px;color:#d97706;background:#fef3c7;padding:2px 10px;border-radius:6px" data-i18n="all_mode_slow">⚠️ Loading all may be slow</span>
    <button class="btn btn-sm btn-danger abort-btn" onclick="abortMerge()" data-i18n="abort_conflict">Reset Conflict State</button>
  </div>
  <div id="squash-bar" class="squash-bar" style="display:none">
    <span style="font-size:13px;font-weight:600">Squash msg:</span>
    <input type="text" id="squash-msg" data-i18n-placeholder="squash_msg_placeholder" placeholder="New commit message...">
    <button class="btn btn-sm btn-warning" onclick="doSquash()">Squash</button>
    <button class="btn btn-sm btn-secondary" onclick="cancelSquash()">Cancel</button>
    <span class="help-toggle" onclick="toggleHelp('help-squash')" style="display:inline-flex;align-items:center;gap:4px;font-size:12px;padding:3px 10px;border-radius:6px;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;text-decoration:none;font-weight:600">ℹ️ What is Squash?</span>
  </div>
  <div class="help-box" id="help-squash">
    <b>Squash:</b> Select 2+ commits via checkbox, then merge them into one new commit. Uses <code>git reset --soft</code> followed by a new commit.
  </div>
  <div style="display:flex;align-items:center;gap:8px;padding:7px 14px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;font-size:13px;color:#92400e;margin-bottom:8px">
    <span data-i18n="squash_tip">💡 Tip: Check 2 or more commit checkboxes to merge them into one commit (Squash)</span>
  </div>
  <div id="log-content"></div>
  <div class="pagination" id="log-pagination"></div>
</div>

<!-- ═══════════ Msg Log Page ═══════════ -->
<div class="page" id="page-msglog">
  <button class="btn btn-secondary btn-back" onclick="switchPage('main')">← <span data-i18n="back">Back</span></button>
  <h2 style="margin-bottom:16px" data-i18n="msglog_title">Message Log</h2>
  <div class="log-controls">
    <button class="btn btn-danger btn-sm" onclick="clearMsgLog()" data-i18n="clear_msglog">Clear All Messages</button>
  </div>
  <div id="msglog-content"></div>
  <div class="pagination" id="msglog-pagination"></div>
</div>

<div id="toast"></div>
<div id="global-spinner"><span class="spinner"></span><span id="spinner-msg">Loading...</span></div>
</div>

<!-- ═══════════ Modal ═══════════ -->
<div class="modal-bg" id="modal-bg">
  <div class="modal-box">
    <h2 id="modal-title">Stash Changes?</h2>
    <p id="modal-msg">You have uncommitted changes. Stash before switching?</p>
    <div class="modal-btns" id="modal-btns">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-warning" id="modal-confirm">Stash & Switch</button>
    </div>
  </div>
</div>

<script>
// ═══════════ i18n ═══════════
var L = (localStorage.getItem('git_tool_lang') || 'en');
var T = {
  select_all: {en:'Select / Deselect All', zh:'全选 / 取消全选'},
  confirm_commit: {en:'Confirm Commit', zh:'确认 Commit'},
  deselect_all: {en:'Deselect All', zh:'全部取消'},
  refresh: {en:'Refresh', zh:'刷新'},
  back: {en:'Back', zh:'返回'},
  branches_title: {en:'Branches', zh:'分支列表'},
  stash_title: {en:'Stash List', zh:'Stash 列表'},
  conflicts_title: {en:'Conflict Resolution', zh:'冲突解决'},
  log_title: {en:'Commit Log', zh:'提交记录'},
  msglog_title: {en:'Message Log', zh:'消息日志'},
  abort_conflict: {en:'Reset Conflict State', zh:'重置冲突状态'},
  msg_count: {en:'Messages: {n}', zh:'消息: {n} 条'},
  view_log: {en:'View Log', zh:'查看日志'},
  clear_msglog: {en:'Clear All Messages', zh:'清空日志'},
  no_files: {en:'No files to commit!', zh:'没有需要提交的文件！'},
  files_pending: {en:'{n} file(s) pending', zh:'共 {n} 个文件待提交'},
  lines: {en:'lines', zh:'行'},
  git_added: {en:'git add done', zh:'已 git add'},
  git_reset: {en:'git reset done', zh:'已 git reset'},
  op_failed: {en:'Operation failed', zh:'操作失败'},
  commit_msg_empty: {en:'Commit message cannot be empty!', zh:'提交信息不能为空！'},
  select_at_least_one: {en:'Please select at least one file!', zh:'请至少勾选一个文件！'},
  commit_ok: {en:'Commit successful!', zh:'提交成功！'},
  commit_fail: {en:'Commit failed', zh:'提交失败'},
  loading_failed: {en:'Failed to load: ', zh:'加载失败: '},
  network_err: {en:'Network error: ', zh:'网络请求失败: '},
  pulling: {en:'Pulling latest...', zh:'正在拉取最新代码...'},
  pull_ok: {en:'Pull successful: ', zh:'拉取成功: '},
  pull_conflict: {en:'Conflict detected! Go to Conflicts page.', zh:'拉取出现冲突，请到 Conflicts 页面解决'},
  pull_fail: {en:'Pull failed: ', zh:'拉取失败: '},
  switch_to_branch: {en:'Switched to branch: ', zh:'已切换到分支: '},
  switch_fail: {en:'Checkout failed: ', zh:'切换失败: '},
  stash_switched: {en:'Stash & Switch', zh:'Stash 并切换'},
  stash_prompt: {en:'You have uncommitted changes. Stash before switching to ', zh:'当前有未提交的改动。是否 stash 再切换到 '},
  no_stash: {en:'No stashed changes', zh:'暂无 stash'},
  no_conflict: {en:'No conflicts!', zh:'没有冲突！'},
  no_match: {en:'No matching commits', zh:'无匹配的 commit'},
  branch_no_upstream: {en:'Branch has no upstream. Click fix button to configure.', zh:'分支未设置 upstream，点击修复按钮自动配置'},
  fix_upstream: {en:'Fix: set upstream', zh:'修复: 设置 upstream'},
  branch_no_remote: {en:'Remote branch not found. Push to origin?', zh:'远端没有该分支，点击推送到远端'},
  push_to_origin: {en:'Push to origin', zh:'推送到远端'},
  fetch_ok: {en:'Fetch successful', zh:'Fetch 成功'},
  fetch_fail: {en:'Fetch failed: ', zh:'Fetch 失败: '},
  msg_cleared: {en:'Message log cleared', zh:'消息日志已清空'},
  confirm_clear_msg: {en:'Clear all message logs?', zh:'确定清空所有消息日志？'},
  reset_soft: {en:'Soft Reset', zh:'软重置'},
  reset_hard: {en:'Hard Reset', zh:'硬重置'},
  reset_desc: {en:'<b>Soft Reset</b>: Keeps working tree changes, moves commits back to staging.<br><b>Hard Reset</b>: Discards ALL changes back to that commit.', zh:'<b>Soft Reset</b>: 保留工作区改动，commit 回到暂存区。<br><b>Hard Reset</b>: 丢弃所有改动，直接回到该commit状态。'},
  revert_title: {en:'Revert', zh:'撤销'},
  revert_desc: {en:'Creates a new commit that undoes this commit. History is preserved.', zh:'创建一个新commit撤销该commit，不丢失历史。'},
  squash_confirm: {en:'Squash {n} commits into one?', zh:'将 {n} 个commit合并为1个？'},
  squash_ok: {en:'Squash successful!', zh:'Squash 成功！'},
  squash_fail: {en:'Squash failed: ', zh:'Squash 失败: '},
  reset_ok: {en:'Reset ({mode}) successful', zh:'Reset ({mode}) 成功'},
  reset_fail: {en:'Reset failed: ', zh:'Reset 失败: '},
  revert_ok: {en:'Revert successful', zh:'Revert 成功'},
  revert_fail: {en:'Revert failed: ', zh:'Revert 失败: '},
  conflict_reset_title: {en:'Reset Conflict State', zh:'重置冲突状态'},
  conflict_reset_desc: {en:'Abort current merge/rebase/cherry-pick, revert to latest commit. Working changes are kept.', zh:'中止当前 merge/rebase/cherry-pick，还原到最新commit。工作区改动保留。'},
  conflict_reset_ok: {en:'Conflict state reset', zh:'冲突状态已重置'},
  all_selected: {en:'All selected & git add done', zh:'已全选并 git add'},
  all_deselected: {en:'All deselected', zh:'已全部取消'},
  partial_fail: {en:'Partial operation failed', zh:'部分操作失败'},
  upstream_set_ok: {en:'Upstream set, retrying pull...', zh:'Upstream 已设置，重试 pull...'},
  upstream_set_fail: {en:'Upstream set failed: ', zh:'设置失败: '},
  push_ok: {en:'Push successful, retrying pull...', zh:'Push 成功，重试 pull...'},
  push_fail: {en:'Push failed: ', zh:'Push 失败: '},
  current_branch_label: {en:'Current Branch:', zh:'当前分支: '},
  op_failed_err: {en:"Failed: ", zh:"操作失败: "},
  ignored_file: {en:'Ignored: ', zh:'已忽略: '},
  ignore_failed: {en:'Ignore failed: ', zh:'忽略失败: '},
  push_to: {en:'Pushing to origin/', zh:'正在推送到 origin/'},
  push_failed: {en:'Push failed: ', zh:'推送失败: '},
  fetching: {en:'Fetching...', zh:'正在拉取...'},
  pull_merge_ok: {en:'Pull (merge) OK', zh:'Pull (合并) 成功'},
  pull_rebase_ok: {en:'Pull (rebase) OK', zh:'Pull (变基) 成功'},
  pull_ff_ok: {en:'Pull (ff-only) OK', zh:'Pull (快进) 成功'},
  stash_pop_ok: {en:'Stash pop OK', zh:'Stash pop 成功'},
  stash_pop_fail: {en:'Stash pop failed: ', zh:'Stash pop 失败: '},
  stash_deleted: {en:'Stash deleted', zh:'Stash 已删除'},
  delete_failed: {en:'Delete failed: ', zh:'删除失败: '},
  file_restored: {en:'File restored: ', zh:'文件已还原: '},
  restore_failed: {en:'Restore failed: ', zh:'还原失败: '},
  select_2_commits: {en:'Select 2+ commits', zh:'请选择至少2个commit'},
  enter_squash_msg: {en:'Enter squash message', zh:'请输入合并后的message'},
  no_conflict_abort: {en:'No conflict or abort failed: ', zh:'无冲突或中止失败: '},
  conflict_resolved: {en:'Conflict resolved with ', zh:'冲突已解决: '},
  conflict_resolved_ok: {en:'Conflict resolved', zh:'冲突已解决'},
  stash_failed: {en:'Stash failed: ', zh:'Stash 失败: '},
  pull_ok_pop: {en:'Pull OK, popping stash...', zh:'Pull 成功，恢复 stash...'},
  stash_conflict: {en:'Stash pop conflict! Resolve in Conflicts tab.', zh:'Stash pop 冲突！请在 Conflicts 页面解决。'},
  pushing: {en:'Pushing...', zh:'正在推送...'},
  push_ok: {en:'Push OK: ', zh:'推送成功: '},
  branch_created: {en:'Branch created: ', zh:'分支已创建: '},
  create_failed: {en:'Create failed: ', zh:'创建失败: '},
  enter_branch_name: {en:'Enter a branch name', zh:'请输入分支名'},
  confirm_commit_title: {en:'Confirm Commit', zh:'确认提交'},
  stashing_pulling: {en:'Stashing & pulling...', zh:'正在暂存并拉取...'},
  all_mode_slow: {en:'⚠️ Loading all may be slow', zh:'⚠️ All 模式可能加载缓慢'},
  squash_root_error: {en:'Cannot squash: the oldest selected commit is the initial (root) commit and has no parent. Please deselect it.', zh:'无法 Squash：选中的最旧提交是初始 commit（没有父节点），请取消勾选它。'},
  force_push_title: {en:'🎉 Squash Successful!', zh:'🎉 Squash 成功！'},
  force_push_desc: {en:'Squash rewrites commit history. To update the remote branch you must <b>force push</b> (<code>--force-with-lease</code>).<br><br>Force push now?', zh:'Squash 会改写提交历史，远端分支需要使用 <b>force push</b>（<code>--force-with-lease</code>）才能更新。<br><br>现在立即执行吗？'},
  force_push_btn: {en:'Force Push Now', zh:'立即 Force Push'},
  force_push_later: {en:'Later', zh:'稍后手动操作'},
  squash_tip: {en:'💡 Tip: Check 2 or more commit checkboxes to merge them into one commit (Squash)', zh:'💡 提示：勾选 2 个或以上 commit 的 checkbox，可将它们合并为一个新 commit（Squash）'},
  create_branch_btn: {en:'+ Create Branch', zh:'+ 新建分支'},
  new_branch_placeholder: {en:'New branch name...', zh:'新分支名...'},
  branch_search_placeholder: {en:'Search branches (fuzzy)...', zh:'搜索分支（模糊匹配）...'},
  log_search_placeholder: {en:'Search hash / author / message...', zh:'搜索 hash / 作者 / 消息...'},
  code_search_placeholder: {en:'Search code in diffs...', zh:'搜索代码变更...'},
  squash_msg_placeholder: {en:'New commit message...', zh:'合并后的新 commit 消息...'},
  restore_page_title: {en:'Restore File to Commit', zh:'还原文件到指定 Commit'},
  restore_page_desc: {en:'Select a commit below to restore this file to that version. This will overwrite your current working copy.', zh:'选择一个 commit，将当前文件还原到该版本（会覆盖当前工作区文件）。'},
  back_to_log: {en:'← Back to Log', zh:'← 返回 Commit Log'},
  tab_commit: {en:'Commit', zh:'提交'},
  tab_branches: {en:'Branches', zh:'分支'},
  tab_log: {en:'Commit Log', zh:'提交日志'},
  tab_conflicts: {en:'Conflicts', zh:'冲突'},
  tab_stash: {en:'Stash', zh:'暂存'},
  tab_fetch: {en:'Fetch', zh:'Fetch'},
  tab_fetch_title: {en:'Fetch from remote (download only)', zh:'从远端拉取最新信息（仅下载，不合并）'},
  tab_pull: {en:'Pull', zh:'Pull'},
  tab_pull_title: {en:'Pull & rebase from remote', zh:'从远端拉取并 rebase 到当前分支'},
  tab_push: {en:'Push', zh:'Push'},
  tab_push_title: {en:'Push local commits to remote', zh:'推送本地 commit 到远端'},
  fetch_desc: {en:'Check remote for new commits', zh:'检查远端是否有新 commit'},
  pull_desc: {en:'Sync remote commits to local', zh:'将远端 commit 同步到本地'},
  push_desc: {en:'Send local commits to remote', zh:'将本地 commit 推送到远端'},
  protected_branch_title: {en:'⚠️ Protected Branch Warning', zh:'⚠️ 重要分支警告'},
  protected_branch_commit: {en:'You are about to <b>commit</b> directly to <b style="color:#dc2626">{branch}</b>.<br><br><b>This is a protected branch.</b> Direct commits to <code>develop</code> / <code>release</code> / <code>main</code> / <code>master</code> may break the team workflow.<br><br>Are you sure you want to continue?', zh:'你即将直接向 <b style="color:#dc2626">{branch}</b> 提交 commit。<br><br><b>这是重要分支。</b>直接向 <code>develop</code> / <code>release</code> / <code>main</code> / <code>master</code> 提交可能破坏团队工作流程。<br><br>确定要继续吗？'},
  protected_branch_squash: {en:'You are about to <b>squash commits</b> directly on <b style="color:#dc2626">{branch}</b>.<br><br><b>This is a protected branch.</b> Squashing rewrites history and may affect other team members.<br><br>Are you sure you want to continue?', zh:'你即将在 <b style="color:#dc2626">{branch}</b> 上直接执行 Squash（合并 commit）。<br><br><b>这是重要分支。</b>Squash 会重写历史记录，可能影响其他团队成员。<br><br>确定要继续吗？'},
  proceed_anyway: {en:'Proceed Anyway', zh:'仍然继续'},
};

function t(key, lang) {
  lang = lang || L;
  var entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}

function tf(key, lang, replacements) {
  var s = t(key, lang);
  if (replacements) {
    for (var k in replacements) s = s.replace('{'+k+'}', replacements[k]);
  }
  return s;
}

function switchLang(lang) {
  L = lang;
  localStorage.setItem('git_tool_lang', lang);
  var sel = document.getElementById('lang-sel');
  if (sel) sel.value = lang;
  applyI18n();
  var active = document.querySelector('.page.active');
  if (active) {
    var id = active.id;
    if (id === 'page-main') loadFiles();
    else if (id === 'page-branches') loadBranches(1);
    else if (id === 'page-stash') loadStash();
    else if (id === 'page-conflicts') loadConflicts();
    else if (id === 'page-log') loadLog(1);
    else if (id === 'page-msglog') loadMsgLog(1);
  }
}

function applyI18n() {
  var els = document.querySelectorAll('[data-i18n]');
  for (var i=0; i<els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  }
  var phEls = document.querySelectorAll('[data-i18n-placeholder]');
  for (var i=0; i<phEls.length; i++) {
    phEls[i].placeholder = t(phEls[i].getAttribute('data-i18n-placeholder'));
  }
  var titleEls = document.querySelectorAll('[data-i18n-title]');
  for (var i=0; i<titleEls.length; i++) {
    titleEls[i].title = t(titleEls[i].getAttribute('data-i18n-title'));
  }
  var cntSpan = document.querySelector('.msg-log-bar span[data-i18n="msg_count"]');
  if (cntSpan) cntSpan.textContent = tf('msg_count', L, {n: msgLog.length});
}

var msgLog = [];
var msgId = 0;

// Init
(function(){
  try {
    var sel = document.getElementById('lang-sel');
    if (sel) sel.value = L;
    applyI18n();
  } catch(e) {
    document.body.insertAdjacentHTML('afterbegin','<div style="background:#fee2e2;color:#991b1b;padding:10px;margin:10px;border-radius:8px">JS Error: '+e.message+'</div>');
  }
})();

var API_BASE = window.location.origin;
var checkedPaths = {};
var expandedPaths = {};
var modalCallback = null;
var resolvedConflicts = {};
var squashSelected = {};
var currentLogData = null;

// ═══════════ Utils ═══════════
var _spinnerCount=0;
function _showSpinner(msg){
  _spinnerCount++;
  var s=document.getElementById('global-spinner');
  if(s){document.getElementById('spinner-msg').textContent=msg||'Loading...';s.classList.add('show')}
}
function _hideSpinner(){
  _spinnerCount=Math.max(0,_spinnerCount-1);
  if(!_spinnerCount){var s=document.getElementById('global-spinner');if(s)s.classList.remove('show')}
}
function showToast(msg, type, duration) {
  type=type||'info'; duration=duration||3500;
  var t=document.getElementById('toast');
  t.textContent=msg;
  t.className='show '+(type==='ok'?'ok':type==='err'?'err':'info');
  setTimeout(function(){t.classList.remove('show')},duration);
}
function onPerPageChange(sel, section){
  var isAll=sel.value==='0';
  var warnId=section+'-all-warn';
  var warn=document.getElementById(warnId);
  if(warn)warn.style.display=isAll?'inline-block':'none';
  if(section==='branches')loadBranches(1);
  else if(section==='log')loadLog(1);
  else if(section==='stash')loadStash(1);
}

function escapeHtml(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escapeAttr(s){s=s==null?'':String(s);return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function addMsg(msg, cls) {
  cls=cls||'info';
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  div.innerHTML='<span class="msg-text">'+escapeHtml(msg)+'</span><span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span>';
  area.appendChild(div);
}

function addMsgWithAction(msg, cls, actions) {
  cls=cls||'info';
  msgLog.push({time:new Date().toLocaleString(), type:cls, text:msg});
  updateMsgCount();
  var area=document.getElementById('msg-area');
  area.innerHTML='';
  var id='msg-'+ (++msgId);
  var div=document.createElement('div');
  div.className='msg-item '+cls;
  div.id=id;
  var btnHtml='';
  actions.forEach(function(a){
    btnHtml+=' <button class="btn btn-sm btn-primary" onclick="dismissMsg(\''+id+'\');('+a.onClick.toString()+')()" style="margin-left:6px">'+escapeHtml(a.label)+'</button>';
  });
  div.innerHTML='<span class="msg-text">'+escapeHtml(msg)+'</span>'+btnHtml+'<span class="msg-close" onclick="dismissMsg(\''+id+'\')">✕</span>';
  area.appendChild(div);
}

function updateMsgCount(){
  var el = document.querySelector('.msg-log-bar span[data-i18n="msg_count"]');
  if (el) el.textContent = tf('msg_count', L, {n: msgLog.length});
}
function dismissMsg(id){var el=document.getElementById(id);if(el)el.remove()}

function safeApiGet(path,cb){
  fetch(API_BASE+path).then(function(r){return r.json()}).then(cb).catch(function(e){console.error(e);if(typeof addMsg==='function')addMsg(t('network_err')+e.message,'error')});
}
function safeApiPost(path,body,cb){
  fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){return r.json()}).then(cb).catch(function(e){console.error(e);if(typeof addMsg==='function')addMsg(t('network_err')+e.message,'error')});
}

// ═══════════ Msg Log page ═══════════
var msgLogPage = 1;
function loadMsgLog(page) {
  page=page||1; msgLogPage=page;
  switchPage('msglog');
  var perPage=10;
  var total=msgLog.length;
  var totalPages=Math.ceil(total/perPage);
  var start=(page-1)*perPage;
  var items=msgLog.slice(start,start+perPage).reverse();
  var container=document.getElementById('msglog-content');
  if(!items.length){container.innerHTML='<div class="empty">No messages</div>';return}
  var html='<table class="log-table"><thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead><tbody>';
  items.forEach(function(m){
    var cls=m.type==='error'?'color:#dc2626':m.type==='success'?'color:#059664':'color:#6b7280';
    html+='<tr><td style="font-size:12px;color:#9ca3af;white-space:nowrap">'+escapeHtml(m.time)+'</td><td style="'+cls+'">'+m.type+'</td><td style="font-size:13px">'+escapeHtml(m.text)+'</td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  // pagination
  var pag=document.getElementById('msglog-pagination');
  if(totalPages<=1){pag.innerHTML='';return}
  var phtml='<span class="page-info">Total '+total+'</span>';
  for(var i=1;i<=totalPages;i++){
    var cl=(i===page)?' page-num active':' page-num';
    phtml+='<span class="'+cl+'" onclick="loadMsgLog('+i+')">'+i+'</span>';
  }
  pag.innerHTML=phtml;
}

function clearMsgLog() {
  showModal(t('confirm_clear_msg'), t('confirm_clear_msg'), 'Clear', function(){
    msgLog=[];
    updateMsgCount();
    addMsg(t('msg_cleared'),'success');
    loadMsgLog(1);
  });
}

function showModal(title, msg, confirmLabel, cb) {
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var cancelBtn=document.createElement('button');
  cancelBtn.className='btn btn-secondary';
  cancelBtn.textContent='Cancel';
  cancelBtn.onclick=function(){closeModal();};
  var confirmBtn=document.createElement('button');
  confirmBtn.className='btn btn-warning';
  confirmBtn.textContent=confirmLabel;
  confirmBtn.onclick=function(){var c=cb;closeModal();if(c)c();};
  btnsDiv.appendChild(cancelBtn);
  btnsDiv.appendChild(confirmBtn);
  document.getElementById('modal-bg').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('show');
  modalCallback=null;
}

function toggleHelp(id) {
  var el=document.getElementById(id);
  el.classList.toggle('show');
}

function switchPage(name) {
  var pages=document.querySelectorAll('.page');
  for(var i=0;i<pages.length;i++)pages[i].classList.remove('active');
  var target=document.getElementById('page-'+name);
  if(target)target.classList.add('active');
  var tabs=document.querySelectorAll('.btn-tab');
  for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('active');
  var tabMap={main:'commit',branches:'branches',stash:'stash',conflicts:'conflicts',log:'log',msglog:'log',restore:'log'};
  var tabId='tab-'+(tabMap[name]||name);
  var activeTab=document.getElementById(tabId);
  if(activeTab)activeTab.classList.add('active');
  if(name==='main')loadFiles();
}

function apiGet(path,cb){
  _showSpinner();
  fetch(API_BASE+path).then(function(r){return r.json()}).then(function(d){_hideSpinner();cb(d)}).catch(function(e){_hideSpinner();addMsg(t('network_err')+e.message,'error')})
}
function apiPost(path,body,cb){
  _showSpinner();
  fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){return r.json()}).then(function(d){_hideSpinner();cb(d)}).catch(function(e){_hideSpinner();addMsg(t('network_err')+e.message,'error')});
}

// ═══════════ Diff highlight ═══════════
function highlightDiff(text) {
  if(!text)return'';
  var lines=text.split('\n');
  var html='<table class="diff-table"><tbody>';
  for(var i=0;i<lines.length;i++){
    var line=lines[i],cls='diff-content',prefix='';
    var escaped=escapeHtml(line);
    if(line.charAt(0)==='+'){cls+=' diff-add';prefix='+'}
    else if(line.charAt(0)==='-'){cls+=' diff-rem';prefix='-'}
    else if(line.charAt(0)==='\\'||/^(diff|index|@@) /.test(line)){cls+=' diff-meta'}
    html+='<tr><td class="diff-prefix">'+prefix+'</td><td class="'+cls+'">'+escaped+'</td></tr>';
  }
  html+='</tbody></table>';
  return html;
}

// ═══════════ Main page ═══════════
function renderFiles(files) {
  var list=document.getElementById('file-list');
  var allBar=document.getElementById('select-all-bar');
  if(!files.length){
    list.innerHTML='<div class="empty">🎉 '+t('no_files')+'</div>';
    document.getElementById('toolbar').style.display='none';
    allBar.style.display='none';
    return;
  }
  document.getElementById('toolbar').style.display='flex';
  allBar.style.display='block';
  var allCb=document.getElementById('select-all-cb');
  var allChecked=files.every(function(f){return checkedPaths[f.path]});
  allCb.checked=allChecked;
  var html='';
  files.forEach(function(f,idx){
    var safePath=escapeHtml(f.path),attrPath=escapeAttr(f.path);
    var diffHtml=highlightDiff(f.diff);
    var checked=checkedPaths[f.path]?' checked':'';
    var expanded=expandedPaths[f.path];
    var toggleCls=expanded?' file-toggle open':' file-toggle';
    var bodyCls=expanded?' file-body expanded':' file-body';
    var lineCount=f.diff?f.diff.split('\n').length:0;
    html+='<div class="file-card" data-index="'+idx+'"><div class="file-header">';
    html+='<span class="cb-wrap"><input type="checkbox" data-path="'+attrPath+'" class="file-cb"'+checked+'></span>';
    html+='<span class="'+toggleCls+'">▶</span>';
    html+='<span class="file-path">'+safePath+'</span>';
    html+='<span style="color:#9ca3af;font-size:12px">('+lineCount+' '+t('lines')+')</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();ignoreFile(\''+attrPath+'\')" title="Discard changes for this file">Ignore</button>';
    html+='</div>';
    if(diffHtml){html+='<div class="'+bodyCls+'"><div class="diff-block">'+diffHtml+'</div></div>'}
    html+='</div>';
  });
  list.innerHTML=html;
}

function loadFiles(){apiGet('/api/files',function(data){renderFiles(data.files)})}

function ignoreFile(path){
  apiPost('/api/ignore',{path:path},function(data){
    if(data.ok){addMsg(t('ignored_file')+path,'success');loadFiles()}
    else addMsg(t('ignore_failed')+(data.error||''),'error');
  });
}
function loadCurrentBranch(){apiGet('/api/current-branch',function(data){
  var el = document.getElementById('branch-name');
  if (el) el.textContent = data.branch;
})}

function checkConflicts(){
  apiGet('/api/conflicts',function(data){
    var tab=document.getElementById('tab-conflicts');
    if(data.count>0){
      tab.textContent='Conflicts ('+data.count+')';
      tab.style.background='#fee2e2';tab.style.color='#991b1b';
    }else{
      tab.textContent='Conflicts';
      tab.style.background='';tab.style.color='';
    }
  });
}

// ═══════════ Pull + Fetch ═══════════
function doPush(credentials, force){
  var branchEl=document.getElementById('branch-name');
  var branch=(branchEl&&branchEl.textContent)||'?';
  var body=credentials||{};
  if(force) body.force=true;
  var logDivId='push-log-live';
  var pushLabel=force?'🚀 Force Pushing':'🚀 Pushing';
  var pushDesc=force?'force push (--force-with-lease) to':'push to';

  // Build live log modal
  var logBox='<div id="'+logDivId+'" style="'
    +'background:#0f172a;color:#d1fae5;font-family:monospace;font-size:12px;line-height:1.5;'
    +'padding:12px 14px;border-radius:8px;min-height:140px;max-height:340px;'
    +'overflow-y:auto;white-space:pre-wrap;word-break:break-all;border:1px solid #1e293b">'
    +'<span style="color:#94a3b8">⏳ Starting '+pushDesc+' origin/'+escapeHtml(branch)+'...\n</span></div>';
  showModal(pushLabel+' — <span style="font-size:12px;font-weight:400;color:#94a3b8">origin/'+escapeHtml(branch)+'</span>',
    logBox, 'Please wait…', null);
  // Disable close until done
  var closeBtn=document.querySelector('#modal-btns .btn-warning');
  if(closeBtn){closeBtn.disabled=true;closeBtn.style.opacity='0.4';}

  apiPost('/api/push',body,function(data){
    var ld=document.getElementById(logDivId);
    if(!data||!data.jobId){
      if(ld) ld.innerHTML+='<span style="color:#f87171">❌ Failed to start push: '
        +escapeHtml((data&&data.error)||'unknown error')+'</span>\n';
      var cb=document.querySelector('#modal-btns .btn-warning');
      if(cb){cb.disabled=false;cb.style.opacity='';cb.textContent='Close';cb.onclick=closeModal;}
      return;
    }
    var jobId=data.jobId;
    var seenLines=0;
    function poll(){
      var xhr=new XMLHttpRequest();
      xhr.open('GET','/api/push-status?jobId='+encodeURIComponent(jobId));
      xhr.onload=function(){
        var r;
        try{r=JSON.parse(xhr.responseText);}catch(e){setTimeout(poll,600);return;}
        var ld2=document.getElementById(logDivId);
        if(ld2 && r.lines && r.lines.length>seenLines){
          for(var i=seenLines;i<r.lines.length;i++){
            var line=r.lines[i];
            // Colour certain lines
            var col='#e2e8f0';
            if(/^error:|fatal:|ERROR/i.test(line)) col='#f87171';
            else if(/^remote:|^To /i.test(line)) col='#67e8f9';
            else if(/^\$/.test(line)) col='#fbbf24';
            else if(/writing objects|compressing|counting/i.test(line)) col='#a5f3fc';
            ld2.innerHTML+='<span style="color:'+col+'">'+escapeHtml(line)+'</span>\n';
          }
          seenLines=r.lines.length;
          ld2.scrollTop=ld2.scrollHeight;
        }
        if(r.done){
          var ld3=document.getElementById(logDivId);
          if(r.ok){
            if(ld3) ld3.innerHTML+='<span style="color:#4ade80;font-weight:700">✅ Push succeeded!\n</span>';
            addMsg('✅ Push OK','success');
          } else if(r.authRequired){
            closeModal();
            _showPushAuthModal(branch);
            return;
          } else {
            if(ld3) ld3.innerHTML+='<span style="color:#f87171;font-weight:700">\n❌ Push failed!\n</span>';
            addMsg('❌ Push failed','error');
          }
          // Re-enable close button
          var cb=document.querySelector('#modal-btns .btn-warning');
          if(cb){cb.disabled=false;cb.style.opacity='';cb.textContent='Close';cb.onclick=closeModal;}
        } else {
          setTimeout(poll,500);
        }
      };
      xhr.onerror=function(){setTimeout(poll,1000);};
      xhr.send();
    }
    poll();
  });
}

function _showPushAuthModal(branch){
  var html='Push to <b>origin/'+escapeHtml(branch)+'</b> requires authentication.<br><br>'
    +'<label style="font-size:13px;font-weight:600">Username</label><br>'
    +'<input id="push-username" type="text" placeholder="Username" style="width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin:4px 0 10px"><br>'
    +'<label style="font-size:13px;font-weight:600">Password / Token</label><br>'
    +'<input id="push-password" type="password" placeholder="Password or personal access token" style="width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin:4px 0 4px"><br>'
    +'<span style="font-size:11px;color:#6b7280">Tip: use a personal access token instead of your password</span>';
  showModal('🔐 Authentication Required', html, 'Push', function(){
    var u=(document.getElementById('push-username')||{}).value||'';
    var p=(document.getElementById('push-password')||{}).value||'';
    if(!u||!p){addMsg('Username and password are required','error');return;}
    doPush({username:u,password:p});
  });
}

function doManualPush(){
  var branch=(document.getElementById('branch-name').textContent||'').trim();
  showModalDouble(
    '🚀 Push to remote?',
    'Push local commits on <b>'+escapeHtml(branch)+'</b> to <b>origin/'+escapeHtml(branch)+'</b>?<br><br><span style="font-size:12px;color:#6b7280">Only commits that are not yet on remote will be pushed.</span>',
    'Push Now',
    function(){ doPush(); },
    'Cancel',
    null,
    'btn-success',
    'btn-secondary'
  );
}

function doForcePush(){
  var branch=(document.getElementById('branch-name').textContent||'').trim();
  showModalDouble(
    t('force_push_title'),
    t('force_push_desc'),
    t('force_push_btn'),
    function(){ doPush({}, true); },
    t('force_push_later'),
    null,
    'btn-danger',
    'btn-secondary'
  );
}

function _showGitLog(label, log){
  if(!log||!log.trim()) return;
  // Filter out SSH post-quantum warnings (not actionable)
  var lines = log.split('\n').filter(function(l){
    return l.indexOf('post-quantum')<0 && l.indexOf('openssh.com/pq')<0;
  });
  var cleaned = lines.join('\n').trim();
  if(cleaned) addMsg('📋 '+label+':\n'+cleaned, 'info');
}

function _executePull(mode, onDone){
  apiPost('/api/pull',{mode:mode||'merge'},function(data){
    _showGitLog('Git pull log', data.log||'');
    if(data.ok){
      addMsg(t('pull_ok')+(data.log||'').split('\n')[0],'success');
      checkConflicts();
      if(onDone) onDone(true);
    } else {
      handlePullErr(data.error||data.log||'');
      if(onDone) onDone(false);
    }
  });
}

function doPull() {
  addMsg(t('pulling'),'info');
  apiGet('/api/has-uncommitted',function(hasData){
    if(hasData&&hasData.hasChanges){
      addMsg('🔒 Local changes detected — auto-stashing before pull...','info');
      apiPost('/api/stash',{},function(stashData){
        if(!stashData.ok){
          addMsg('⚠️ Auto-stash failed: '+(stashData.error||'')+'. Fix local changes first.','error');
          return;
        }
        _executePull('merge',function(ok){
          apiPost('/api/stash-pop',{index:0},function(popData){
            if(!popData.ok){
              addMsg('⚠️ Stash pop conflict after pull — check Conflicts tab','error');
              checkConflicts();
            } else {
              addMsg('✅ Local changes restored after pull','ok');
            }
            loadFiles();
          });
        });
      });
    } else {
      _executePull('rebase',function(){ loadFiles(); });
    }
  });
}

function doFetch() {
  addMsg(t('fetching'),'info');
  apiPost('/api/fetch',{},function(data){
    _showGitLog('Git fetch log', data.log||'');
    if(data.ok){addMsg(t('fetch_ok'),'success');loadFiles();checkConflicts()}
    else{addMsg(t('fetch_fail')+(data.error||''),'error')}
  });
}

function handlePullErr(err) {
  if(err.indexOf('overwritten by merge')>=0||err.indexOf('would be overwritten')>=0){
    addMsgWithAction('⚠️ Pull blocked: local file changes conflict with remote. Auto-stash and retry?','error',[
      {label:'Stash & Retry Pull',onClick:function(){
        apiPost('/api/stash',{},function(s){
          if(!s.ok){addMsg('Stash failed: '+(s.error||''),'error');return}
          _executePull('rebase',function(){
            apiPost('/api/stash-pop',{index:0},function(p){
              if(!p.ok)addMsg('Stash pop conflict — check Conflicts tab','error');
              else addMsg('✅ Restored local changes after pull','ok');
              loadFiles();
            });
          });
        });
      }}
    ]);
  }
  else if(err.indexOf('CONFLICT')>=0||err.indexOf('conflict')>=0){addMsg(t('pull_conflict'),'error');checkConflicts()}
  else if(err.indexOf('divergent')>=0||err.indexOf('reconcile')>=0||err.indexOf('Need to specify')>=0){
    addMsgWithAction('Divergent branches detected. Choose strategy:', 'error', [
      {label:'Pull --merge', onClick:function(){_executePull('merge',function(){loadFiles()})}},
      {label:'Pull --rebase', onClick:function(){_executePull('rebase',function(){loadFiles()})}},
      {label:'Pull --ff-only', onClick:function(){_executePull('ff',function(){loadFiles()})}}
    ]);
  }
  else if(err.indexOf('no tracking')>=0||err.indexOf('upstream')>=0||err.indexOf('set-upstream')>=0){
    addMsgWithAction(t('branch_no_upstream'),'error',[{label:t('fix_upstream'),onClick:function(){apiPost('/api/set-upstream',{},function(r){if(r.ok){addMsg(t('upstream_set_ok'),'ok');doPull()}else addMsg(t('upstream_set_fail')+(r.error||''),'error')})}}]);
  }else if(err.indexOf('remote ref')>=0||err.indexOf("couldn't find")>=0){
    addMsg(t('pull_fail')+err,'error');
  }else addMsg(t('pull_fail')+err,'error');
}

// ═══════════ Branches ═══════════
var _branchSortField='date';
var _branchSortOrder='desc';
var _allBranchesCache=null;
var _branchSearchTimer=null;

function toggleBranchSort(field){
  if(_branchSortField===field){
    _branchSortOrder=_branchSortOrder==='desc'?'asc':'desc';
  }else{
    _branchSortField=field;
    _branchSortOrder='desc';
  }
  // Re-render with current data (no network call needed)
  var search=document.getElementById('branch-search').value.trim().toLowerCase();
  if(search&&_allBranchesCache){
    _renderFilteredBranches(search);
  }else if(!search){
    // reload to re-render with sort
    loadBranches(document.querySelector('#branches-pagination .page-num.active')?parseInt(document.querySelector('#branches-pagination .page-num.active').textContent):1);
  }
}

function _sortBranches(list){
  var desc=_branchSortOrder==='desc';
  return list.slice().sort(function(a,b){
    if(_branchSortField==='date'){
      return desc?(b.ts-a.ts):(a.ts-b.ts);
    }else{
      var na=a.name||'',nb=b.name||'';
      return desc?nb.localeCompare(na):na.localeCompare(nb);
    }
  });
}

function _branchSortHeader(){
  var ni=_branchSortField==='name'?(_branchSortOrder==='desc'?' ↓':' ↑'):'';
  var di=_branchSortField==='date'?(_branchSortOrder==='desc'?' ↓':' ↑'):'';
  return '<div style="display:flex;gap:16px;padding:6px 14px 4px;border-bottom:1px solid #e5e7eb;margin-bottom:4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.4px">'+
    '<span style="flex:1;cursor:pointer;user-select:none" onclick="toggleBranchSort(\'name\')" title="Sort by name">Name'+ni+'</span>'+
    '<span style="width:160px;cursor:pointer;user-select:none;text-align:right" onclick="toggleBranchSort(\'date\')" title="Sort by date">Last Commit'+di+'</span>'+
    '<span style="width:90px"></span>'+
    '</div>';
}

function loadBranches(page){
  page=page||1;
  switchPage('branches');
  document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading branches...</div>';
  document.getElementById('branches-pagination').innerHTML='';
  var _bpv=document.getElementById('branches-per-page').value;var perPage=_bpv===''?20:parseInt(_bpv);
  var url='/api/branches?page='+page+'&per_page='+perPage;
  apiGet(url,function(data){
    var container=document.getElementById('branches-content');
    var sortedLocal=_sortBranches(data.local||[]);
    var sortedRemote=_sortBranches(data.remote||[]);
    var html=_branchSortHeader();
    html+='<div class="branch-list"><h3>Local Branches ('+data.total_local+')</h3>';
    sortedLocal.forEach(function(b){
      var isCur=(b.name===data.current);
      var cls=isCur?' branch-item current':' branch-item';
      html+='<div class="'+cls+'">';
      html+='<span class="name">'+escapeHtml(b.name)+(isCur?' (current)':'')+'</span>';
      html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
      if(!isCur)html+='<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">Checkout</button>';
      html+='</div>';
    });
    html+='</div><div class="branch-list"><h3>Remote Branches ('+data.total_remote+')</h3>';
    sortedRemote.forEach(function(b){
      html+='<div class="branch-item">';
      html+='<span class="name">'+escapeHtml(b.name)+'</span>';
      html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
      html+='<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">Checkout</button>';
      html+='</div>';
    });
    html+='</div>';
    container.innerHTML=html;
    var pag=document.getElementById('branches-pagination');
    var totalPages=perPage>0?Math.ceil(data.total_remote/perPage):1;
    if(totalPages<=1){pag.innerHTML='';return}
    var phtml='<span class="page-info">Remote: '+data.total_remote+' total</span>';
    for(var i=1;i<=totalPages;i++){var cl=(i===data.page)?' page-num active':' page-num';phtml+='<span class="'+cl+'" onclick="loadBranches('+i+')">'+i+'</span>'}
    pag.innerHTML=phtml;
  });
}

function createNewBranch(){
  var name=document.getElementById('new-branch-name').value.trim();
  if(!name){addMsg(t('enter_branch_name'),'error');return}
  var curName=document.getElementById('branch-name').textContent;
  showModal('Create Branch','Create new branch <b>'+escapeHtml(name)+'</b><br><br>Based on: <span style="background:#1e40af;color:#fff;padding:2px 10px;border-radius:99px;font-weight:700">'+escapeHtml(curName)+'</span>','Create',function(){
    apiPost('/api/create-branch',{name:name},function(data){
      if(data.ok){addMsg(t('branch_created')+name,'success');document.getElementById('new-branch-name').value='';loadBranches();loadCurrentBranch();}
      else addMsg(t('create_failed')+(data.error||''),'error');
    });
  });
}

function checkoutBranch(branchName){
  apiGet('/api/has-uncommitted',function(data){
    if(data.hasChanges){
      showModal(t('stash_switched'),t('stash_prompt')+branchName+'?',t('stash_switched'),function(){
        apiPost('/api/stash',{},function(){doCheckout(branchName)});
      });
    }else doCheckout(branchName);
  });
}

function doCheckout(branchName){
  apiPost('/api/checkout',{branch:branchName},function(data){
    if(data.ok){
      apiGet('/api/current-branch',function(bd){
        var branch = bd.branch;
        document.getElementById('branch-name').textContent = branch;
        addMsg(t('switch_to_branch') + branch, 'success');
        showToast(t('switch_to_branch') + branch, 'ok', 2000);
        setTimeout(function(){ window.location.reload(); }, 1500);
      });
    }else addMsg(t('switch_fail')+(data.error||data.stderr||''),'error');
  });
}

// ═══════════ Stash ═══════════
function loadStash(page){
  page=page||1;
  switchPage('stash');
  document.getElementById('stash-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading stash...</div>';
  document.getElementById('stash-pagination').innerHTML='';
  var _spv=document.getElementById('stash-per-page').value;var perPage=_spv===''?10:parseInt(_spv);
  apiGet('/api/stash-list?page='+page+'&per_page='+perPage,function(data){
    var container=document.getElementById('stash-content');
    if(!data.stashes||!data.stashes.length){container.innerHTML='<div class="empty">'+t('no_stash')+'</div>';return}
    var html='';
    data.stashes.forEach(function(s,idx){
      var globalIdx = (data.page-1)*data.per_page + idx;
      html+='<div class="stash-item" style="flex-wrap:wrap;cursor:pointer" onclick="toggleStashDiff('+globalIdx+')">';
      html+='<span class="file-toggle" id="stash-toggle-'+globalIdx+'">▶</span>';
      html+='<span class="name">'+escapeHtml(s)+'</span>';
      html+='<button class="btn btn-sm btn-success" onclick="event.stopPropagation();popStash('+globalIdx+')">Pop</button>';
      html+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();dropStash('+globalIdx+')">Drop</button>';
      html+='</div>';
      html+='<div class="file-body" id="stash-body-'+globalIdx+'"><div id="stash-diff-'+globalIdx+'" style="padding:12px 16px"></div></div>';
    });
    container.innerHTML=html;
    // Pagination
    var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
    var pag=document.getElementById('stash-pagination');
    if(totalPages<=1){pag.innerHTML='';return}
    var phtml='<span class="page-info">Total '+data.total+'</span>';
    for(var i=1;i<=totalPages;i++){
      var cl=(i===data.page)?' page-num active':' page-num';
      phtml+='<span class="'+cl+'" onclick="loadStash('+i+')">'+i+'</span>';
    }
    pag.innerHTML=phtml;
  });
}

function toggleStashDiff(idx){
  var body=document.getElementById('stash-body-'+idx);
  var toggle=document.getElementById('stash-toggle-'+idx);
  var expanded=body.classList.contains('expanded');
  if(expanded){body.classList.remove('expanded');toggle.classList.remove('open');return}
  body.classList.add('expanded');toggle.classList.add('open');
  var diffEl=document.getElementById('stash-diff-'+idx);
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff...</div>';
  apiGet('/api/stash-diff?index='+idx,function(data){
    diffEl.innerHTML='<div class="diff-block">'+highlightDiff(data.diff||'(empty stash)')+'</div>';
  });
}
function popStash(idx){apiPost('/api/stash-pop',{index:idx},function(data){if(data.ok){addMsg(t('stash_pop_ok'),'success');switchPage('main');loadFiles()}else addMsg(t('stash_pop_fail')+(data.error||''),'error')})}
function dropStash(idx){showModal('Delete Stash','Delete this stash? This cannot be undone.','Delete',function(){apiPost('/api/stash-drop',{index:idx},function(data){if(data.ok){addMsg(t('stash_deleted'),'success');loadStash()}else addMsg(t('delete_failed')+(data.error||''),'error')})})}

// ═══════════ Log page ═══════════
var logDebounceTimer=null;
var logSortOrder='desc'; // 'desc' = newest first, 'asc' = oldest first
function onLogSearchInput(){
  var val=document.getElementById('log-search').value;
  document.getElementById('log-search-btn').style.display=val?'inline-block':'none';
  clearTimeout(logDebounceTimer);
  logDebounceTimer=setTimeout(function(){loadLog(1)},300);
}
function clearLogSearch(){document.getElementById('log-search').value='';document.getElementById('log-search-btn').style.display='none';loadLog(1)}

function toggleLogSort(){
  logSortOrder=logSortOrder==='desc'?'asc':'desc';
  loadLog(1);
}

function loadLog(page){
  page=page||1;
  switchPage('log');
  document.getElementById('log-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commits...</div>';
  document.getElementById('log-pagination').innerHTML='';
  var search=document.getElementById('log-search').value;
  var _lpv=document.getElementById('log-per-page').value;var perPage=_lpv===''?10:parseInt(_lpv);
  var url='/api/commits?page='+page+'&per_page='+perPage+'&order='+logSortOrder;
  if(search)url+='&search='+encodeURIComponent(search);
  apiGet(url,function(data){
    currentLogData=data;
    renderLog(data);
    renderPagination(data);
    if(data.commits&&data.commits.length)showToast('Loaded '+data.commits.length+' commit(s)','ok',2000);
  });
}

function renderLog(data){
  var container=document.getElementById('log-content');
  if(!data.commits||!data.commits.length){container.innerHTML='<div class="empty">'+t('no_match')+'</div>';return}
  var sortIcon=logSortOrder==='desc'?' ↓':' ↑';
  var sortTip=logSortOrder==='desc'?'Newest first — click for oldest first':'Oldest first — click for newest first';
  var html='<table class="log-table"><thead><tr>';
  html+='<th style="width:20px"></th>';
  html+='<th>Hash</th><th>Author</th>';
  html+='<th style="cursor:pointer;user-select:none;white-space:nowrap" onclick="toggleLogSort()" title="'+sortTip+'">Date'+sortIcon+'</th>';
  html+='<th>Message</th><th>Actions</th><th style="width:20px"></th>';
  html+='</tr></thead><tbody>';
  data.commits.forEach(function(c,idx){
    var checked=squashSelected[c.hash]?' checked':'';
    var isRoot=c.is_root?true:false;
    var cbDisabled=isRoot?' disabled title="'+(L==='zh'?'初始 commit 不可参与 Squash':'Initial commit cannot be squashed')+'"':'';
    var rootBadge=isRoot?'<span style="font-size:10px;background:#fef3c7;color:#92400e;border:1px solid #fcd34d;border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:middle">root</span>':'';
    html+='<tr style="cursor:pointer" onclick="toggleCommitDiff(\''+c.hash+'\','+idx+')"><td><input type="checkbox" class="squash-cb" data-hash="'+c.hash+'"'+checked+cbDisabled+' onclick="event.stopPropagation();toggleSquashSelect(this)"></td>';
    html+='<td><span class="log-hash" data-full="'+c.hash+'" onclick="event.stopPropagation();toggleHash(this)" title="Click to toggle full hash">'+c.short_hash+'</span></td>';
    html+='<td class="log-author">'+escapeHtml(c.author)+'</td>';
    html+='<td class="log-date">'+c.date+'</td>';
    html+='<td class="log-msg" title="'+escapeAttr(c.message)+'">'+escapeHtml(c.message)+rootBadge+'</td>';
    html+='<td class="log-actions">';
    html+='<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();showResetModal(\''+c.hash+'\',\''+c.short_hash+'\')">Reset</button>';
    html+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();showRevertModal(\''+c.hash+'\',\''+c.short_hash+'\')">Revert</button>';
    html+='</td>';
    html+='<td style="text-align:center"><span class="file-toggle" id="log-toggle-'+idx+'">▶</span></td>';
    html+='</tr>';
    html+='<tr id="commit-diff-row-'+idx+'" style="display:none"><td colspan="7" style="padding:0"><div id="commit-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto"></div></td></tr>';
  });
  html+='</tbody></table>';
  container.innerHTML=html;
  updateSquashBar();
}

function toggleCommitDiff(hash,idx){
  var row=document.getElementById('commit-diff-row-'+idx);
  var diffEl=document.getElementById('commit-diff-'+idx);
  var toggle=document.getElementById('log-toggle-'+idx);
  if(row.style.display!=='none'){
    row.style.display='none';
    if(toggle)toggle.classList.remove('open');
    return;
  }
  row.style.display='table-row';
  if(toggle)toggle.classList.add('open');
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff...</div>';
  apiGet('/api/commit-diff?commit='+hash,function(data){
    diffEl.innerHTML='<div class="diff-block">'+highlightDiffFiles(data.diff, hash)+'</div>';
  });
}

function highlightDiffFiles(text, commitHash){
  if(!text)return'';
  var lines=text.split('\n');
  // Parse into file sections
  var sections=[];
  var currentSection=null;
  var i=0;
  while(i<lines.length){
    var line=lines[i];
    var m=line.match(/^diff --git a\/(.*) b\/(.*)/);
    if(m){
      if(currentSection) sections.push(currentSection);
      currentSection={file:m[1], lines:[]};
      i++; continue;
    }
    if(currentSection) currentSection.lines.push(line);
    i++;
  }
  if(currentSection) sections.push(currentSection);
  
  if(!sections.length){
    // No structured diff, show raw
    var h='';
    for(var j=0;j<lines.length;j++)
      h+=diffLine(lines[j]);
    return h;
  }
  
  var html='';
  sections.forEach(function(sec, si){
    var fileId='diff-file-'+si+'-'+commitHash.substr(0,7);
    html+='<div style="border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;overflow:hidden">';
    html+='<div style="display:flex;align-items:center;padding:8px 14px;background:#f9fafb;cursor:pointer" onclick="toggleDiffFile(\''+fileId+'\',this)">';
    html+='<span class="file-toggle" id="'+fileId+'-toggle">▶</span>';
    html+='<b style="color:#2563eb;flex:1;margin-left:8px">'+escapeHtml(sec.file)+'</b>';
    html+='<span style="font-size:11px;color:#9ca3af">'+sec.lines.length+' lines</span>';
    html+='</div>';
    html+='<div id="'+fileId+'" style="display:none">';
    for(var k=0;k<sec.lines.length;k++)
      html+=diffLine(sec.lines[k]);
    html+='</div>';
    html+='<div style="padding:4px 14px;border-top:1px solid #e5e7eb;background:#fafafa">';
    html+='<button class="btn btn-sm btn-secondary restore-file-btn" title="Restore this file to a specific commit — choose from commit history" data-file="'+escapeAttr(sec.file)+'" onclick="event.stopPropagation();openRestorePage(this.getAttribute(\'data-file\'))">📂 Restore to commit...</button>';
    html+='</div></div>';
  });
  return html;
  
  function diffLine(line){
    var s='<div style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;padding:1px 8px;';
    if(line.charAt(0)==='+')s+='background:#e6ffed;color:#059664';
    else if(line.charAt(0)==='-')s+='background:#ffeef0;color:#dc2626';
    else if(/^(@@|diff|index|commit|Author:|Date:)/.test(line))s+='color:#6b7280';
    s+='">'+escapeHtml(line)+'</div>';
    return s;
  }
}

function toggleDiffFile(id, header){
  var el=document.getElementById(id);
  var toggle=document.getElementById(id+'-toggle');
  if(el.style.display!=='none'){el.style.display='none';if(toggle)toggle.classList.remove('open');return}
  el.style.display='block';if(toggle)toggle.classList.add('open');
}

function resetFileToCommit(file, commitHash){
  showModal('Reset File','Reset <b>'+escapeHtml(file)+'</b> to commit <b>'+escapeHtml(commitHash.substr(0,7))+'</b>?<br>This will overwrite the current file!','Restore',function(){
    apiPost('/api/reset-file',{file:file,commit:commitHash},function(data){
      if(data.ok)addMsg(t('file_restored')+file,'success');
      else addMsg(t('restore_failed')+(data.error||''),'error');
    });
  });
}

// ═══════════ Restore File Page ═══════════
var _restoreFile=null;
function openRestorePage(file){
  _restoreFile=file;
  switchPage('restore');
  document.getElementById('restore-filepath').textContent=file;
  document.getElementById('restore-result').innerHTML='';
  loadRestoreCommits(1);
}

function loadRestoreCommits(page){
  page=page||1;
  document.getElementById('restore-commits-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading commit history for this file...</div>';
  document.getElementById('restore-pagination').innerHTML='';
  var perPage=20;
  apiGet('/api/file-commits?file='+encodeURIComponent(_restoreFile)+'&page='+page+'&per_page='+perPage,function(data){
    var container=document.getElementById('restore-commits-content');
    if(!data.commits||!data.commits.length){
      container.innerHTML='<div class="empty">No commit history found for this file.</div>';
      return;
    }
    var html='<table class="log-table"><thead><tr>';
    html+='<th style="width:20px"></th>';
    html+='<th>Hash</th><th>Author</th><th>Date</th><th>Message</th><th>Action</th>';
    html+='</tr></thead><tbody>';
    data.commits.forEach(function(c,idx){
      html+='<tr style="cursor:pointer" onclick="toggleRestoreDiff(\''+escapeAttr(c.hash)+'\','+idx+')">';
      html+='<td style="text-align:center"><span class="file-toggle" id="restore-toggle-'+idx+'">▶</span></td>';
      html+='<td><span class="log-hash">'+escapeHtml(c.short_hash)+'</span></td>';
      html+='<td class="log-author">'+escapeHtml(c.author)+'</td>';
      html+='<td class="log-date">'+escapeHtml(c.date)+'</td>';
      html+='<td class="log-msg" title="'+escapeAttr(c.message)+'">'+escapeHtml(c.message)+'</td>';
      html+='<td><button class="btn btn-sm btn-warning" onclick="event.stopPropagation();doRestoreFile(\''+escapeAttr(_restoreFile)+'\',\''+escapeAttr(c.hash)+'\',\''+escapeAttr(c.short_hash)+'\')">Restore to this</button></td>';
      html+='</tr>';
      html+='<tr id="restore-diff-row-'+idx+'" style="display:none"><td colspan="6" style="padding:0">';
      html+='<div id="restore-diff-'+idx+'" style="padding:12px 16px;max-height:600px;overflow-y:auto;background:#fafafa;border-top:1px solid #e5e7eb"></div>';
      html+='</td></tr>';
    });
    html+='</tbody></table>';
    container.innerHTML=html;
    var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
    var pag=document.getElementById('restore-pagination');
    if(totalPages<=1){pag.innerHTML='<span class="page-info">'+data.total+' commit(s) total</span>';return;}
    var phtml='<span class="page-info">'+data.total+' total</span>';
    for(var i=1;i<=totalPages;i++){var cl=(i===data.page)?' page-num active':' page-num';phtml+='<span class="'+cl+'" onclick="loadRestoreCommits('+i+')">'+i+'</span>';}
    pag.innerHTML=phtml;
  });
}

function toggleRestoreDiff(hash,idx){
  var row=document.getElementById('restore-diff-row-'+idx);
  var diffEl=document.getElementById('restore-diff-'+idx);
  var toggle=document.getElementById('restore-toggle-'+idx);
  if(row.style.display!=='none'){
    row.style.display='none';
    if(toggle)toggle.classList.remove('open');
    return;
  }
  row.style.display='table-row';
  if(toggle)toggle.classList.add('open');
  if(diffEl.innerHTML)return;
  diffEl.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading diff for this commit...</div>';
  apiGet('/api/file-commit-diff?commit='+encodeURIComponent(hash)+'&file='+encodeURIComponent(_restoreFile),function(data){
    if(!data.diff||!data.diff.trim()){
      diffEl.innerHTML='<div style="padding:16px;color:#6b7280;font-size:13px">No changes to this file in this commit.</div>';
      return;
    }
    diffEl.innerHTML='<div class="diff-block">'+highlightDiff(data.diff)+'</div>';
  });
}

function doRestoreFile(file,hash,shortHash){
  showModal('Restore File',
    'Restore <b>'+escapeHtml(file)+'</b> to commit <b>'+escapeHtml(shortHash)+'</b>?<br><span style="color:#dc2626;font-size:13px">⚠️ This will overwrite your current working copy of this file.</span>',
    'Restore',function(){
    apiPost('/api/reset-file',{file:file,commit:hash},function(data){
      var res=document.getElementById('restore-result');
      if(data.ok){
        res.innerHTML='<span class="restore-status ok">✓ Restored to '+escapeHtml(shortHash)+'</span>';
        showToast('File restored to '+shortHash,'ok',3000);
        addMsg(t('file_restored')+file+' → '+shortHash,'success');
      }else{
        res.innerHTML='<span class="restore-status err">✗ Restore failed: '+escapeHtml(data.error||'unknown error')+'</span>';
        showToast('Restore failed','err',3000);
        addMsg(t('restore_failed')+(data.error||''),'error');
      }
    });
  });
}

// ═══════════ Branch Search ═══════════

function onBranchSearchInput(){
  var search=document.getElementById('branch-search').value;
  document.getElementById('branch-search-clear').style.display=search?'inline-block':'none';
  clearTimeout(_branchSearchTimer);
  _branchSearchTimer=setTimeout(function(){
    if(!search.trim()){
      _allBranchesCache=null;
      loadBranches(1);
      return;
    }
    if(_allBranchesCache){
      _renderFilteredBranches(search.trim().toLowerCase());
    }else{
      document.getElementById('branches-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading all branches...</div>';
      apiGet('/api/branches?page=1&per_page=0',function(data){
        _allBranchesCache=data;
        _renderFilteredBranches(search.trim().toLowerCase());
      });
    }
  },200);
}

function _renderFilteredBranches(search){
  var data=_allBranchesCache;
  var allBranches=[];
  (data.local||[]).forEach(function(b){allBranches.push({name:b.name,date:b.date,ts:b.ts,type:'local'})});
  (data.remote||[]).forEach(function(b){allBranches.push({name:b.name,date:b.date,ts:b.ts,type:'remote'})});
  var filtered=allBranches.filter(function(b){return b.name.indexOf(search)>=0});
  filtered=_sortBranches(filtered);
  var container=document.getElementById('branches-content');
  if(!filtered.length){
    container.innerHTML='<div class="empty">No branches matching "'+escapeHtml(search)+'"</div>';
    document.getElementById('branches-pagination').innerHTML='<span class="page-info">0 results</span>';
    return;
  }
  var html=_branchSortHeader();
  html+='<div class="branch-list"><h3>Results for "'+escapeHtml(search)+'" ('+filtered.length+')</h3>';
  filtered.forEach(function(b){
    var isCur=b.name===data.current;
    var cls=isCur?' branch-item current':' branch-item';
    html+='<div class="'+cls+'">';
    html+='<span style="font-size:11px;padding:1px 6px;border-radius:99px;margin-right:6px;background:'+(b.type==='local'?'#dbeafe':'#e0f2fe')+';color:'+(b.type==='local'?'#1e40af':'#0369a1')+'">'+b.type+'</span>';
    html+='<span class="name">'+_highlightBranchMatch(escapeHtml(b.name),search)+(isCur?' (current)':'')+'</span>';
    html+='<span style="font-size:12px;color:#9ca3af;margin-left:auto;margin-right:12px;white-space:nowrap">'+escapeHtml(b.date||'')+'</span>';
    if(!isCur)html+='<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();checkoutBranch(\''+escapeAttr(b.name)+'\')">Checkout</button>';
    html+='</div>';
  });
  html+='</div>';
  container.innerHTML=html;
  document.getElementById('branches-pagination').innerHTML='<span class="page-info">'+filtered.length+' match(es) for "'+escapeHtml(search)+'"</span>';
}

function _highlightBranchMatch(escaped,search){
  var lower=escaped.toLowerCase();
  var idx=lower.indexOf(search);
  if(idx<0)return escaped;
  return escaped.substr(0,idx)+'<mark>'+escaped.substr(idx,search.length)+'</mark>'+escaped.substr(idx+search.length);
}

function setBranchSearchTag(tag){
  var inp=document.getElementById('branch-search');
  inp.value=tag;
  document.getElementById('branch-search-clear').style.display='inline-block';
  _allBranchesCache=null;
  onBranchSearchInput();
}

function clearBranchSearch(){
  document.getElementById('branch-search').value='';
  document.getElementById('branch-search-clear').style.display='none';
  _allBranchesCache=null;
  loadBranches(1);
}

var _diffSearchTimer=null;
var _inDiffSearchMode=false;
function filterCommitDiffs(){
  var search=document.getElementById('log-code-search').value.trim();
  clearTimeout(_diffSearchTimer);
  if(!search){
    // Only restore normal view if we were previously in diff-search mode
    if(_inDiffSearchMode){
      _inDiffSearchMode=false;
      if(currentLogData){renderLog(currentLogData);renderPagination(currentLogData);}
    }
    return;
  }
  _diffSearchTimer=setTimeout(function(){
    _inDiffSearchMode=true;
    document.getElementById('log-content').innerHTML='<div class="loading-bar"><span class="spinner"></span>Searching diffs for "'+escapeHtml(search)+'"...</div>';
    document.getElementById('log-pagination').innerHTML='';
    apiGet('/api/search-diff?pattern='+encodeURIComponent(search),function(data){
      if(data.error){addMsg('Diff search error: '+escapeHtml(data.error),'error');return;}
      var fakeData={commits:data.commits,total:data.total,page:1,per_page:data.total||1};
      renderLog(fakeData);
      var pag=document.getElementById('log-pagination');
      if(data.total===0){
        pag.innerHTML='<span class="page-info">No results for "'+escapeHtml(search)+'"</span>';
        showToast('No diff matches found','err',2500);
      }else{
        pag.innerHTML='<span class="page-info">Diff search: <b>'+data.total+'</b> commit(s) matched "'+escapeHtml(search)+'"</span>';
        showToast('Found '+data.total+' commit(s) matching diff','ok',2500);
      }
    });
  },400);
}

function updateSquashBar(){
  var bar=document.getElementById('squash-bar');
  bar.style.display=Object.keys(squashSelected).length>=2?'flex':'none';
}
function toggleHash(el){
  var full = el.getAttribute('data-full');
  var cur = el.textContent;
  if (cur.length > 10) el.textContent = full.substr(0,7);
  else el.textContent = full;
}
function toggleSquashSelect(cb){
  if(cb.disabled)return;
  var hash=cb.dataset.hash;
  if(cb.checked)squashSelected[hash]=true;else delete squashSelected[hash];
  updateSquashBar();
}
function cancelSquash(){squashSelected={};updateSquashBar();document.getElementById('squash-msg').value='';if(currentLogData)renderLog(currentLogData)}
// ═══════════ Protected Branch Guard ═══════════
var _PROTECTED_BRANCHES = ['develop','release','main','master'];
function _isProtectedBranch(name){
  if(!name) return false;
  var n = name.trim().toLowerCase();
  return _PROTECTED_BRANCHES.some(function(p){ return n === p || n.indexOf(p) === 0 || n.indexOf('/'+p) >= 0; });
}
function _warnProtectedThenDo(actionKey, callback){
  var branchEl = document.getElementById('branch-name');
  var branch = branchEl ? branchEl.textContent.trim() : '';
  if(!_isProtectedBranch(branch)){ callback(); return; }
  var msgHtml = tf(actionKey, L, {branch: escapeHtml(branch)});
  // Show modal with red-tinted warning styling
  var title = t('protected_branch_title');
  var bg = document.getElementById('modal-bg');
  var box = bg ? bg.querySelector('.modal-box') : null;
  showModal(title, msgHtml, t('proceed_anyway'), function(){
    callback();
  });
  // Tint the modal header red to signal danger
  if(box){
    var h3 = box.querySelector('h3');
    if(h3){ h3.style.color='#dc2626'; h3.style.background='#fef2f2'; h3.style.padding='12px 20px'; h3.style.margin='-20px -20px 16px'; h3.style.borderRadius='12px 12px 0 0'; h3.style.borderBottom='2px solid #fca5a5'; }
    var confirmBtn = box.querySelector('.modal-confirm');
    if(confirmBtn){ confirmBtn.style.background='#dc2626'; confirmBtn.style.borderColor='#b91c1c'; }
  }
}

function doSquash(){
  var keys=Object.keys(squashSelected);
  if(keys.length<2){addMsg(t('select_2_commits'),'error');return}
  var msg=document.getElementById('squash-msg').value.trim();
  if(!msg){addMsg(t('enter_squash_msg'),'error');return}
  var hashes=[];
  if(currentLogData&&currentLogData.commits){currentLogData.commits.forEach(function(c){if(squashSelected[c.hash])hashes.push(c.hash)})}
  if(hashes.length<2)return;
  var fromHash=hashes[hashes.length-1],toHash=hashes[0];
  _warnProtectedThenDo('protected_branch_squash', function(){
    showModal('Squash',tf('squash_confirm',L,{n:hashes.length})+'<br>From: '+fromHash.substr(0,7)+' To: '+toHash.substr(0,7),'Squash',function(){
      apiPost('/api/squash',{from:fromHash,to:toHash,message:msg},function(data){
        if(data.ok){
          squashSelected={};loadLog(1);loadFiles();
          // Squash rewrites history — offer force push immediately
          doForcePush();
        }
        else addMsg(t('squash_fail')+(data.error||''),'error');
      });
    });
  });
}

function renderPagination(data){
  var pag=document.getElementById('log-pagination');
  var totalPages=data.per_page>0?Math.ceil(data.total/data.per_page):1;
  if(totalPages<=1){pag.innerHTML='';return}
  var html='<span class="page-info">Total '+data.total+'</span>';
  for(var i=1;i<=totalPages;i++){var cls=(i===data.page)?' page-num active':' page-num';html+='<span class="'+cls+'" onclick="loadLog('+i+')">'+i+'</span>'}
  pag.innerHTML=html;
}

function showResetModal(hash,shortHash){
  showModalDouble('Reset to '+shortHash,t('reset_desc'),t('reset_soft'),function(){doReset(hash,'soft')},t('reset_hard'),function(){doReset(hash,'hard')});
}
function showRevertModal(hash,shortHash){
  showModal('Revert '+shortHash,t('revert_desc'),'Revert',function(){
    apiPost('/api/revert',{commit:hash},function(data){
      if(data.ok){addMsg(t('revert_ok'),'success');loadLog(1);loadFiles()}
      else addMsg(t('revert_fail')+(data.error||''),'error');
    });
  });
}
function doReset(hash,mode){
  apiPost('/api/reset',{commit:hash,mode:mode},function(data){
    if(data.ok){addMsg(tf('reset_ok',L,{mode:mode}),'success');loadLog(1);loadFiles();loadCurrentBranch()}
    else addMsg(t('reset_fail')+(data.error||''),'error');
  });
}
function abortMerge(){
  showModal(t('conflict_reset_title'),t('conflict_reset_desc'),'Reset',function(){
    apiPost('/api/abort',{},function(data){
      if(data.ok){addMsg(t('conflict_reset_ok'),'success');loadFiles();checkConflicts();loadLog(1)}
      else addMsg(t('no_conflict_abort')+(data.error||''),'info');
    });
  });
}

function showModalDouble(title,msg,btn1Label,btn1Cb,btn2Label,btn2Cb,btn1Class,btn2Class){
  document.getElementById('modal-title').innerHTML=title;
  document.getElementById('modal-msg').innerHTML=msg;
  var btnsDiv=document.getElementById('modal-btns');
  btnsDiv.innerHTML='';
  var b1=document.createElement('button');b1.className='btn '+(btn1Class||'btn-warning');b1.textContent=btn1Label;b1.onclick=function(){var c=btn1Cb;closeModal();if(c)c()};
  var b2=document.createElement('button');b2.className='btn '+(btn2Class||'btn-secondary');b2.textContent=btn2Label;b2.onclick=function(){var c=btn2Cb;closeModal();if(c)c()};
  btnsDiv.appendChild(b2);btnsDiv.appendChild(b1);
  document.getElementById('modal-bg').classList.add('show');
}

// ═══════════ Conflicts page ═══════════
// conflict state: conflictChoices[filePath] = array of {type:'ours'|'theirs'|'manual'|null, content:string}, indexed by conflict block order
var conflictChoices = {};
var _conflictData = {}; // filePath -> {blocks, raw}

function loadConflicts(){
  switchPage('conflicts');
  apiGet('/api/conflicts',function(data){
    if(data.count===0){document.getElementById('conflicts-content').innerHTML='<div class="empty">🎉 '+t('no_conflict')+'</div>';return}
    var html='';
    for(var i=0;i<data.files.length;i++){
      var fp=data.files[i];
      var extCls=expandedPaths[fp]?' expanded':'';
      var toggleCls=expandedPaths[fp]?' file-toggle open':' file-toggle';
      html+='<div class="conflict-file" id="cf-file-'+i+'">';
      html+='<div class="conflict-header" onclick="toggleConflict(\''+escapeAttr(fp)+'\','+i+')">';
      html+='<span class="'+toggleCls+'" id="cf-toggle-'+i+'">▶</span>';
      html+='<span class="conflict-path">'+escapeHtml(fp)+'</span>';
      if(resolvedConflicts[fp])html+='<span class="resolved-tag">✓ Resolved</span>';
      html+='</div>';
      html+='<div class="conflict-content'+extCls+'" id="conflict-body-'+i+'">';
      html+='<div id="conflict-detail-'+i+'">Click to expand</div>';
      html+='</div></div>';
    }
    document.getElementById('conflicts-content').innerHTML=html;
    // auto-expand first file
    if(data.files.length>0 && !expandedPaths[data.files[0]]) toggleConflict(data.files[0],0);
  });
}

function toggleConflict(filePath,idx){
  var body=document.getElementById('conflict-body-'+idx);
  var tog=document.getElementById('cf-toggle-'+idx);
  if(body.classList.contains('expanded')){
    body.classList.remove('expanded');
    if(tog)tog.classList.remove('open');
    delete expandedPaths[filePath];
    return;
  }
  body.classList.add('expanded');
  if(tog)tog.classList.add('open');
  expandedPaths[filePath]=true;
  var detail=document.getElementById('conflict-detail-'+idx);
  detail.innerHTML='<div class="loading-bar"><span class="spinner"></span>Loading conflict...</div>';
  apiPost('/api/conflict-detail',{path:filePath},function(data){
    _conflictData[filePath]=data;
    if(!conflictChoices[filePath]){
      // init choices array with nulls for each conflict block
      var numConflicts=0;
      for(var b=0;b<(data.blocks||[]).length;b++) if(data.blocks[b].type==='conflict') numConflicts++;
      conflictChoices[filePath]=new Array(numConflicts).fill(null).map(function(){return{type:null,content:''};});
    }
    renderConflictDetail(filePath, idx, data);
  });
}

function renderConflictDetail(filePath, fileIdx, data){
  var detail=document.getElementById('conflict-detail-'+fileIdx);
  var blocks=data.blocks||[];
  var conflictCount=0;
  for(var b=0;b<blocks.length;b++) if(blocks[b].type==='conflict') conflictCount++;

  var html='';
  // Jump bar
  if(conflictCount>0){
    html+='<div class="conflict-jump-bar">';
    html+='<span class="jump-label">⚠️ '+conflictCount+' conflict'+(conflictCount>1?'s':'')+' in this file</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="jumpToConflict(\''+escapeAttr(filePath)+'\','+fileIdx+',\'prev\')">◀ Prev</button>';
    html+='<span id="cf-nav-'+fileIdx+'" style="font-size:12px;color:#6b7280">1/'+conflictCount+'</span>';
    html+='<button class="btn btn-sm btn-secondary" onclick="jumpToConflict(\''+escapeAttr(filePath)+'\','+fileIdx+',\'next\')">Next ▶</button>';
    html+='</div>';
  }

  var conflictIdx=0;
  for(var b=0;b<blocks.length;b++){
    var block=blocks[b];
    if(block.type==='normal'){
      var lines=block.lines||[];
      var preview=lines.slice(0,2).join('\n');
      html+='<div class="conflict-block-normal">';
      html+='<div class="conflict-block-normal-header" onclick="toggleNormalBlock(this)">▶ '+escapeHtml(lines.length)+' lines of context  <span style="opacity:0.6;font-size:11px">(click to expand)</span></div>';
      html+='<div class="conflict-block-normal-body">'+escapeHtml(lines.join('\n'))+'</div>';
      html+='</div>';
    } else {
      var ci=conflictIdx;
      var choice=conflictChoices[filePath]&&conflictChoices[filePath][ci];
      var resolvedCls='';
      var statusHtml='<span class="conflict-zone-status">Not resolved</span>';
      if(choice&&choice.type==='ours'){resolvedCls=' resolved-ours';statusHtml='<span class="conflict-zone-status chosen-ours">✅ Using Ours</span>';}
      else if(choice&&choice.type==='theirs'){resolvedCls=' resolved-theirs';statusHtml='<span class="conflict-zone-status chosen-theirs">🔵 Using Theirs</span>';}
      else if(choice&&choice.type==='manual'){resolvedCls=' resolved-manual';statusHtml='<span class="conflict-zone-status" style="color:#7c3aed;font-weight:600">✏️ Manual edit</span>';}

      html+='<div class="conflict-zone'+resolvedCls+'" id="cf-block-'+fileIdx+'-'+ci+'">';
      html+='<div class="conflict-zone-header">';
      html+='<span class="conflict-zone-num">CONFLICT #'+(ci+1)+'</span>';
      html+=statusHtml;
      html+='</div>';
      html+='<div class="conflict-sides">';
      html+='<div class="conflict-side conflict-side-ours"><h4>⬅ Ours (current branch)</h4><pre>'+escapeHtml(block.ours||'(empty)')+'</pre></div>';
      html+='<div class="conflict-side conflict-side-theirs"><h4>Remote (theirs) ➡</h4><pre>'+escapeHtml(block.theirs||'(empty)')+'</pre></div>';
      html+='</div>';
      html+='<div class="conflict-zone-actions">';
      html+='<button class="btn btn-sm btn-success" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'ours\')">✅ Use Ours</button>';
      html+='<button class="btn btn-sm btn-primary" onclick="chooseConflict(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+',\'theirs\')">🔵 Use Theirs</button>';
      html+='<button class="btn btn-sm btn-secondary" onclick="openManualEdit(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+')">✏️ Edit manually</button>';
      html+='</div>';
      html+='<div id="cf-manual-'+fileIdx+'-'+ci+'" style="display:none;padding:10px 14px;border-top:1px solid #e5e7eb;">';
      var initContent=(choice&&choice.type==='manual')?choice.content:(block.ours||'');
      html+='<textarea id="cf-editor-'+fileIdx+'-'+ci+'" style="width:100%;min-height:120px;font-family:monospace;font-size:12px;border:1px solid #d1d5db;border-radius:6px;padding:8px;resize:vertical">'+escapeHtml(initContent)+'</textarea>';
      html+='<button class="btn btn-sm btn-warning" style="margin-top:6px" onclick="saveManualBlock(\''+escapeAttr(filePath)+'\','+fileIdx+','+ci+')">Save this block</button>';
      html+='</div>';
      html+='</div>';
      conflictIdx++;
    }
  }

  // Bottom resolve bar
  html+='<div class="conflict-resolve-all">';
  html+='<button class="btn btn-success" onclick="resolveAllBlocks(\''+escapeAttr(filePath)+'\','+fileIdx+')">💾 Save &amp; Resolve File</button>';
  html+='<button class="btn btn-sm btn-secondary" onclick="showRawEdit(\''+escapeAttr(filePath)+'\','+fileIdx+')">📝 Edit raw file</button>';
  html+='<div id="cf-raw-'+fileIdx+'" style="display:none;width:100%;margin-top:10px">';
  html+='<textarea id="cf-raw-editor-'+fileIdx+'" style="width:100%;min-height:200px;font-family:monospace;font-size:12px;border:1px solid #d1d5db;border-radius:6px;padding:8px;resize:vertical">'+escapeHtml(data.raw||'')+'</textarea>';
  html+='<button class="btn btn-success btn-sm" style="margin-top:6px" onclick="resolveConflictCustom(\''+escapeAttr(filePath)+'\','+fileIdx+')">Save raw &amp; Resolve</button>';
  html+='</div></div>';

  detail.innerHTML=html;
  window._cfCurrentConflict=window._cfCurrentConflict||{};
  window._cfCurrentConflict[fileIdx]=0;
}

function toggleNormalBlock(header){
  var body=header.nextElementSibling;
  if(body.classList.contains('open')){body.classList.remove('open');header.innerHTML=header.innerHTML.replace('▼','▶');}
  else{body.classList.add('open');header.innerHTML=header.innerHTML.replace('▶','▼');}
}

function chooseConflict(filePath, fileIdx, ci, side){
  if(!conflictChoices[filePath]) return;
  var block=_conflictData[filePath].blocks.filter(function(b){return b.type==='conflict'})[ci];
  conflictChoices[filePath][ci]={type:side,content:side==='ours'?(block.ours||''):(block.theirs||'')};
  renderConflictDetail(filePath, fileIdx, _conflictData[filePath]);
  // scroll back to this conflict block
  var el=document.getElementById('cf-block-'+fileIdx+'-'+ci);
  if(el) el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function openManualEdit(filePath, fileIdx, ci){
  var box=document.getElementById('cf-manual-'+fileIdx+'-'+ci);
  if(box) box.style.display=box.style.display==='none'?'block':'none';
}

function saveManualBlock(filePath, fileIdx, ci){
  var ta=document.getElementById('cf-editor-'+fileIdx+'-'+ci);
  if(!ta) return;
  if(!conflictChoices[filePath]) return;
  conflictChoices[filePath][ci]={type:'manual',content:ta.value};
  renderConflictDetail(filePath, fileIdx, _conflictData[filePath]);
  var el=document.getElementById('cf-block-'+fileIdx+'-'+ci);
  if(el) el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function resolveAllBlocks(filePath, fileIdx){
  var choices=conflictChoices[filePath]||[];
  var blocks=(_conflictData[filePath]||{}).blocks||[];
  var ci=0; var out=[];
  var allResolved=true;
  for(var b=0;b<blocks.length;b++){
    var block=blocks[b];
    if(block.type==='normal'){
      out.push((block.lines||[]).join('\n'));
    } else {
      var choice=choices[ci];
      if(!choice||!choice.type){allResolved=false;break;}
      out.push(choice.content);
      ci++;
    }
  }
  if(!allResolved){
    addMsg('⚠️ Please resolve all '+choices.length+' conflicts before saving','error');
    // scroll to first unresolved
    for(var i=0;i<choices.length;i++){
      if(!choices[i]||!choices[i].type){
        var el=document.getElementById('cf-block-'+fileIdx+'-'+i);
        if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
        break;
      }
    }
    return;
  }
  var content=out.join('\n');
  apiPost('/api/resolve-conflict',{path:filePath,content:content},function(data){
    if(data.ok){resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved_ok'),'success');loadConflicts();checkConflicts();loadFiles();}
    else addMsg(t('op_failed_err')+(data.error||''),'error');
  });
}

function showRawEdit(filePath, fileIdx){
  var box=document.getElementById('cf-raw-'+fileIdx);
  if(box) box.style.display=box.style.display==='none'?'block':'none';
}

function jumpToConflict(filePath, fileIdx, dir){
  var choices=conflictChoices[filePath]||[];
  var total=choices.length;
  if(total===0) return;
  if(!window._cfCurrentConflict) window._cfCurrentConflict={};
  var cur=window._cfCurrentConflict[fileIdx]||0;
  if(dir==='next') cur=(cur+1)%total;
  else cur=(cur-1+total)%total;
  window._cfCurrentConflict[fileIdx]=cur;
  var nav=document.getElementById('cf-nav-'+fileIdx);
  if(nav) nav.textContent=(cur+1)+'/'+total;
  var el=document.getElementById('cf-block-'+fileIdx+'-'+cur);
  if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
}

function showEditConflict(idx){document.getElementById('conflict-edit-'+idx) && (document.getElementById('conflict-edit-'+idx).style.display='block')}
function resolveConflict(filePath,resolution,idx){apiPost('/api/resolve-conflict',{path:filePath,resolution:resolution},function(data){if(data.ok){resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved')+resolution,'success');loadConflicts();checkConflicts();loadFiles()}else addMsg(t('op_failed_err')+(data.error||''),'error')})}
function resolveConflictCustom(filePath,fileIdx){
  var ta=document.getElementById('cf-raw-editor-'+fileIdx);
  if(!ta) return;
  apiPost('/api/resolve-conflict',{path:filePath,content:ta.value},function(data){
    if(data.ok){resolvedConflicts[filePath]=true;addMsg(t('conflict_resolved_ok'),'success');loadConflicts();checkConflicts();loadFiles();}
    else addMsg(t('op_failed_err')+(data.error||''),'error');
  });
}

// ═══════════ Click delegate ═══════════
document.addEventListener('click',function(e){
  // Restore file button (delegated)
  var restoreBtn = e.target.closest && e.target.closest('.restore-file-btn');
  if (restoreBtn) {
    e.stopPropagation();
    var file = restoreBtn.getAttribute('data-file');
    openRestorePage(file);
    return;
  }
  
  var cb=e.target.closest&&e.target.closest('.file-cb');
  if(cb){
    e.stopPropagation();
    var path=cb.dataset.path,checked=cb.checked;
    var action=checked?'add':'reset';
    apiPost('/api/toggle',{path:path,action:action},function(data){
      if(data.ok){checkedPaths[path]=checked;addMsg(checked?t('git_added'):t('git_reset'),'success')}
      else{cb.checked=!checked;addMsg(t('op_failed')+': '+(data.error||''),'error')}
    });
    return;
  }
  var header=e.target.closest&&e.target.closest('.file-header');
  if(header){
    var card=header.closest('.file-card');
    if(!card)return;
    var body=card.querySelector('.file-body'),toggle=header.querySelector('.file-toggle');
    if(!body||!toggle)return;
    var path=body.dataset?body.dataset.path:'';
    var isExpanded=body.classList.contains('expanded');
    if(isExpanded){body.classList.remove('expanded');toggle.classList.remove('open');if(path)delete expandedPaths[path]}
    else{body.classList.add('expanded');toggle.classList.add('open');if(path)expandedPaths[path]=true}
    return;
  }
});

// ═══════════ Select All ═══════════
document.getElementById('select-all-cb').addEventListener('change',function(){
  var selectAll=this.checked;
  var allCbs=document.querySelectorAll('.file-cb');
  var done=0,total=allCbs.length,failed=false;
  if(!total)return;
  function finalize(){if(!failed)addMsg(selectAll?t('all_selected'):t('all_deselected'),'success');else addMsg(t('partial_fail'),'error');loadFiles()}
  for(var i=0;i<allCbs.length;i++){
    (function(cb,path){
      var action=selectAll?'add':'reset';
      if(selectAll)checkedPaths[path]=true;else delete checkedPaths[path];
      apiPost('/api/toggle',{path:path,action:action},function(data){if(!data.ok)failed=true;done++;if(done===total)finalize()});
    })(allCbs[i],allCbs[i].dataset.path);
  }
});

// ═══════════ Commit ═══════════
document.getElementById('commit-btn').addEventListener('click',function(){
  var msg=document.getElementById('msg-input').value.trim();
  if(!msg){addMsg(t('commit_msg_empty'),'error');return}
  var cbs=document.querySelectorAll('.file-cb:checked'),paths=[];
  for(var i=0;i<cbs.length;i++)paths.push(cbs[i].dataset.path);
  if(!paths.length){addMsg(t('select_at_least_one'),'error');return}
  _warnProtectedThenDo('protected_branch_commit', function(){
    showModal(t('confirm_commit_title'),
      'Commit message: <b>'+escapeHtml(msg)+'</b><br><br>Files:<br>'+paths.map(escapeHtml).join('<br>'),
      'Confirm Commit',
      function(){
      addMsg(t('stashing_pulling'),'info');
      apiPost('/api/stash',{},function(stashData){
        if(!stashData.ok){addMsg(t('stash_failed')+(stashData.error||''),'error');return}
        apiPost('/api/pull',{mode:'merge'},function(pullData){
          if(!pullData.ok){
            addMsg(t('pull_fail')+(pullData.error||''),'error');
            checkConflicts();
            apiPost('/api/stash-pop',{index:0},function(){loadFiles()});
            return;
          }
          addMsg(t('pull_ok_pop'),'info');
          apiPost('/api/stash-pop',{index:0},function(popData){
            if(!popData.ok){
              addMsg(t('stash_conflict'),'error');
              checkConflicts();
              loadFiles();
              return;
            }
            loadFiles();
            apiPost('/api/commit',{message:msg,paths:paths},function(data){
              if(data.ok){
                addMsg(t('commit_ok')+': '+(data.stdout||''),'success');
                document.getElementById('msg-input').value='';checkedPaths={};expandedPaths={};loadFiles();
                var branchName=document.getElementById('branch-name').textContent||'';
                setTimeout(function(){
                  showModalDouble(
                    '🚀 Push to remote?',
                    'Commit successful!<br><br>Do you want to push to <b>origin/'+escapeHtml(branchName)+'</b> now?',
                    'Push Now',
                    function(){ doPush(); },
                    'Skip (Local Only)',
                    null,
                    'btn-success',
                    'btn-secondary'
                  );
                }, 300);
              }else addMsg(t('commit_fail')+': '+(data.error||''),'error');
            });
          });
        });
      });
    }); // close showModal
  }); // end _warnProtectedThenDo
}); // close addEventListener

// ═══════════ Reset all ═══════════
document.getElementById('reset-btn').addEventListener('click',function(){
  var allCbs=document.querySelectorAll('.file-cb'),failed=false,done=0;
  for(var i=0;i<allCbs.length;i++){
    apiPost('/api/toggle',{path:allCbs[i].dataset.path,action:'reset'},function(data){if(!data.ok)failed=true;done++;if(done===allCbs.length){checkedPaths={};if(!failed){addMsg(t('all_deselected'),'success');loadFiles()}else addMsg(t('partial_fail'),'error')}});
  }
});

// ═══════════ Init ═══════════
loadCurrentBranch();
loadFiles();
checkConflicts();

// Position tooltips using fixed coords to avoid overflow clipping
document.querySelectorAll('.git-action-btn').forEach(function(btn){
  var tip=btn.querySelector('.git-action-desc');
  if(!tip)return;
  btn.addEventListener('mouseenter',function(){
    var r=btn.getBoundingClientRect();
    tip.style.left=(r.left+r.width/2)+'px';
    tip.style.top=(r.bottom+6)+'px';
    tip.style.transform='translateX(-50%)';
  });
});
</script>

</body>
</html>"""


# ═══════════════════════════════════════════════════════════════
# HTTP Handler
# ═══════════════════════════════════════════════════════════════

class Handler(BaseHTTPRequestHandler):
    def log_message(self,fmt,*args): pass

    def _json(self,data,code=200):
        body=json.dumps(data,ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type","application/json")
        self.send_header("Content-Length",str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path=="/api/files":
            self._json({"files":get_uncommitted_changes()})
        elif path=="/api/current-branch":
            self._json({"branch":display_branch()})
        elif path=="/api/branches":
            qs=parse_qs(parsed.query) if parsed.query else {}
            page=int(qs.get("page",["1"])[0])
            per_page=int(qs.get("per_page",["20"])[0])
            self._json(get_branches(page,per_page))
        elif path=="/api/has-uncommitted":
            self._json({"hasChanges":has_uncommitted()})
        elif path=="/api/unpushed-count":
            out,_,rc=_run(["git","rev-list","--count","@{u}..HEAD"])
            count=int(out.strip()) if rc==0 and out.strip().isdigit() else 0
            self._json({"count":count})
        elif path=="/api/stash-list":
            qs=parse_qs(parsed.query) if parsed.query else {}
            page=int(qs.get("page",["1"])[0])
            per_page=int(qs.get("per_page",["10"])[0])
            self._json(stash_list(page,per_page))
        elif path=="/api/stash-diff":
            qs=parse_qs(parsed.query) if parsed.query else {}
            idx=qs.get("index",["0"])[0]
            self._json({"diff":stash_diff(idx)})
        elif path=="/api/commit-diff":
            qs=parse_qs(parsed.query) if parsed.query else {}
            commit=qs.get("commit",[""])[0]
            self._json({"diff":commit_diff(commit)})
        elif path=="/api/file-commit-diff":
            qs=parse_qs(parsed.query) if parsed.query else {}
            commit=qs.get("commit",[""])[0]
            file_path=qs.get("file",[""])[0]
            self._json({"diff":file_commit_diff(commit,file_path)})
        elif path=="/api/conflicts":
            cf=get_conflicts()
            self._json({"files":cf,"count":len(cf)})
        elif path=="/api/commits":
            qs=parse_qs(parsed.query) if parsed.query else {}
            page=int(qs.get("page",["1"])[0])
            per_page=int(qs.get("per_page",["10"])[0])
            search=qs.get("search",[""])[0]
            order=qs.get("order",["desc"])[0]
            self._json(get_commit_log(page,per_page,search,order))
        elif path=="/api/search-diff":
            qs=parse_qs(parsed.query) if parsed.query else {}
            pattern=qs.get("pattern",[""])[0]
            max_count=int(qs.get("max_count",["200"])[0])
            self._json(search_diff_code(pattern,max_count))
        elif path=="/api/file-commits":
            qs=parse_qs(parsed.query) if parsed.query else {}
            file_path=qs.get("file",[""])[0]
            page=int(qs.get("page",["1"])[0])
            per_page=int(qs.get("per_page",["20"])[0])
            self._json(get_file_commits(file_path,page,per_page))
        elif path=="/api/push-status":
            qs=parse_qs(parsed.query) if parsed.query else {}
            job_id=qs.get("jobId",[""])[0]
            job=_PUSH_JOBS.get(job_id)
            if not job:
                self._json({"error":"Job not found"},404)
            else:
                self._json(dict(job))
        else:
            html_bytes=get_html_bytes()
            self.send_response(200)
            self.send_header("Content-Type","text/html; charset=utf-8")
            self.send_header("Content-Length",str(len(html_bytes)))
            self.end_headers()
            self.wfile.write(html_bytes)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get("Content-Length",0))
        body = self.rfile.read(content_len) if content_len else b""
        try: data=json.loads(body) if body else {}
        except json.JSONDecodeError: self._json({"ok":False,"error":"Invalid JSON"},400); return

        if path=="/api/toggle":
            fp=data.get("path",""); action=data.get("action")
            fn = (lambda p: _run(["git","add",p])[0:3]) if action=="add" else (lambda p: _run(["git","reset","--",p])[0:3])
            stdout,stderr,rc = fn(fp)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or "failed"},400)

        elif path=="/api/ignore":
            fp=data.get("path","")
            # 先检查是否被 git 跟踪
            tracked_out,_,_ = _run(["git","ls-files","--",fp])
            if tracked_out:
                # 已跟踪：reset + checkout 恢复
                _run(["git","reset","HEAD","--",fp])
                stdout,stderr,rc = _run(["git","checkout","--",fp])
            else:
                # 未跟踪：直接删除文件
                import os
                try: os.remove(fp); rc=0; stdout="deleted"; stderr=""
                except OSError as e: rc=1; stderr=str(e); stdout=""
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or "failed"},400)

        elif path=="/api/commit":
            msg=data.get("message",""); paths=data.get("paths",[])
            if not msg: self._json({"ok":False,"error":"empty msg"},400); return
            if not paths: self._json({"ok":False,"error":"no files"},400); return
            for p in paths: _run(["git","add",p])
            stdout,stderr,rc=_run(["git","commit","-m",msg])
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)

        elif path=="/api/checkout":
            branch=data.get("branch","")
            stdout,stderr,rc=checkout_branch(branch)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)

        elif path=="/api/create-branch":
            name=data.get("name",""); base=data.get("base","")
            stdout,stderr,rc=create_branch(name,base if base else None)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)

        elif path=="/api/stash":
            stdout,stderr,rc=stash_changes()
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or "failed"},400)
        elif path=="/api/stash-pop":
            idx=str(data.get("index",0))
            stdout,stderr,rc=stash_pop(idx)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or "failed"},400)
        elif path=="/api/stash-drop":
            idx=str(data.get("index",0))
            stdout,stderr,rc=stash_drop(idx)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or "failed"},400)

        elif path=="/api/pull":
            mode = data.get("mode","merge")
            log,stderr,rc=pull_current(mode)
            if rc==0: self._json({"ok":True,"log":log})
            else: self._json({"ok":False,"error":stderr or log,"log":log},400)
        elif path=="/api/fetch":
            log,stderr,rc=fetch()
            if rc==0: self._json({"ok":True,"log":log})
            else: self._json({"ok":False,"error":stderr or log,"log":log},400)
        elif path=="/api/set-upstream":
            stdout,stderr,rc=set_upstream()
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        elif path=="/api/push-upstream":
            stdout,stderr,rc=push_set_upstream()
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        elif path=="/api/push":
            import uuid, threading, tempfile, stat as _stat, os as _os2
            branch = current_branch()
            username = data.get("username","").strip()
            password = data.get("password","").strip()
            force = bool(data.get("force", False))
            job_id = str(uuid.uuid4())[:8]
            _PUSH_JOBS[job_id] = {'lines': [], 'done': False, 'ok': False, 'error': '', 'authRequired': False}
            extra_env = None
            tmp_file = None
            if username and password:
                script = f'#!/bin/sh\ncase "$1" in\n  *Username*) echo "{username}";;\n  *Password*) echo "{password}";;\nesac\n'
                with tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False) as f:
                    f.write(script); tmp_file = f.name
                _os2.chmod(tmp_file, _stat.S_IRWXU)
                extra_env = {"GIT_ASKPASS": tmp_file, "GIT_TERMINAL_PROMPT": "0"}
            def _job():
                try:
                    _run_push_streaming(job_id, branch, extra_env, force=force)
                finally:
                    if tmp_file:
                        try: _os2.unlink(tmp_file)
                        except: pass
            threading.Thread(target=_job, daemon=True).start()
            self._json({"ok": True, "jobId": job_id})
        elif path=="/api/reset-file":
            fp=data.get("file",""); commit=data.get("commit","")
            stdout,stderr,rc=_run(["git","checkout",commit,"--",fp])
            self._json({"ok":True} if rc==0 else {"ok":False,"error":stderr or stdout},400)

        elif path=="/api/conflict-detail":
            fp=data.get("path","")
            self._json(get_conflict_detail(fp))
        elif path=="/api/resolve-conflict":
            fp=data.get("path",""); resolution=data.get("resolution"); content=data.get("content")
            if resolution: stdout,stderr,rc=resolve_conflict(fp,resolution)
            elif content: stdout,stderr,rc=resolve_conflict(fp,content)
            else: self._json({"ok":False,"error":"no resolution"},400); return
            self._json({"ok":True} if rc==0 else {"ok":False,"error":stderr or "failed"},400)

        elif path=="/api/reset":
            commit=data.get("commit",""); mode=data.get("mode","soft")
            stdout,stderr,rc=reset_to(commit,mode)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        elif path=="/api/revert":
            commit=data.get("commit","")
            stdout,stderr,rc=revert_commit(commit)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        elif path=="/api/squash":
            from_h=data.get("from",""); to_h=data.get("to",""); msg=data.get("message","")
            stdout,stderr,rc=squash_commits(from_h,to_h,msg)
            self._json({"ok":True,"stdout":stdout} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        elif path=="/api/abort":
            stdout,stderr,rc=abort_merge_or_rebase()
            self._json({"ok":True,"stdout":stdout or "reset"} if rc==0 else {"ok":False,"error":stderr or stdout},400)
        else:
            self._json({"ok":False,"error":"unknown"},404)


def main():
    global PORT
    port=PORT
    while True:
        try:
            server=HTTPServer(("127.0.0.1",port),Handler)
            PORT=port; break
        except (socket.error,OSError):
            port+=1
    print("\n  Git Tool  |  http://127.0.0.1:"+str(PORT)+"\n")
    import webbrowser; webbrowser.open("http://127.0.0.1:"+str(PORT))
    try: server.serve_forever()
    except KeyboardInterrupt: print("\n  Bye"); server.shutdown()

if __name__=="__main__":
    main()
