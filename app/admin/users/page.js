'use client';
import { useEffect, useState } from 'react';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [creating, setCreating] = useState(false);

  async function load() {
    setUsers(await api('/api/admin/users'));
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser() {
    // Password hashing happens server-side in a dedicated endpoint (not the
    // generic CRUD route, which never writes password_hash) — see
    // app/api/admin/users-create/route.js.
    await fetch('/api/admin/users-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setCreating(false);
    setForm({ name: '', email: '', password: '', role: 'editor' });
    load();
  }

  async function toggle(user) {
    await api(`/api/admin/users/${user.id}`, { method: 'PUT', body: JSON.stringify({ active: user.active ? 0 : 1 }) });
    load();
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Admin Users</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setCreating((c) => !c)}>
          + New User
        </button>
      </div>

      {creating && (
        <div className="admin-card">
          <div className="admin-field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Temporary password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={createUser}>
            Create
          </button>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.active ? 'Active' : 'Disabled'}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost" onClick={() => toggle(u)}>
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
