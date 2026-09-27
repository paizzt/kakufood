'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, UserCog } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    branch_id: '',
    status: 'active'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [usersRes, branchesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, { headers })
      ]);
      
      const usersData = await usersRes.json();
      const branchesData = await branchesRes.json();
      
      setUsers(usersData.data || []);
      setBranches(branchesData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ name: '', email: '', password: '', role: 'staff', branch_id: '', status: 'active' });
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsEdit(true);
    setEditId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Empty password for edit
      role: user.role,
      branch_id: user.branch_id || '',
      status: user.status
    });
    setShowModal(true);
  };
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus User?', text: 'Apakah Anda yakin ingin menghapus user ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#800000', confirmButtonText: 'Hapus' });
    if (!result.isConfirmed) return;
    try {
      const token = Cookies.get('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      Swal.fire('Error', 'Gagal menghapus data.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const token = Cookies.get('token');
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/users`;
      const method = isEdit ? 'PUT' : 'POST';

      // If editing and password is empty, don't send password
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete (submitData as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        Swal.fire('Error', `Gagal menyimpan: ${errorData.message || 'Cek kembali data form'}`, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold mb-1">Manajemen Pengguna</h2>
          <p className="text-muted mb-0">Kelola akses admin dan staff cabang.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <UserCog size={18} /> Tambah
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Cabang (Opsional)</th>
                  <th>Status</th>
                  <th className="text-end px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Memuat data...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">Tidak ada data.</td></tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-4 fw-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{user.branch?.name || <span className="text-muted fst-italic">Pusat/Semua</span>}</td>
                      <td>
                        <span className={`badge ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEdit(user)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEdit ? 'Edit User' : 'Tambah'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nama Lengkap <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password {isEdit && <span className="text-muted small fw-normal">(Kosongkan jika tidak ingin diubah)</span>}</label>
                    <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEdit} minLength={6} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role Akses</label>
                    <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="admin">Administrator (Akses Penuh)</option>
                      <option value="staff">Staff Cabang (Akses Terbatas)</option>
                    </select>
                  </div>
                  {formData.role === 'staff' && (
                    <div className="mb-3">
                      <label className="form-label">Cabang Penugasan <span className="text-danger">*</span></label>
                      <select className="form-select" value={formData.branch_id} onChange={e => setFormData({...formData, branch_id: e.target.value})} required>
                        <option value="">Pilih Cabang...</option>
                        {branches.map((b: any) => (
                          <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Status Akun</label>
                    <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
