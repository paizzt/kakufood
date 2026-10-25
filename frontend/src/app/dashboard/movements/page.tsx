'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { ArrowRightLeft, Plus, Search, Filter, CheckCircle, Clock, Info, MapPin, Building, Calendar, FileText } from 'lucide-react';

export default function MovementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    equipment_id: '',
    to_branch_id: '',
    movement_date: new Date().toISOString().substring(0, 10),
    status: 'Selesai',
    new_location: '',
    notes: '',
  });

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movements?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [eqRes, branchRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches?for_transfer=1`, { headers })
      ]);

      const eqJson = await eqRes.json();
      const branchJson = await branchRes.json();

      setEquipments(eqJson.data || []);
      setBranches(branchJson.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setCurrentUser(JSON.parse(userCookie));
      } catch (e) {}
    }
    fetchMovements();
    fetchOptions();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovements();
  };

  const handleOpenAdd = () => {
    fetchOptions();
    setFormData({
      equipment_id: '',
      to_branch_id: '',
      movement_date: new Date().toISOString().substring(0, 10),
      status: 'Selesai',
      new_location: '',
      notes: '',
    });
    setShowModal(true);
  };

  // Find currently selected equipment to display origin branch
  const selectedEquipment = useMemo(() => {
    return equipments.find(e => String(e.id) === String(formData.equipment_id));
  }, [equipments, formData.equipment_id]);

  // Destination branches filtered out origin branch
  const availableDestinationBranches = useMemo(() => {
    if (!selectedEquipment) return branches;
    return branches.filter(b => String(b.id) !== String(selectedEquipment.branch_id));
  }, [branches, selectedEquipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipment_id) {
      Swal.fire('Perhatian', 'Silakan pilih equipment yang akan dipindahkan.', 'warning');
      return;
    }
    if (!formData.to_branch_id) {
      Swal.fire('Perhatian', 'Silakan pilih outlet cabang tujuan.', 'warning');
      return;
    }

    setFormLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();

      if (res.ok) {
        setShowModal(false);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil Dipindahkan',
          text: 'Peralatan berhasil dimutasi ke outlet tujuan.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchMovements();
        fetchOptions();
      } else {
        Swal.fire('Gagal', resData.message || 'Terjadi kesalahan saat memindahkan barang.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmArrival = async (item: any) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Penerimaan?',
      text: `Konfirmasi bahwa ${item.equipment?.name || 'equipment'} telah tiba di ${item.to_branch?.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Ya, Konfirmasi Tiba',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movements/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Selesai'
        })
      });

      if (res.ok) {
        await Swal.fire('Diterima!', 'Status mutasi peralatan telah diselesaikan.', 'success');
        fetchMovements();
        fetchOptions();
      } else {
        const errJson = await res.json();
        Swal.fire('Gagal', errJson.message || 'Gagal memperbarui status.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    }
  };

  const handleViewDetail = (item: any) => {
    setSelectedMovement(item);
    setShowDetailModal(true);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fs-4 fw-bold mb-1 text-dark">Perpindahan Equipment (Mutasi Outlet)</h2>
          <p className="text-muted mb-0">Catat dan pantau riwayat pemindahan peralatan antar outlet cabang Kaku Food.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2" onClick={handleOpenAdd}>
          <Plus size={18} /> Pindahkan Barang
        </button>
      </div>

      {/* Filter Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted"><Search size={18} /></span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Cari kode atau nama equipment..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="">Semua Status Mutasi</option>
                <option value="Selesai">Selesai (Tiba)</option>
                <option value="Dalam Perjalanan">Dalam Perjalanan</option>
              </select>
            </div>
            <div className="col-12 col-md-2 col-lg-2">
              <button type="submit" className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                <Filter size={16} /> Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th>Tanggal</th>
                  <th>Equipment</th>
                  <th>Dari Outlet</th>
                  <th>Ke Outlet</th>
                  <th>Status</th>
                  <th>Catatan</th>
                  <th>Petugas</th>
                  <th className="text-end px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5 text-muted">
                      <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                      <span className="small">Memuat riwayat pemindahan...</span>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      <div className="mx-auto mb-3 bg-light text-muted p-3 rounded-circle d-inline-flex">
                        <ArrowRightLeft size={32} />
                      </div>
                      <h6 className="fw-bold mb-1">Belum Ada Riwayat Pemindahan</h6>
                      <p className="text-muted small mb-3">Klik tombol "Pindahkan Barang" untuk memutasi peralatan antar outlet.</p>
                      <button className="btn btn-sm btn-outline-primary" onClick={handleOpenAdd}>
                        Mulai Pemindahan Barang
                      </button>
                    </td>
                  </tr>
                ) : (
                  data.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="px-4 text-muted small">{index + 1}</td>
                      <td className="text-nowrap small">{item.movement_date}</td>
                      <td>
                        <div className="fw-semibold text-dark">{item.equipment?.name || '-'}</div>
                        <span className="font-monospace text-muted small">{item.equipment?.code || '-'}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <Building size={12} className="me-1 text-secondary" />
                          {item.from_branch?.name || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          <MapPin size={12} className="me-1" />
                          {item.to_branch?.name || '-'}
                        </span>
                      </td>
                      <td>
                        {item.status === 'Selesai' ? (
                          <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                            <CheckCircle size={12} /> Selesai
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning d-inline-flex align-items-center gap-1">
                            <Clock size={12} /> Dalam Perjalanan
                          </span>
                        )}
                      </td>
                      <td className="small text-muted" style={{ maxWidth: '220px' }}>
                        <div className="text-truncate" title={item.notes || ''}>
                          {item.notes || '-'}
                        </div>
                      </td>
                      <td className="small text-muted">{item.user?.name || '-'}</td>
                      <td className="text-end px-4 text-nowrap">
                        <div className="d-flex justify-content-end gap-1">
                          {item.status === 'Dalam Perjalanan' && (
                            <button
                              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              onClick={() => handleConfirmArrival(item)}
                              title="Konfirmasi Barang Telah Tiba"
                            >
                              <CheckCircle size={14} /> Tiba
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-light border text-secondary"
                            onClick={() => handleViewDetail(item)}
                            title="Lihat Detail"
                          >
                            <Info size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form Pemindahan Barang */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle">
                      <ArrowRightLeft size={18} />
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">Form Pemindahan Barang Antar Outlet</h5>
                      <small className="text-muted">Mutasi inventaris peralatan dari satu cabang ke cabang lainnya.</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Pilih Equipment */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Pilih Equipment / Barang <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.equipment_id}
                        onChange={e => {
                          const eqId = e.target.value;
                          setFormData({ ...formData, equipment_id: eqId, to_branch_id: '' });
                        }}
                        required
                      >
                        <option value="">Pilih barang yang akan dipindahkan...</option>
                        {equipments.map((eq: any) => (
                          <option key={eq.id} value={eq.id}>
                            [{eq.code}] {eq.name} - Lokasi saat ini: {eq.branch?.name || 'Pusat'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Outlet Asal (Auto) */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Outlet Asal (Cabang Pengirim)</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={selectedEquipment?.branch ? `${selectedEquipment.branch.name} (${selectedEquipment.branch.city || ''})` : 'Pilih barang terlebih dahulu'}
                        disabled
                      />
                    </div>

                    {/* Outlet Tujuan */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Outlet Tujuan (Cabang Penerima) <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.to_branch_id}
                        onChange={e => setFormData({ ...formData, to_branch_id: e.target.value })}
                        disabled={!formData.equipment_id}
                        required
                      >
                        <option value="">Pilih outlet tujuan...</option>
                        {availableDestinationBranches.map((b: any) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.city || 'Kota'})
                          </option>
                        ))}
                      </select>
                      {selectedEquipment && availableDestinationBranches.length === 0 && (
                        <small className="text-danger">Tidak ada cabang lain yang tersedia.</small>
                      )}
                    </div>

                    {/* Tanggal Pemindahan */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Tanggal Pemindahan <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.movement_date}
                        onChange={e => setFormData({ ...formData, movement_date: e.target.value })}
                        required
                      />
                    </div>

                    {/* Status Pemindahan */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">Status Pengiriman</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Selesai">Selesai (Langsung Tiba & Beroperasi di Outlet Tujuan)</option>
                        <option value="Dalam Perjalanan">Dalam Perjalanan (Proses Kirim / Ekspedisi)</option>
                      </select>
                    </div>

                    {/* Lokasi Baru di Outlet Tujuan (Opsional) */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Ruangan / Lokasi Spesifik di Outlet Tujuan (Opsional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Misal: Dapur Utama, Bar Depan, Gudang Penyimpanan"
                        value={formData.new_location}
                        onChange={e => setFormData({ ...formData, new_location: e.target.value })}
                      />
                    </div>

                    {/* Catatan / Keterangan */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">Catatan / Keterangan Mutasi</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Misal: Nomor surat jalan pengiriman, nama kurir/driver, alasan mutasi peralatan antar cabang..."
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
                  <button type="button" className="btn btn-light border px-3" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4" disabled={formLoading}>
                    {formLoading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                    {formLoading ? 'Memproses...' : 'Proses Pemindahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Mutasi */}
      {showDetailModal && selectedMovement && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">Rincian Mutasi Equipment</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                    <ArrowRightLeft size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{selectedMovement.equipment?.name || '-'}</h6>
                    <span className="font-monospace text-muted small">{selectedMovement.equipment?.code || '-'}</span>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="text-muted small">Outlet Pengirim (Asal)</div>
                    <div className="fw-bold text-dark">{selectedMovement.from_branch?.name || '-'}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Outlet Penerima (Tujuan)</div>
                    <div className="fw-bold text-primary">{selectedMovement.to_branch?.name || '-'}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Tanggal Pemindahan</div>
                    <div className="fw-medium text-dark">{selectedMovement.movement_date}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Status</div>
                    <div>
                      {selectedMovement.status === 'Selesai' ? (
                        <span className="badge bg-success-subtle text-success">Selesai (Tiba)</span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning">Dalam Perjalanan</span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Petugas Pencatat</div>
                    <div className="fw-medium text-dark">{selectedMovement.user?.name || '-'} ({selectedMovement.user?.email || '-'})</div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Catatan / Keterangan</div>
                    <div className="p-2 bg-light rounded text-muted small" style={{ whiteSpace: 'pre-line' }}>
                      {selectedMovement.notes || 'Tidak ada catatan khusus.'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top px-4 py-2 bg-light rounded-bottom-4">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
