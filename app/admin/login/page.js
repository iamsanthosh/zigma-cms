'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Login failed.');
      return;
    }
    router.push(params.get('next') || '/admin');
  }

  return (
    <div className="admin-body">
      <div className="admin-login-wrap">
        <form className="admin-login-card" onSubmit={onSubmit}>
          <h1 className="admin-h1">Zigma CMS</h1>
          <p style={{ color: '#5B6472', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sign in to manage the site.</p>
          <div className="admin-field">
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          <button className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
