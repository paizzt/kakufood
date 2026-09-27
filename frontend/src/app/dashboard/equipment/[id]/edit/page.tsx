'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category_id: '',
    branch_id: '',
    location: '',
    condition: 'Baik',
    status: 'Aktif',
    purchase_date: '',
    purchase_price: '',
    person_in_charge: '',
    description: ''
  });

  useEffect(() => {
    const token = Cookies.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Fetch options and equipment data
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, { headers }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`, { headers }).then(res => res.json())
    ]).then(([catData, branchData, eqData]) => {
      setCategories(catData.data || []);
      setBranches(branchData.data || []);
      
      if (eqData && eqData.data) {
        const item = eqData.data;
        setFormData({
          code: item.code || '',
          name: item.name || '',
          category_id: item.category_id || '',
          branch_id: item.branch_id || '',
          location: item.location || '',
          condition: item.condition || 'Baik',
          status: item.status || 'Aktif',
          purchase_date: item.purchase_date || '',
          purchase_price: item.purchase_price || '',
          person_in_charge: item.person_in_charge || '',
          description: item.description || ''
        });
      }
    }).catch(err => {
      console.error("Error fetching data:", err);
      Swal.fire('Error', 'Gagal memuat data equipment.', 'error');
    }).finally(() => {
      setFetching(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, purchase_price: rawValue });
  };

  const formatPrice = (value: string | number) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push(`/dashboard/equipment/${id}`);
        router.refresh();
      } else {
        const errorData = await res.json();
        Swal.fire('Error', `Gagal menyimpan: ${errorData.message || 'Cek kembali data form'}`, 'error');
      }
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-5 text-center">Memuat data...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold mb-0">Edit Equipment</h2>
        </div>
        <Link href={`/dashboard/equipment/${id}`} className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <ArrowLeft size={18} /> Batal
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium">Kode Equipment <span className="text-danger">*</span></label>
                <input type="text" name="code" className="form-control" value={formData.code} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Nama Equipment <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Kategori <span className="text-danger">*</span></label>
                <select name="category_id" className="form-select" value={formData.category_id} onChange={handleChange} required>
                  <option value="">Pilih Kategori...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Cabang <span className="text-danger">*</span></label>
                <select name="branch_id" className="form-select" value={formData.branch_id} onChange={handleChange} required>
                  <option value="">Pilih Cabang...</option>
                  {branches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>{branch.name} ({branch.city})</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium">Lokasi / Ruangan</label>
                <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Kondisi <span className="text-danger">*</span></label>
                <select name="condition" className="form-select" value={formData.condition} onChange={handleChange} required>
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Status <span className="text-danger">*</span></label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                  <option value="Aktif">Aktif</option>
                  <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                  <option value="Tidak Digunakan">Tidak Digunakan</option>
                  <option value="Hilang">Hilang</option>
                  <option value="Dipindahkan">Dipindahkan</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium">Tanggal Pengadaan</label>
                <input type="date" name="purchase_date" className="form-control" value={formData.purchase_date} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Harga Pengadaan</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">Rp</span>
                  <input type="text" name="purchase_price" className="form-control" value={formatPrice(formData.purchase_price)} onChange={handlePriceChange} />
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Penanggung Jawab (PIC)</label>
                <input type="text" name="person_in_charge" className="form-control" value={formData.person_in_charge} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Deskripsi / Catatan</label>
                <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>

            <hr className="my-4" />
            
            <div className="d-flex justify-content-end gap-3">
              <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={loading}>
                <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
