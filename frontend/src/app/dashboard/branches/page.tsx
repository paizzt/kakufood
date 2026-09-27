'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    manager: '',
    phone: '',
    status: 'active'
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBranches(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ code: '', name: '', address: '', city: '', manager: '', phone: '', status: 'active' });
    setShowModal(true);
  };

  const handleOpenEdit = (branch: any) => {
    setIsEdit(true);
    setEditId(branch.id);
    setFormData({
      code: branch.code,
      name: branch.name,
      address: branch.address || '',
      city: branch.city || '',
      manager: branch.manager || '',
      phone: branch.phone || '',
      status: branch.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus Cabang?', text: 'Apakah Anda yakin ingin menghapus cabang ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#800000', confirmButtonText: 'Hapus' });
    if (!result.isConfirmed) return;
    try {
      const token = Cookies.get('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchBranches();
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
        ? `${process.env.NEXT_PUBLIC_API_URL}/branches/${editId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/branches`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchBranches();
      } else {
        Swal.fire('Error', 'Gagal menyimpan data.', 'error');
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
          <h2 className="fs-4 fw-bold mb-1">Daftar Cabang</h2>
          <p className="text-muted mb-0">Kelola master data cabang Kaku Food.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={18} /> Tambah
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th>Nama Cabang</th>
                  <th>Kota</th>
                  <th>Penanggung Jawab</th>
                  <th>Status</th>
                  <th className="text-end px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Memuat data...</td></tr>
                ) : branches.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">Tidak ada data.</td></tr>
                ) : (
                  branches.map((branch: any) => (
                    <tr key={branch.id}>
                      <td className="px-4 fw-bold text-secondary">{branch.code}</td>
                      <td className="fw-medium">{branch.name}</td>
                      <td>{branch.city || '-'}</td>
                      <td>{branch.manager || '-'}</td>
                      <td>
                        <span className={`badge ${branch.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {branch.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEdit(branch)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(branch.id)}>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEdit ? 'Edit Cabang' : 'Tambah'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Kode Cabang</label>
                      <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nama Cabang</label>
                      <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Kota</label>
                      <input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Penanggung Jawab (Manager)</label>
                      <input type="text" className="form-control" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nomor Telepon</label>
                      <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Alamat Lengkap</label>
                      <textarea className="form-control" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                    </div>
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
