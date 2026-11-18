#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
server_state.py — Shared mutable server state for Git Manage Board.

Centralises all globals that are read/written by both git_ops and api_handlers,
so neither module needs to import private internals from the other.
"""

import threading

# ── HTTP server port (auto-incremented from 8989 if busy) ─────────────────
PORT: int = 8989

# ── In-memory operation message log ──────────────────────────────────────
_MSGLOG: list = []
_MSGLOG_LOCK = threading.Lock()

# ── Streaming job registry (push / fetch / pull) ─────────────────────────
# Schema: {job_id: {lines:[], done:bool, ok:bool, error:str, authRequired:bool, ...}}
_PUSH_JOBS: dict = {}
_PUSH_JOBS_LOCK = threading.Lock()
