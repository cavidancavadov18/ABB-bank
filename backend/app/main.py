from __future__ import annotations

import os
import random
import string
import time
from datetime import datetime
from typing import Any

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .auth import (
    COOKIE,
    MAX_AGE,
    create_session_token,
    public_user,
    verify_session_token,
)
from .cbar import get_cbar_rates
from .store import read_store, update_store

app = FastAPI(title="ABB Bank API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _uid(prefix: str) -> str:
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return f"{prefix}-{int(time.time() * 1000)}-{suffix}"


def _session_user(request: Request) -> dict[str, Any] | None:
    token = request.cookies.get(COOKIE)
    session = verify_session_token(token)
    if not session:
        return None
    store = read_store()
    return next((u for u in store["users"] if u["id"] == session["userId"]), None)


def _require_admin(request: Request, roles: list[str] | None = None):
    user = _session_user(request)
    if not user:
        return None, JSONResponse({"error": "Unauthorized"}, status_code=401)
    if roles and user.get("role") not in roles:
        return None, JSONResponse({"error": "Forbidden"}, status_code=403)
    return user, None


@app.get("/health")
def health():
    return {"ok": True, "service": "python-backend"}


@app.get("/api/rates")
async def rates():
    try:
        bulletin = await get_cbar_rates()
        return JSONResponse(
            bulletin,
            headers={
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
            },
        )
    except Exception:
        return JSONResponse({"error": "rates_unavailable"}, status_code=502)


@app.get("/api/news")
def news_public():
    store = read_store()
    news = [
        {
            "id": n["id"],
            "date": n["date"],
            "title": {"az": n["titleAz"], "en": n["titleEn"]},
            "excerpt": {"az": n.get("excerptAz", ""), "en": n.get("excerptEn", "")},
            "image": n.get("image"),
            "href": n.get("href"),
            "badge": n.get("badge") or None,
        }
        for n in store["news"]
        if n.get("published")
    ]
    return {"news": news}


@app.post("/api/applications")
async def applications(request: Request):
    body = await request.json()
    phone = str(body.get("phone") or "").strip()
    fin = str(body.get("fin") or "").strip().upper()
    if len(phone) < 9 or len(fin) < 5:
        return JSONResponse({"error": "Məlumatlar düzgün deyil"}, status_code=400)

    app_item = {
        "id": f"app-{int(time.time() * 1000)}",
        "phone": phone,
        "fin": fin,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "status": "new",
    }

    def mutator(store: dict[str, Any]):
        store["applications"].insert(0, app_item)

    update_store(mutator)
    return JSONResponse({"ok": True, "id": app_item["id"]}, status_code=201)


@app.get("/api/chat")
def chat_get():
    store = read_store()
    settings = store["settings"]
    return {
        "chatEnabled": settings.get("chatEnabled", True),
        "supportPhone": settings.get("supportPhone", "937"),
    }


@app.post("/api/chat")
async def chat_post(request: Request):
    store = read_store()
    if not store["settings"].get("chatEnabled", True):
        return JSONResponse({"error": "Chat deaktivdir"}, status_code=403)

    body = await request.json()
    text = str(body.get("text") or "").strip()
    if not text:
        return JSONResponse({"error": "Mesaj boşdur"}, status_code=400)

    msg = {
        "id": _uid("m"),
        "locale": body.get("locale") or "az",
        "role": "bot" if body.get("role") == "bot" else "user",
        "text": text,
        "sessionId": body.get("sessionId") or "anon",
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "read": body.get("role") == "bot",
    }

    def mutator(s: dict[str, Any]):
        s["messages"].insert(0, msg)

    update_store(mutator)
    return {"ok": True, "message": msg}


@app.post("/api/admin/login")
async def admin_login(request: Request, response: Response):
    body = await request.json()
    username = str(body.get("username") or "").strip()
    password = str(body.get("password") or "")
    if not username or not password:
        return JSONResponse(
            {"error": "İstifadəçi adı və şifrə tələb olunur"}, status_code=400
        )

    store = read_store()
    user = next(
        (
            u
            for u in store["users"]
            if u["username"] == username and u["password"] == password
        ),
        None,
    )
    if not user:
        return JSONResponse(
            {"error": "Yanlış istifadəçi adı və ya şifrə"}, status_code=401
        )

    token = create_session_token(user["id"], user["username"])
    secure = os.environ.get("NODE_ENV") == "production"
    response = JSONResponse({"user": public_user(user)})
    response.set_cookie(
        key=COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        secure=secure,
        path="/",
        max_age=MAX_AGE,
    )
    return response


@app.post("/api/admin/logout")
def admin_logout(response: Response):
    response = JSONResponse({"ok": True})
    response.delete_cookie(COOKIE, path="/")
    return response


@app.get("/api/admin/me")
def admin_me(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    return {"user": public_user(user)}


@app.get("/api/admin/stats")
def admin_stats(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    store = read_store()
    return {
        "news": len(store["news"]),
        "publishedNews": len([n for n in store["news"] if n.get("published")]),
        "messages": len(store["messages"]),
        "unreadMessages": len(
            [m for m in store["messages"] if not m.get("read") and m.get("role") == "user"]
        ),
        "applications": len(store["applications"]),
        "newApplications": len(
            [a for a in store["applications"] if a.get("status") == "new"]
        ),
        "users": len(store["users"]),
    }


@app.get("/api/admin/news")
def admin_news_list(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    return {"news": read_store()["news"]}


@app.post("/api/admin/news")
async def admin_news_create(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    body = await request.json()
    title_az = str(body.get("titleAz") or "").strip()
    if not title_az:
        return JSONResponse({"error": "Başlıq tələb olunur"}, status_code=400)

    item = {
        "id": f"news-{int(time.time() * 1000)}",
        "date": str(body.get("date") or "").strip()
        or datetime.now().strftime("%d.%m.%Y"),
        "titleAz": title_az,
        "titleEn": str(body.get("titleEn") or title_az).strip(),
        "excerptAz": str(body.get("excerptAz") or "").strip(),
        "excerptEn": str(body.get("excerptEn") or "").strip(),
        "image": str(body.get("image") or "").strip()
        or "https://cdn.abb-bank.az/usaqyigium1_38169c9ca3.png",
        "href": str(body.get("href") or "").strip() or f"/xeberler/{int(time.time())}",
        "badge": (str(body.get("badge") or "").strip() or None),
        "published": body.get("published") is not False,
        "updatedAt": datetime.utcnow().isoformat() + "Z",
    }

    def mutator(store: dict[str, Any]):
        store["news"].insert(0, item)

    update_store(mutator)
    return JSONResponse({"item": item}, status_code=201)


@app.put("/api/admin/news/{news_id}")
async def admin_news_put(news_id: str, request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    body = await request.json()
    updated: dict[str, Any] | None = None

    def mutator(store: dict[str, Any]):
        nonlocal updated
        for idx, item in enumerate(store["news"]):
            if item["id"] != news_id:
                continue
            merged = {**item, **body, "id": news_id}
            merged["updatedAt"] = datetime.utcnow().isoformat() + "Z"
            store["news"][idx] = merged
            updated = merged
            break

    update_store(mutator)
    if not updated:
        return JSONResponse({"error": "Tapılmadı"}, status_code=404)
    return {"item": updated}


@app.delete("/api/admin/news/{news_id}")
def admin_news_delete(news_id: str, request: Request):
    user, err = _require_admin(request)
    if err:
        return err

    def mutator(store: dict[str, Any]):
        store["news"] = [n for n in store["news"] if n["id"] != news_id]

    update_store(mutator)
    return {"ok": True}


@app.get("/api/admin/messages")
def admin_messages(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    return {"messages": read_store()["messages"]}


@app.patch("/api/admin/messages")
async def admin_messages_patch(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    body = await request.json()
    ids = body.get("ids") or []
    if not ids:
        return JSONResponse({"error": "ids tələb olunur"}, status_code=400)

    def mutator(store: dict[str, Any]):
        if body.get("delete"):
            store["messages"] = [m for m in store["messages"] if m["id"] not in ids]
            return
        for msg in store["messages"]:
            if msg["id"] in ids and isinstance(body.get("read"), bool):
                msg["read"] = body["read"]

    update_store(mutator)
    return {"ok": True}


@app.get("/api/admin/applications")
def admin_applications(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    return {"applications": read_store()["applications"]}


@app.patch("/api/admin/applications")
async def admin_applications_patch(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    body = await request.json()
    app_id = body.get("id")
    if not app_id:
        return JSONResponse({"error": "id tələb olunur"}, status_code=400)

    def mutator(store: dict[str, Any]):
        if body.get("delete"):
            store["applications"] = [
                a for a in store["applications"] if a["id"] != app_id
            ]
            return
        status = body.get("status")
        for item in store["applications"]:
            if item["id"] == app_id and status:
                item["status"] = status
                break

    update_store(mutator)
    return {"ok": True}


@app.get("/api/admin/settings")
def admin_settings_get(request: Request):
    user, err = _require_admin(request)
    if err:
        return err
    return {"settings": read_store()["settings"]}


@app.put("/api/admin/settings")
async def admin_settings_put(request: Request):
    user, err = _require_admin(request, roles=["superadmin"])
    if err:
        return err
    body = await request.json()

    def mutator(store: dict[str, Any]):
        store["settings"].update({k: v for k, v in body.items() if k in store["settings"]})

    update_store(mutator)
    return {"settings": read_store()["settings"]}


@app.get("/api/admin/users")
def admin_users_get(request: Request):
    user, err = _require_admin(request, roles=["superadmin"])
    if err:
        return err
    return {"users": [public_user(u) for u in read_store()["users"]]}


@app.post("/api/admin/users")
async def admin_users_post(request: Request):
    user, err = _require_admin(request, roles=["superadmin"])
    if err:
        return err
    body = await request.json()
    username = str(body.get("username") or "").strip().lower()
    password = str(body.get("password") or "")
    name = str(body.get("name") or username).strip()
    if not username or len(password) < 4:
        return JSONResponse(
            {"error": "İstifadəçi adı və min. 4 simvollu şifrə tələb olunur"},
            status_code=400,
        )

    new_user = {
        "id": f"u-{int(time.time() * 1000)}",
        "username": username,
        "password": password,
        "role": "editor" if body.get("role") == "editor" else "superadmin",
        "name": name,
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }

    def mutator(store: dict[str, Any]):
        if any(u["username"] == username for u in store["users"]):
            raise ValueError("exists")
        store["users"].append(new_user)

    try:
        update_store(mutator)
    except ValueError:
        return JSONResponse({"error": "Bu istifadəçi adı artıq var"}, status_code=409)
    return JSONResponse({"user": public_user(new_user)}, status_code=201)


@app.patch("/api/admin/users")
async def admin_users_patch(request: Request):
    user, err = _require_admin(request, roles=["superadmin"])
    if err:
        return err
    body = await request.json()
    user_id = body.get("id")
    if not user_id:
        return JSONResponse({"error": "id tələb olunur"}, status_code=400)
    if body.get("delete") and user_id == user["id"]:
        return JSONResponse(
            {"error": "Öz hesabınızı silə bilməzsiniz"}, status_code=400
        )

    result: dict[str, Any] | None = None

    def mutator(store: dict[str, Any]):
        nonlocal result
        if body.get("delete"):
            store["users"] = [u for u in store["users"] if u["id"] != user_id]
            return
        target = next((u for u in store["users"] if u["id"] == user_id), None)
        if not target:
            return
        if body.get("password") and len(str(body["password"])) >= 4:
            target["password"] = body["password"]
        if str(body.get("name") or "").strip():
            target["name"] = str(body["name"]).strip()
        if body.get("role") in ("superadmin", "editor"):
            target["role"] = body["role"]
        result = public_user(target)

    update_store(mutator)
    if body.get("delete"):
        return {"ok": True}
    if not result:
        return JSONResponse({"error": "Tapılmadı"}, status_code=404)
    return {"user": result}
