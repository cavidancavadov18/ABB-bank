from __future__ import annotations

import json
import os
import threading
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

STORE_PATH = Path(os.environ.get("ADMIN_STORE_PATH", "data/admin/store.json"))
_lock = threading.Lock()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def default_store() -> dict[str, Any]:
    return {
        "users": [
            {
                "id": "u-super",
                "username": "admin",
                "password": "admin",
                "role": "superadmin",
                "name": "Super Admin",
                "createdAt": _now(),
            }
        ],
        "news": [],
        "messages": [],
        "applications": [],
        "settings": {
            "siteName": "ABB",
            "chatEnabled": True,
            "maintenanceMode": False,
            "supportPhone": "937",
            "supportEmail": "info@abb-bank.az",
        },
    }


def read_store() -> dict[str, Any]:
    with _lock:
        try:
            raw = STORE_PATH.read_text(encoding="utf-8")
            store = json.loads(raw)
        except (FileNotFoundError, json.JSONDecodeError):
            store = default_store()
            STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
            STORE_PATH.write_text(
                json.dumps(store, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            return deepcopy(store)

        if not store.get("users"):
            store["users"] = default_store()["users"]
        store.setdefault("news", [])
        store.setdefault("messages", [])
        store.setdefault("applications", [])
        store.setdefault("settings", default_store()["settings"])
        return deepcopy(store)


def write_store(store: dict[str, Any]) -> None:
    with _lock:
        STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
        STORE_PATH.write_text(
            json.dumps(store, ensure_ascii=False, indent=2), encoding="utf-8"
        )


def update_store(mutator) -> dict[str, Any]:
    store = read_store()
    mutator(store)
    write_store(store)
    return store
