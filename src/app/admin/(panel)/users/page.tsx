"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  role: string;
  name: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"superadmin" | "editor">("editor");
  const [error, setError] = useState("");
  const [pwdEdits, setPwdEdits] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    fetch("/api/admin/users")
      .then(async (r) => {
        if (!r.ok) throw new Error("forbidden");
        return r.json();
      })
      .then((d) => setUsers(d.users || []))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Xəta");
      return;
    }
    setUsername("");
    setPassword("");
    setName("");
    load();
  };

  const changePassword = async (id: string) => {
    const password = pwdEdits[id];
    if (!password || password.length < 4) {
      alert("Min. 4 simvol");
      return;
    }
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    setPwdEdits((p) => ({ ...p, [id]: "" }));
    alert("Şifrə yeniləndi");
  };

  const remove = async (id: string) => {
    if (!confirm("İstifadəçi silinsin?")) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, delete: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Xəta");
      return;
    }
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold">İstifadəçilər</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Super admin: yeni istifadəçi, şifrə dəyiş, sil
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-6 grid gap-3 rounded-2xl border border-white/8 bg-[#161b26] p-5 md:grid-cols-2"
      >
        <p className="md:col-span-2 text-[14px] font-medium">Yeni istifadəçi</p>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">Ad</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">
            İstifadəçi adı
          </span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="admin-input w-full"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">Şifrə</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input w-full"
            required
            minLength={4}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">Rol</span>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "superadmin" | "editor")
            }
            className="admin-input w-full"
          >
            <option value="editor">Editor</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </label>
        {error && (
          <p className="md:col-span-2 text-[13px] text-red-300">{error}</p>
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-[#1b63ed] px-4 py-2.5 text-[13px] font-medium"
          >
            Əlavə et
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl border border-white/8 bg-[#161b26] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-[12px] text-white/45">
                  @{u.username} · {u.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(u.id)}
                className="text-[12px] text-red-300 hover:underline"
              >
                Sil
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <input
                type="password"
                placeholder="Yeni şifrə"
                value={pwdEdits[u.id] || ""}
                onChange={(e) =>
                  setPwdEdits((p) => ({ ...p, [u.id]: e.target.value }))
                }
                className="admin-input max-w-[200px]"
              />
              <button
                type="button"
                onClick={() => changePassword(u.id)}
                className="rounded-lg bg-white/8 px-3 py-2 text-[12px]"
              >
                Şifrəni dəyiş
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
