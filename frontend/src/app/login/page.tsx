'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogIn, Lock, Mail } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        Cookies.set('token', data.access_token, { expires: 1 }); // 1 day
        Cookies.set('user', JSON.stringify(data.user), { expires: 1 });
        
        router.push('/dashboard');
        router.refresh();
      } else {
        Swal.fire('Login Gagal', data.message || 'Periksa kembali email dan password Anda.', 'error');
      }
    } catch (err) {
      Swal.fire('Error Server', 'Terjadi kesalahan pada server. Coba lagi nanti.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
      <div className="card border-0 border" style={{ width: '100%', maxWidth: '400px', borderRadius: '0.5rem' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img src="/logo.jpg" alt="Kaku Food Logo" className="mb-3" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            <p className="text-muted small">Sistem Monitoring Equipment</p>
          </div>

          {/* Inline error dihilangkan, menggunakan SweetAlert */}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-medium small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><Mail size={18} className="text-muted" /></span>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="admin@kakufood.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-medium small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><Lock size={18} className="text-muted" /></span>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-medium" disabled={loading}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  Memproses...
                </div>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="text-center mt-4 text-muted" style={{ fontSize: '12px' }}>
            &copy; 2026 Kaku Food. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
