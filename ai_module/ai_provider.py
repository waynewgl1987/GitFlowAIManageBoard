#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ai_module/ai_provider.py — Decoupled AI provider submodule for Git Manage Board.

Supports: GitHub Copilot (auto-auth), OpenAI-compatible, Anthropic, Ollama,
          DeepSeek, Qwen, and custom OpenAI-compatible endpoints.

Public API:
    call_llm(provider, api_key, base_url, model, messages) -> (ok: bool, text: str)
    test_provider(provider, api_key, base_url, model)      -> (ok: bool, message: str)
    get_copilot_models()                                   -> list[str]
    start_chat_job(provider, api_key, base_url, model, messages) -> job_id: str
    get_job_status(job_id)                                 -> dict
"""

import json, os, time, threading, uuid
import urllib.request as _req
import urllib.error

# ── Job queue (for async AI calls so HTTP server isn't blocked) ───────────────
_AI_JOBS: dict = {}
_AI_JOBS_LOCK = threading.Lock()

# ── Copilot auth cache ────────────────────────────────────────────────────────
_copilot_token_cache: dict = {"token": None, "expires_at": 0}
_copilot_cache_lock = threading.Lock()

PROVIDER_BASE_URLS = {
    "copilot":   "https://api.githubcopilot.com",
    "openai":    "https://api.openai.com/v1",
    "anthropic": "https://api.anthropic.com",
    "deepseek":  "https://api.deepseek.com/v1",
    "qwen":      "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "ollama":    "http://localhost:11434/v1",
}

COPILOT_FALLBACK_MODELS = [
    # Claude
    "claude-sonnet-4.6", "claude-opus-4.7", "claude-opus-4.6", "claude-opus-4.5",
    "claude-sonnet-4.5", "claude-haiku-4.5",
    # GPT-5 series
    "gpt-5.4", "gpt-5.3-codex", "gpt-5.2-codex", "gpt-5.2",
    "gpt-5.4-mini", "gpt-5.4-nano", "gpt-5-mini",
    # GPT-4 series
    "gpt-4.1", "gpt-4.1-2025-04-14", "gpt-4o", "gpt-4o-mini",
    # Other
    "gemini-2.5-pro", "grok-code-fast-1",
]


# ── Copilot OAuth token resolution ───────────────────────────────────────────

def _resolve_copilot_oauth_token():
    """Find a GitHub OAuth token for Copilot API access.

    Priority:
    1. Environment variables (GH_TOKEN / GITHUB_TOKEN / COPILOT_GITHUB_TOKEN)
    2. Copilot CLI keychain entry  (service: copilot-cli)
    3. gh CLI auth token
    4. ~/.config/github-copilot/apps.json fallback
    """
    for var in ("COPILOT_GITHUB_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"):
        tok = os.environ.get(var, "").strip()
        if tok:
            return tok, None

    # ── Copilot CLI keychain (macOS) ──────────────────────────────────────────
    import subprocess as _sp
    try:
        r = _sp.run(
            ["security", "find-generic-password", "-s", "copilot-cli",
             "-a", "https://github.com:UWLW44_ihg", "-w"],
            capture_output=True, text=True, timeout=5,
        )
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip(), None
    except Exception:
        pass

    # ── Generic keychain search (any account, copilot-cli service) ──────────
    try:
        # Try without specifying account (finds any entry for the service)
        r2 = _sp.run(
            ["security", "find-generic-password", "-s", "copilot-cli", "-w"],
            capture_output=True, text=True, timeout=5,
        )
        if r2.returncode == 0 and r2.stdout.strip():
            return r2.stdout.strip(), None
    except Exception:
        pass

    # ── gh CLI ────────────────────────────────────────────────────────────────
    for gh in ("/usr/local/bin/gh", "/opt/homebrew/bin/gh",
               os.path.expanduser("~/.local/bin/gh"), "gh"):
        try:
            import subprocess
            r = subprocess.run([gh, "auth", "token"],
                               capture_output=True, text=True, timeout=5)
            if r.returncode == 0 and r.stdout.strip():
                return r.stdout.strip(), None
        except Exception:
            pass

    # ── apps.json fallback ────────────────────────────────────────────────────
    apps_path = os.path.expanduser("~/.config/github-copilot/apps.json")
    if os.path.exists(apps_path):
        try:
            with open(apps_path) as f:
                apps = json.load(f)
            for entry in apps.values():
                tok = entry.get("oauth_token", "")
                if tok:
                    return tok, None
        except Exception as e:
            return None, f"apps.json parse error: {e}"

    return None, "No GitHub token found (set GH_TOKEN or run: copilot login)"


def _get_copilot_api_token():
    """Get the OAuth token for direct Copilot API use.
    The Copilot CLI uses the OAuth token directly as a Bearer token
    (no internal token exchange needed).
    """
    oauth_tok, err = _resolve_copilot_oauth_token()
    if not oauth_tok:
        return None, err
    return oauth_tok, None


def get_copilot_token_cached():
    """Return cached Copilot bearer token, refreshing if expired."""
    with _copilot_cache_lock:
        now = time.time()
        if _copilot_token_cache["token"] and _copilot_token_cache["expires_at"] > now + 60:
            return _copilot_token_cache["token"], None
        token, err = _get_copilot_api_token()
        if token:
            _copilot_token_cache["token"] = token
            _copilot_token_cache["expires_at"] = now + 1500  # 25 min
        return token, err


# ── Model list ───────────────────────────────────────────────────────────────

def get_copilot_models():
    """Fetch live model list from Copilot API, falling back to hardcoded list."""
    token, _ = get_copilot_token_cached()
    if not token:
        return COPILOT_FALLBACK_MODELS
    try:
        r = _req.Request(
            "https://api.githubcopilot.com/models",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Copilot-Integration-Id": _COPILOT_INTEGRATION_ID,
                "User-Agent": _COPILOT_USER_AGENT,
            },
        )
        with _req.urlopen(r, timeout=8) as resp:
            data = json.loads(resp.read())
        raw = data.get("data", [])
        # Accept any model that supports chat or has no explicit type restriction;
        # include preview models so users can access the full catalogue.
        models = [
            m["id"] for m in raw
            if m.get("capabilities", {}).get("type") not in ("embeddings", "image", "tts", "stt")
        ]
        # Deduplicate while preserving order
        seen = set(); models = [m for m in models if not (m in seen or seen.add(m))]
        return models if models else COPILOT_FALLBACK_MODELS
    except Exception:
        return COPILOT_FALLBACK_MODELS


# ── Provider test ─────────────────────────────────────────────────────────────

def test_provider(provider, api_key, base_url, model=""):
    """Test connectivity and credentials. Returns (ok: bool, message: str)."""
    if provider == "copilot":
        token, err = get_copilot_token_cached()
        if token:
            return True, "GitHub Copilot authenticated ✅"
        return False, f"Copilot auth failed: {err}"

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

_COPILOT_INTEGRATION_ID = "copilot-developer-cli"
_COPILOT_USER_AGENT = "copilot/1.0.46 (darwin v24.15.0) term/xterm-256color"

def call_llm(provider, api_key, base_url, model, messages):
    """Call an LLM and return (ok: bool, text: str).

    messages: list of {"role": "system"|"user"|"assistant", "content": str}
    """
    if not model:
        return False, "No model specified"

    if provider == "copilot":
        token, err = get_copilot_token_cached()
        if not token:
            return False, f"Copilot auth failed: {err}"
        effective_key = token
        effective_base = "https://api.githubcopilot.com"
        extra_hdrs = {
            "Editor-Version": "copilot/1.0.46",
            "Copilot-Integration-Id": _COPILOT_INTEGRATION_ID,
            "User-Agent": _COPILOT_USER_AGENT,
        }
    elif provider == "ollama":
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
        return _call_anthropic(effective_key, effective_base, model, messages)
    return _call_openai_compat(effective_key, effective_base, model, messages, extra_hdrs)


def _call_openai_compat(api_key, base_url, model, messages, extra_headers=None):
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
        with _req.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        text = data["choices"][0]["message"]["content"]
        return True, text
    except urllib.error.HTTPError as e:
        err_body = e.read().decode(errors="replace")[:500]
        return False, f"HTTP {e.code}: {err_body}"
    except Exception as e:
        return False, str(e)


def _call_anthropic(api_key, base_url, model, messages):
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
        with _req.urlopen(req, timeout=120) as resp:
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
