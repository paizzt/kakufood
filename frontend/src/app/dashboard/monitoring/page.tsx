'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function MonitoringPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/maintenances', {
      headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    })
    .then(res => res.json())
    .then(res => { setData(res.data || []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="fs-4 fw-bold mb-1">Monitoring (Perawatan)</h2>
      <p className="text-muted mb-4">Daftar riwayat perawatan peralatan.</p>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="text-muted border-bottom">
                <tr>
                  <th className="px-4 py-3 font-weight-medium">Equipment</th>
                  <th className="px-4 py-3 font-weight-medium">Tipe Perawatan</th>
                  <th className="px-4 py-3 font-weight-medium">Tanggal</th>
                  <th className="px-4 py-3 font-weight-medium">Teknisi</th>
                  <th className="px-4 py-3 font-weight-medium">Biaya</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-5">
    <div className="text-muted mb-2">Belum ada riwayat perawatan peralatan.</div>
    <small className="text-muted">Perawatan akan tercatat di sini setelah teknisi menyelesaikan tugasnya.</small>
  </td></tr>
                ) : data.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3"><strong>{item.equipment?.code}</strong><br/><small className="text-muted">{item.equipment?.name}</small></td>
                    <td className="px-4 py-3">{item.maintenance_type}</td>
                    <td className="px-4 py-3">{item.maintenance_date}</td>
                    <td className="px-4 py-3">{item.technician}</td>
                    <td className="px-4 py-3">Rp {item.cost?.toLocaleString() || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
