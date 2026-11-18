#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
async_jobs.py — Unified async job registry for Git Manage Board.

Provides a single thread-safe store for all async jobs:
  - push / fetch / pull streaming jobs   (previously _PUSH_JOBS in git_ops.py)
  - AI chat jobs                          (previously _AI_JOBS in ai_provider.py)
  - AI autofix jobs                       (previously _AI_AUTOFIX_JOBS in api_handlers.py)

Public API:
    create_job(namespace, initial_data) -> job_id: str
    update_job(namespace, job_id, patch: dict) -> dict
    get_job(namespace, job_id) -> dict | None
    list_jobs(namespace) -> list[dict]
    delete_job(namespace, job_id) -> bool
"""

import threading
import uuid
import time

_STORE: dict = {}          # {namespace: {job_id: dict}}
_STORE_LOCK = threading.Lock()

_JOB_TTL_SECONDS = 3600    # auto-expire jobs after 1 hour


def create_job(namespace: str, initial_data: dict = None) -> str:
    """Create a new job in the given namespace. Returns the job_id."""
    job_id = str(uuid.uuid4())[:8]
    data = dict(initial_data or {})
    data.setdefault("job_id", job_id)
    data.setdefault("namespace", namespace)
    data.setdefault("created_at", int(time.time()))
    data.setdefault("done", False)
    data.setdefault("ok", False)
    with _STORE_LOCK:
        _STORE.setdefault(namespace, {})[job_id] = data
    return job_id


def update_job(namespace: str, job_id: str, patch: dict) -> dict:
    """Merge patch into the job dict. Returns the updated dict."""
    with _STORE_LOCK:
        ns = _STORE.setdefault(namespace, {})
        cur = dict(ns.get(job_id, {}))
        cur.update(patch)
        ns[job_id] = cur
        return dict(cur)


def get_job(namespace: str, job_id: str):
    """Return a copy of the job dict, or None if not found."""
    with _STORE_LOCK:
        d = _STORE.get(namespace, {}).get(job_id)
        return dict(d) if d else None


def list_jobs(namespace: str) -> list:
    """Return all jobs in namespace as a list of copies."""
    with _STORE_LOCK:
        return [dict(v) for v in _STORE.get(namespace, {}).values()]


def delete_job(namespace: str, job_id: str) -> bool:
    """Remove a job from the store. Returns True if it existed."""
    with _STORE_LOCK:
        return _STORE.get(namespace, {}).pop(job_id, None) is not None


def purge_expired(namespace: str = None) -> int:
    """Remove jobs older than _JOB_TTL_SECONDS. Returns count deleted."""
    now = int(time.time())
    deleted = 0
    with _STORE_LOCK:
        namespaces = [namespace] if namespace else list(_STORE.keys())
        for ns in namespaces:
            ns_dict = _STORE.get(ns, {})
            expired = [
                jid for jid, d in ns_dict.items()
                if d.get("done") and (now - d.get("created_at", now)) > _JOB_TTL_SECONDS
            ]
            for jid in expired:
                del ns_dict[jid]
                deleted += 1
    return deleted
