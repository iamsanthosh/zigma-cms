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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <form onSubmit={onSubmit} style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '2.5rem', 
        width: '100%', 
        maxWidth: '400px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        margin: '1rem'
      }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 700, 
          marginBottom: '0.5rem', 
          color: '#1E2530',
          textAlign: 'center'
        }}>Zigma CMS</h1>
        <p style={{ 
          color: '#5B6472', 
          marginBottom: '1.5rem', 
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>Sign in to manage the site.</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.4rem', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: '#1E2530' 
          }}>Email</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '0.6rem 0.8rem', 
              border: '1px solid #E7EBF1', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.4rem', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: '#1E2530' 
          }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '0.6rem 0.8rem', 
              border: '1px solid #E7EBF1', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {error && <p style={{ 
          color: '#c0392b', 
          fontSize: '0.85rem', 
          marginBottom: '1rem',
          padding: '0.5rem',
          background: '#fee',
          borderRadius: '4px'
        }}>{error}</p>}
        
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#FF6B1A', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            cursor: loading ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box'
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
