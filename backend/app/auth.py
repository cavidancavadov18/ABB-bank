from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any

COOKIE = "abb_admin_session"
SECRET = os.environ.get("ADMIN_SESSION_SECRET", "abb-admin-demo-secret-2026")
MAX_AGE = 60 * 60 * 24 * 7


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    pad = "=" * ((4 - len(value) % 4) % 4)
    return base64.urlsafe_b64decode(value + pad)


def _sign(payload: str) -> str:
    digest = hmac.new(SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).digest()
    return _b64url(digest)


def create_session_token(user_id: str, username: str) -> str:
    body = _b64url(
        json.dumps(
            {"userId": user_id, "username": username, "exp": int(time.time() * 1000) + MAX_AGE * 1000},
            separators=(",", ":"),
        ).encode("utf-8")
    )
    return f"{body}.{_sign(body)}"


def verify_session_token(token: str | None) -> dict[str, str] | None:
    if not token:
        return None
    parts = token.split(".")
    if len(parts) != 2:
        return None
    body, sig = parts
    expected = _sign(body)
    if not hmac.compare_digest(sig, expected):
        return None
    try:
        data = json.loads(_b64url_decode(body).decode("utf-8"))
    except Exception:
        return None
    if not data.get("exp") or data["exp"] < int(time.time() * 1000):
        return None
    return {"userId": data["userId"], "username": data["username"]}


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "username": user["username"],
        "role": user["role"],
        "name": user["name"],
        "createdAt": user["createdAt"],
    }
