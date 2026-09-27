import React from 'react';
import { Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getAuditLogs() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit-logs`, { 
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  const getActionBadge = (action: string) => {
    switch(action) {
      case 'create': return 'bg-success';
      case 'update': return 'bg-warning text-dark';
      case 'delete': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fs-4 fw-bold mb-1">Log Audit Trail (Keamanan)</h2>
        <p className="text-muted">Semua aktivitas kritikal dalam sistem direkam dengan teknologi Hashing SHA-256 untuk menjamin integritas data dan mendeteksi manipulasi ilegal.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Waktu</th>
                  <th>Modul</th>
                  <th>Aksi</th>
                  <th>ID Record</th>
                  <th>User / Pelaku</th>
                  <th>Alamat IP</th>
                  <th>Integritas Log</th>
                  <th className="text-end px-4">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">Belum ada aktivitas.</td>
                  </tr>
                ) : (
                  logs.map((log: any) => (
                    <tr key={log.id}>
                      <td className="px-4 text-nowrap">
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <Clock size={14} />
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="text-capitalize fw-medium">{log.module}</td>
                      <td>
                        <span className={`badge ${getActionBadge(log.action)}`}>
                          {log.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="font-monospace">#{log.record_id}</td>
                      <td>{log.user?.name || 'Sistem'}</td>
                      <td className="font-monospace small text-muted">{log.ip_address || '-'}</td>
                      <td>
                        {log.is_integrity_valid ? (
                          <span className="badge bg-success-subtle text-success border border-success px-2 py-1 d-inline-flex align-items-center gap-1" title={log.hash_value}>
                            <ShieldCheck size={14} /> SHA-256 Valid
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1 d-inline-flex align-items-center gap-1" title="Manipulasi Terdeteksi!">
                            <ShieldAlert size={14} /> INVALID
                          </span>
                        )}
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target={`#modal-${log.id}`}>
                          Lihat Data
                        </button>

                        {/* Modal to view diff */}
                        <div className="modal fade text-start" id={`modal-${log.id}`} tabIndex={-1} aria-hidden="true">
                          <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Detail Log #{log.id}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body bg-light">
                                <div className="row g-3">
                                  <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0">
                                      <div className="card-header bg-white fw-bold text-danger">Data Lama (Before)</div>
                                      <div className="card-body p-0">
                                        <pre className="p-3 mb-0 text-secondary" style={{fontSize: '13px'}}>
                                          {log.old_data ? JSON.stringify(log.old_data, null, 2) : 'Tidak ada data lama.'}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0">
                                      <div className="card-header bg-white fw-bold text-success">Data Baru (After)</div>
                                      <div className="card-body p-0">
                                        <pre className="p-3 mb-0 text-dark fw-medium" style={{fontSize: '13px'}}>
                                          {log.new_data ? JSON.stringify(log.new_data, null, 2) : 'Tidak ada data baru.'}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 text-center">
                                  <div className="small text-muted font-monospace text-break">
                                    <ShieldCheck size={14} className="me-1" />
                                    Hash Signature: {log.hash_value}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
    </div>
  );
}
