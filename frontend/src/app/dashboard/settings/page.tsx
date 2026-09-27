'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Save, Lock } from 'lucide-react';

const MySwal = withReactContent(Swal);

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
      setName(parsedUser.name || '');
      setEmail(parsedUser.email || '');
      setRole(parsedUser.role || '');
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('http://127.0.0.1:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil');
      }

      // Update cookie
      Cookies.set('user', JSON.stringify(data.user));
      setUser(data.user);
      
      // Update sidebar/navbar by triggering an event or reload
      window.dispatchEvent(new Event('userUpdated'));

      MySwal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Profil berhasil diperbarui',
        confirmButtonColor: '#0d6efd'
      });
    } catch (error: any) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message,
        confirmButtonColor: '#0d6efd'
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Konfirmasi password tidak cocok',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    setLoadingPassword(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('http://127.0.0.1:8000/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.errors?.current_password?.[0] || 'Gagal memperbarui password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      MySwal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Password berhasil diperbarui',
        confirmButtonColor: '#0d6efd'
      });
    } catch (error: any) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message,
        confirmButtonColor: '#0d6efd'
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <h2 className="fs-4 fw-bold mb-1">Pengaturan</h2>
      <p className="text-muted mb-4">Informasi dan keamanan akun Anda.</p>
      
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0 fw-bold">Profil Pengguna</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label text-muted">Nama</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Peran (Role)</label>
                  <input 
                    type="text" 
                    className="form-control text-capitalize" 
                    value={role} 
                    readOnly 
                    disabled 
                  />
                  <div className="form-text">Peran tidak dapat diubah oleh Anda sendiri.</div>
                </div>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loadingProfile}>
                  <Save size={18} />
                  {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0 fw-bold">Ubah Password</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-3">
                  <label className="form-label text-muted">Password Saat Ini</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Password Baru</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength={8}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    minLength={8}
                  />
                </div>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loadingPassword}>
                  <Lock size={18} />
                  {loadingPassword ? 'Memperbarui...' : 'Perbarui Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
