'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ name: '', description: '', status: 'active' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: any) => {
    setIsEdit(true);
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      status: cat.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus Kategori?', text: 'Apakah Anda yakin ingin menghapus kategori ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#800000', confirmButtonText: 'Hapus' });
    if (!result.isConfirmed) return;
    try {
      const token = Cookies.get('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCategories();
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
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
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
        fetchCategories();
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
          <h2 className="fs-4 fw-bold mb-1">Kategori Equipment</h2>
          <p className="text-muted mb-0">Kelola master data kategori inventaris.</p>
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
                  <th className="px-4 py-3">No</th>
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Status</th>
                  <th className="text-end px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      <div className="spinner-border text-primary mb-2 spinner-border-sm me-2" role="status"></div>
                      <span className="small fw-medium">Mengambil data...</span>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">Tidak ada data.</td></tr>
                ) : (
                  categories.map((cat: any, index) => (
                    <tr key={cat.id}>
                      <td className="px-4">{index + 1}</td>
                      <td className="fw-medium">{cat.name}</td>
                      <td className="text-muted">{cat.description || '-'}</td>
                      <td>
                        <span className={`badge ${cat.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {cat.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEdit(cat)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>
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
                  <h5 className="modal-title">{isEdit ? 'Edit Kategori' : 'Tambah'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nama Kategori</label>
                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea className="form-control" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
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
