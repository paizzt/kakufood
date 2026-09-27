'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) setUser(JSON.parse(userCookie));
  }, []);

  return (
    <div>
      <h2 className="fs-4 fw-bold mb-1">Pengaturan</h2>
      <p className="text-muted mb-4">Informasi akun Anda.</p>
      
      <div className="card border-0 shadow-sm" style={{ maxWidth: '500px' }}>
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label text-muted">Nama</label>
            <input type="text" className="form-control" value={user?.name || ''} readOnly disabled />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input type="email" className="form-control" value={user?.email || ''} readOnly disabled />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Peran (Role)</label>
            <input type="text" className="form-control text-capitalize" value={user?.role || ''} readOnly disabled />
          </div>
          <div className="alert alert-info mb-0 border-0 bg-primary bg-opacity-10 text-primary">
            Fitur ubah profil dan kata sandi masih dalam pengembangan.
          </div>
        </div>
      </div>
    </div>
  );
}
