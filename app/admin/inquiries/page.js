'use client';
import { useEffect, useState } from 'react';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = await res.json();
      errorMessage = data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export default function InquiriesAdmin() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      setRows(await api('/api/admin/inquiries'));
    } catch (err) {
      setError(err.message || 'Failed to load inquiries');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(row, status) {
    await api(`/api/admin/inquiries/${row.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <h1 className="admin-h1">Inquiries</h1>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Message</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  {r.email} {r.phone}
                </td>
                <td style={{ maxWidth: 320 }}>{r.message}</td>
                <td>
                  <span className={`admin-badge ${r.status === 'new' ? 'admin-badge-draft' : 'admin-badge-live'}`}>{r.status}</span>
                </td>
                <td>
                  <select value={r.status} onChange={(e) => setStatus(r, e.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
