#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git Manage Board — Entry point.
Usage: python3 git_commit_tool.py
Browser opens http://127.0.0.1:8989
"""

import os, json, socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from git_ops import PORT, _MSGLOG, _PUSH_JOBS, current_branch
from api_handlers import handle_get, handle_post

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args): pass

    def _send(self, code, ctype, body):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

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
                self._send(200, "text/html; charset=utf-8", open(fp, "rb").read())
            except FileNotFoundError:
                self._send(404, "text/plain", "index.html not found")
            return

        if path.startswith("/static/"):
            rel = path[len("/static/"):]
            fp = os.path.join(STATIC_DIR, rel)
            if os.path.isfile(fp):
                ext = os.path.splitext(fp)[1]
                ct = MIME_TYPES.get(ext, "application/octet-stream")
                self._send(200, ct, open(fp, "rb").read())
            else:
                self._send(404, "text/plain", "Not found")
            return

        handled = handle_get(path, params, self._json)
        if not handled:
            self._send(404, "text/plain", "Not found")

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self._json({"ok": False, "error": "Invalid JSON"}, 400)
            return
        path = urlparse(self.path).path
        handled = handle_post(path, data, self._json)
        if not handled:
            self._json({"ok": False, "error": "unknown endpoint"}, 404)


def main():
    import git_ops
    port = git_ops.PORT
    while True:
        try:
            server = HTTPServer(("127.0.0.1", port), Handler)
            git_ops.PORT = port
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
