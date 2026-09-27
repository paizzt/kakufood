'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { ArrowLeft, Edit, Trash2, ShieldCheck, ShieldAlert, Clock, AlertTriangle, PenTool } from 'lucide-react';

export default function DetailEquipmentPage() {
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [integrityValid, setIntegrityValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('informasi');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (res.status === 401) {
          window.location.href = '/logout';
          return;
        }
        
        if (!res.ok) throw new Error('Failed to fetch data');
        const result = await res.json();
        
        setData(result.data);
        setAuditLogs(result.audit_logs || []);
        setIntegrityValid(result.integrity_valid);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Memuat detail equipment...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-5">
        <h3 className="text-danger">Equipment Tidak Ditemukan</h3>
        <Link href="/dashboard/equipment" className="btn btn-outline-primary mt-3">Kembali ke Daftar</Link>
      </div>
    );
  }

  const item = data;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold mb-1">Detail Equipment</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted font-monospace">{item.code}</span>
            {integrityValid ? (
              <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                <ShieldCheck size={14} /> Data Valid
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger d-flex align-items-center gap-1">
                <ShieldAlert size={14} /> Data Dimanipulasi
              </span>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link href="/dashboard/equipment" className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <ArrowLeft size={18} /> Kembali
          </Link>
          <Link href={`/dashboard/equipment/${item.id}/edit`} className="btn btn-outline-primary d-flex align-items-center gap-2">
            <Edit size={18} /> Edit
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs px-3 pt-3 border-bottom-0">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'informasi' ? 'active fw-bold' : 'text-muted'}`} onClick={() => setActiveTab('informasi')}>Informasi</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'kerusakan' ? 'active fw-bold' : 'text-muted'}`} onClick={() => setActiveTab('kerusakan')}>Laporan</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'pemeliharaan' ? 'active fw-bold' : 'text-muted'}`} onClick={() => setActiveTab('pemeliharaan')}>Pemeliharaan</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'riwayat' ? 'active fw-bold' : 'text-muted'}`} onClick={() => setActiveTab('riwayat')}>Riwayat</button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'informasi' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-light rounded mb-3 d-flex align-items-center justify-content-center mx-auto" style={{ width: '200px', height: '200px' }}>
                  <span className="text-muted">Tidak ada foto</span>
                </div>
                <h5 className="fw-bold mb-1">{item.name}</h5>
                <p className="text-muted mb-3">{item.category?.name || '-'}</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <span className="badge bg-primary">{item.status}</span>
                  <span className="badge bg-success">{item.condition}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="fw-bold mb-3 border-bottom pb-2">Spesifikasi & Lokasi</h6>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Kode Equipment</div>
                  <div className="col-sm-8 fw-medium font-monospace">{item.code}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Cabang</div>
                  <div className="col-sm-8 fw-medium">{item.branch?.name || '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Ruangan / Lokasi</div>
                  <div className="col-sm-8">{item.location || '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Penanggung Jawab</div>
                  <div className="col-sm-8">{item.person_in_charge || '-'}</div>
                </div>
                
                <h6 className="fw-bold mb-3 border-bottom pb-2 mt-4">Informasi Pengadaan</h6>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Tanggal Pembelian</div>
                  <div className="col-sm-8">{item.purchase_date || '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted small">Harga Perolehan</div>
                  <div className="col-sm-8">Rp {Number(item.purchase_price).toLocaleString('id-ID')}</div>
                </div>
                
                <h6 className="fw-bold mb-3 border-bottom pb-2 mt-4">Catatan Tambahan</h6>
                <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-line' }}>{item.description || 'Tidak ada catatan.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kerusakan' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0">Riwayat Laporan</h6>
              <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2">
                <AlertTriangle size={16} /> Buat Laporan Baru
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Tanggal Lapor</th>
                    <th>Pelapor</th>
                    <th>Jenis Kerusakan</th>
                    <th>Tingkat</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {item.damage_reports?.length > 0 ? (
                    item.damage_reports.map((report: any) => (
                      <tr key={report.id}>
                        <td>{new Date(report.reported_at).toLocaleDateString('id-ID')}</td>
                        <td>{report.reporter?.name || '-'}</td>
                        <td>{report.damage_type}</td>
                        <td>
                          <span className={`badge ${report.severity === 'Rusak Berat' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {report.severity}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{report.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">Belum ada laporan kerusakan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pemeliharaan' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0">Riwayat Pemeliharaan & Servis</h6>
              <button className="btn btn-sm btn-outline-info d-flex align-items-center gap-2">
                <PenTool size={16} /> Catat Servis Baru
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Tanggal Servis</th>
                    <th>Jenis</th>
                    <th>Teknisi</th>
                    <th>Deskripsi Pekerjaan</th>
                    <th>Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {item.maintenances?.length > 0 ? (
                    item.maintenances.map((mnt: any) => (
                      <tr key={mnt.id}>
                        <td>{new Date(mnt.maintenance_date).toLocaleDateString('id-ID')}</td>
                        <td>{mnt.maintenance_type}</td>
                        <td>{mnt.technician}</td>
                        <td>{mnt.description}</td>
                        <td>Rp {Number(mnt.cost).toLocaleString('id-ID')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">Belum ada riwayat servis/pemeliharaan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th>Aksi</th>
                    <th>User</th>
                    <th>Integritas</th>
                    <th className="text-end px-4">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <tr key={log.id}>
                        <td className="px-4 text-nowrap">
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <Clock size={14} /> {new Date(log.created_at).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${log.action === 'create' ? 'bg-success' : log.action === 'update' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {log.action.toUpperCase()}
                          </span>
                        </td>
                        <td>{log.user?.name || 'Sistem'}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success px-2 py-1 d-inline-flex align-items-center gap-1">
                            <ShieldCheck size={14} /> SHA-256 Valid
                          </span>
                        </td>
                        <td className="text-end px-4 font-monospace small text-muted" title={log.hash_value}>
                          {log.hash_value.substring(0, 16)}...
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">Belum ada aktivitas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
