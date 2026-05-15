#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ai_module/ai_provider.py — Decoupled AI provider submodule for Git Manage Board.

Supports: OpenAI-compatible, Anthropic, Ollama,
          DeepSeek, Qwen, and custom OpenAI-compatible endpoints.

Public API:
    call_llm(provider, api_key, base_url, model, messages) -> (ok: bool, text: str)
    test_provider(provider, api_key, base_url, model)      -> (ok: bool, message: str)
    start_chat_job(provider, api_key, base_url, model, messages) -> job_id: str
    get_job_status(job_id)                                 -> dict
"""

import json, threading, uuid
import urllib.request as _req
import urllib.error

# ── Job queue (for async AI calls so HTTP server isn't blocked) ───────────────
_AI_JOBS: dict = {}
_AI_JOBS_LOCK = threading.Lock()

PROVIDER_BASE_URLS = {
    "openai":    "https://api.openai.com/v1",
    "anthropic": "https://api.anthropic.com",
    "deepseek":  "https://api.deepseek.com/v1",
    "qwen":      "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "ollama":    "http://localhost:11434/v1",
}


# ── Provider test ─────────────────────────────────────────────────────────────

def test_provider(provider, api_key, base_url, model=""):
    """Test connectivity and credentials. Returns (ok: bool, message: str)."""
    if provider == "ollama":
        ollama_base = (base_url or "http://localhost:11434").replace("/v1", "").rstrip("/")
        try:
            _req.urlopen(_req.Request(ollama_base + "/api/tags"), timeout=5).read()
            return True, "Ollama is reachable ✅"
        except Exception as e:
            return False, f"Ollama not reachable: {e}"

    if not api_key:
        return False, f"API key required for {provider}"

    if provider == "anthropic":
        url = (base_url or "https://api.anthropic.com").rstrip("/") + "/v1/models"
        req = _req.Request(url, headers={
            "x-api-key": api_key, "anthropic-version": "2023-06-01"
        })
    else:
        effective_base = (base_url or PROVIDER_BASE_URLS.get(provider, "https://api.openai.com/v1")).rstrip("/")
        url = effective_base + "/models"
        req = _req.Request(url, headers={"Authorization": f"Bearer {api_key}"})

    try:
        with _req.urlopen(req, timeout=10) as resp:
            resp.read()
        return True, f"{provider} credentials valid ✅"
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            return False, f"Invalid API key (HTTP {e.code})"
        if e.code == 404:
            return True, f"{provider} reachable (key accepted)"
        return False, f"HTTP {e.code}"
    except Exception as e:
        return False, str(e)


# ── LLM call ─────────────────────────────────────────────────────────────────

def call_llm(provider, api_key, base_url, model, messages):
    """Call an LLM and return (ok: bool, text: str).

    messages: list of {"role": "system"|"user"|"assistant", "content": str}
    """
    if not model:
        return False, "No model specified"

    if provider == "ollama":
        effective_key = api_key or "ollama"
        effective_base = (base_url or "http://localhost:11434/v1").rstrip("/")
        extra_hdrs = {}
    else:
        if not api_key:
            return False, f"API key required for {provider}"
        effective_key = api_key
        effective_base = (base_url or PROVIDER_BASE_URLS.get(provider, "https://api.openai.com/v1")).rstrip("/")
        extra_hdrs = {}

    if provider == "anthropic":
        return _call_anthropic(effective_key, effective_base, model, messages, timeout=300)

    if provider in ("ollama", "custom"):
        return _call_openai_compat(effective_key, effective_base, model, messages, extra_hdrs, timeout=600)

    return _call_openai_compat(effective_key, effective_base, model, messages, extra_hdrs, timeout=300)


def _call_openai_compat(api_key, base_url, model, messages, extra_headers=None, timeout=120):
    url = base_url.rstrip("/") + "/chat/completions"
    body = json.dumps({
        "model": model,
        "messages": messages,
        "max_tokens": 4096,
        "temperature": 0.2,
    }).encode()
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        **(extra_headers or {}),
    }
    req = _req.Request(url, data=body, headers=headers, method="POST")
    try:
        with _req.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
        text = data["choices"][0]["message"]["content"]
        return True, text
    except urllib.error.HTTPError as e:
        err_body = e.read().decode(errors="replace")[:500]
        return False, f"HTTP {e.code}: {err_body}"
    except Exception as e:
        return False, str(e)


def _call_anthropic(api_key, base_url, model, messages, timeout=120):
    url = base_url.rstrip("/") + "/v1/messages"
    system = ""
    chat = []
    for m in messages:
        if m["role"] == "system":
            system += m["content"] + "\n"
        else:
            chat.append(m)
    body = json.dumps({
        "model": model,
        "max_tokens": 4096,
        "system": system.strip() or "You are a helpful git assistant.",
        "messages": chat,
    }).encode()
    req = _req.Request(url, data=body, method="POST", headers={
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    })
    try:
        with _req.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
        text = data["content"][0]["text"]
        return True, text
    except urllib.error.HTTPError as e:
        err_body = e.read().decode(errors="replace")[:500]
        return False, f"HTTP {e.code}: {err_body}"
    except Exception as e:
        return False, str(e)


# ── Async job queue ───────────────────────────────────────────────────────────

def start_chat_job(provider, api_key, base_url, model, messages):
    """Start an async LLM call. Returns job_id."""
    job_id = str(uuid.uuid4())[:8]
    with _AI_JOBS_LOCK:
        _AI_JOBS[job_id] = {"done": False, "ok": False, "text": "", "error": ""}

    def _run():
        ok, text = call_llm(provider, api_key, base_url, model, messages)
        with _AI_JOBS_LOCK:
            _AI_JOBS[job_id] = {
                "done": True, "ok": ok,
                "text": text if ok else "",
                "error": text if not ok else "",
            }

    threading.Thread(target=_run, daemon=True).start()
    return job_id


def get_job_status(job_id):
    """Return job status dict, or None if job not found."""
    with _AI_JOBS_LOCK:
        return dict(_AI_JOBS.get(job_id, {}))
