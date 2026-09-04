#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git Manage Board — Entry point.
Usage: python3 git_commit_tool.py
Browser opens http://127.0.0.1:8989
"""

import os, json, socket, sys

# Ensure app/ is on sys.path so `core.*` and `ai_module.*` resolve correctly
# regardless of the working directory the launcher uses.
_APP_DIR = os.path.dirname(os.path.abspath(__file__))
if _APP_DIR not in sys.path:
    sys.path.insert(0, _APP_DIR)

from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from core.server_state import PORT, _MSGLOG, _PUSH_JOBS
from core.git_ops import current_branch
from core.api_handlers import handle_get, handle_post

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args): pass

    def _send(self, code, ctype, body, extra_headers=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        try:
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", len(body))
            if extra_headers:
                for k, v in extra_headers.items():
                    self.send_header(k, v)
            self.end_headers()
            self.wfile.write(body)
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            pass  # Client disconnected before response was sent — benign

    def _json(self, obj, err_code=None):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        if err_code is not None:
            code = err_code
        else:
            code = 200 if obj.get("ok", True) else 400
        self._send(code, "application/json", body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        if path == "/" or path == "/index.html":
            fp = os.path.join(STATIC_DIR, "index.html")
            try:
                self._send(200, "text/html; charset=utf-8", open(fp, "rb").read(),
                           {"Cache-Control": "no-store"})
            except FileNotFoundError:
                self._send(404, "text/plain", "index.html not found")
            return

        if path.startswith("/static/"):
            rel = path[len("/static/"):]
            fp = os.path.join(STATIC_DIR, rel)
            if os.path.isfile(fp):
                ext = os.path.splitext(fp)[1]
                ct = MIME_TYPES.get(ext, "application/octet-stream")
                # Prevent stale JS/CSS after server restart
                no_cache = ext in {".js", ".css", ".html"}
                hdrs = {"Cache-Control": "no-store"} if no_cache else {}
                self._send(200, ct, open(fp, "rb").read(), hdrs)
            else:
                self._send(404, "text/plain", "Not found")
            return

        handled = handle_get(path, params, self._json)
        if not handled:
            self._send(404, "text/plain", "Not found")

    def _handle_ai_stream(self, data):
        """Handle SSE streaming for AI chat responses."""
        from ai_module.ai_provider import call_llm_stream

        provider = data.get("provider", "openai")
        api_key  = data.get("api_key", "")
        base_url = data.get("base_url", "")
        model    = data.get("model", "")
        messages = data.get("messages", [])

        if not messages:
            self._json({"ok": False, "error": "messages required"}, 400)
            return

        try:
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("X-Accel-Buffering", "no")
            self.end_headers()
        except Exception:
            return

        def _write(payload: str):
            try:
                line = f"data: {payload}\n\n"
                self.wfile.write(line.encode("utf-8"))
                self.wfile.flush()
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
                raise

        try:
            for chunk_json in call_llm_stream(provider, api_key, base_url, model, messages):
                _write(chunk_json)
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            pass  # Client disconnected — normal
        except Exception as e:
            import json as _json
            try:
                _write(_json.dumps({"error": str(e), "done": True}))
            except Exception:
                pass

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self._json({"ok": False, "error": "Invalid JSON"}, 400)
            return
        path = urlparse(self.path).path

        # SSE streaming endpoint — handled here, not in api_handlers
        if path == "/api/ai/stream":
            self._handle_ai_stream(data)
            return

        handled = handle_post(path, data, self._json)
        if not handled:
            self._json({"ok": False, "error": "unknown endpoint"}, 404)


_QUIET_ERRORS = (ConnectionResetError, BrokenPipeError, ConnectionAbortedError)

class QuietServer(ThreadingHTTPServer):
    """Concurrent HTTP server that silently ignores client-disconnect errors."""
    daemon_threads = True

    def handle_error(self, request, client_address):
        if sys.exc_info()[0] in _QUIET_ERRORS:
            return
        super().handle_error(request, client_address)


def main():
    import core.git_ops as git_ops
    import core.server_state as server_state
    port = git_ops.PORT
    while True:
        try:
            server = QuietServer(("127.0.0.1", port), Handler)
            git_ops.PORT = port
            server_state.PORT = port  # 同步到 server_state
            break
        except (socket.error, OSError):
            port += 1
    print("\n  Git Tool  |  http://127.0.0.1:" + str(git_ops.PORT) + "\n")
    import webbrowser
    webbrowser.open("http://127.0.0.1:" + str(git_ops.PORT))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Bye")
        server.shutdown()


if __name__ == "__main__":
    main()
