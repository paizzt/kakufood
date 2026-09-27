'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    serial_number: '',
    category_id: '',
    branch_id: '',
    location: '',
    purchase_date: '',
    purchase_price: '',
    condition: 'Baik',
    status: 'Aktif'
  });

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  const fetchOptions = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [catRes, branchRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, { headers })
      ]);
      const catData = await catRes.json();
      const branchData = await branchRes.json();
      setCategories(catData.data || []);
      setBranches(branchData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      if (branchId) params.append('branch_id', branchId);
      if (conditionFilter) params.append('condition', conditionFilter);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment?${params.toString()}`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      setEquipments(result.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchEquipments();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEquipments();
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      code: '', name: '', description: '', serial_number: '',
      category_id: '', branch_id: '', location: '', purchase_date: '',
      purchase_price: '', condition: 'Baik', status: 'Aktif'
    });
    setShowModal(true);
  };

  const handleOpenEdit = async (item: any) => {
    setIsEdit(true);
    setEditId(item.id);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || '',
      serial_number: item.serial_number || '',
      category_id: item.category_id || '',
      branch_id: item.branch_id || '',
      location: item.location || '',
      purchase_date: item.purchase_date ? item.purchase_date.substring(0, 10) : '',
      purchase_price: item.purchase_price || '',
      condition: item.condition,
      status: item.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus Equipment?', text: 'Data tidak dapat dikembalikan.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#800000', confirmButtonText: 'Hapus' });
    if (!result.isConfirmed) return;
    try {
      const token = Cookies.get('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEquipments();
    } catch (err) {
      Swal.fire('Error', 'Gagal menghapus.', 'error');
    }
  };

  const formatRupiah = (value: string | number) => {
    if (!value) return '';
    const numberString = value.toString().replace(/[^,\d]/g, '');
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  };

  const getConditionBadge = (cond: string) => {
    switch(cond) {
      case 'Baik': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'Rusak Ringan': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'Rusak Berat': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
      case 'Dalam Perbaikan': return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25';
      case 'Hilang': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'Tidak Digunakan': return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
      case 'Dipindahkan': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const token = Cookies.get('token');
      const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL}/equipment/${editId}` : `${process.env.NEXT_PUBLIC_API_URL}/equipment`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchEquipments();
        Swal.fire({ icon: 'success', title: 'Berhasil', showConfirmButton: false, timer: 1500 });
      } else {
        Swal.fire('Error', 'Gagal menyimpan.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Kesalahan sistem.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold mb-0 text-dark">Data Equipment</h2>
        <button onClick={handleOpenAdd} className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={18} /> Tambah
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleFilter} className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted"><Search size={18} /></span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Cari kode atau nama..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Kategori</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={branchId} onChange={e => setBranchId(e.target.value)}>
                <option value="">Cabang</option>
                {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={conditionFilter} onChange={e => setConditionFilter(e.target.value)}>
                <option value="">Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 text-white" style={{ backgroundColor: '#64748b', borderColor: '#64748b' }}>
                <Filter size={18} /> Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th className="px-4">No</th>
              <th>Kode</th>
              <th>Equipment</th>
              <th>Lokasi</th>
              <th>Kondisi</th>
              <th>Status</th>
              <th className="text-end px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-muted">
                  <div className="spinner-border text-primary mb-2 spinner-border-sm me-2" role="status"></div>
                  <span className="small fw-medium">Mengambil data...</span>
                </td>
              </tr>
            ) : equipments.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-muted">Tidak ada data.</td></tr>
            ) : (
              equipments.map((item: any, index: number) => (
                <tr key={item.id}>
                  <td className="px-4">{index + 1}</td>
                  <td><span className="font-monospace small bg-light px-2 py-1 rounded border">{item.code}</span></td>
                  <td>
                    <div className="fw-medium text-dark">{item.name}</div>
                    <div className="small text-muted">{item.category?.name || '-'}</div>
                  </td>
                  <td>
                    <div className="text-dark">{item.branch?.name || '-'}</div>
                  </td>
                  <td><span className={`badge ${getConditionBadge(item.condition)}`}>{item.condition}</span></td>
                  <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                  <td className="text-end px-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Link href={`/dashboard/equipment/${item.id}`} className="btn btn-sm btn-light border text-muted hover-primary" title="Detail">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => handleOpenEdit(item)} className="btn btn-sm btn-light border text-primary" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-light border text-primary" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">{isEdit ? 'Edit Equipment' : 'Tambah Equipment'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Kode Equipment</label>
                      <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Nama Equipment</label>
                      <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Kategori</label>
                      <select className="form-select" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                        <option value="">Pilih Kategori</option>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Cabang</label>
                      <select className="form-select" value={formData.branch_id} onChange={e => setFormData({...formData, branch_id: e.target.value})} required>
                        <option value="">Pilih Cabang</option>
                        {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Kondisi</label>
                      <select className="form-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                        <option value="Baik">Baik</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Harga Pengadaan</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white text-muted">Rp</span>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formatRupiah(formData.purchase_price)} 
                          onChange={e => {
                            const rawValue = e.target.value.replace(/\./g, '');
                            setFormData({...formData, purchase_price: rawValue});
                          }} 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Tanggal Pengadaan</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formData.purchase_date} 
                        onChange={e => setFormData({...formData, purchase_date: e.target.value})} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                      <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Aktif">Aktif</option>
                        <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                        <option value="Hilang">Hilang</option>
                        <option value="Tidak Digunakan">Tidak Digunakan</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                  <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={formLoading}>
                    {formLoading && <div className="spinner-border spinner-border-sm" role="status"></div>}
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
