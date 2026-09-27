'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function MovementsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/movements', {
      headers: { 'Authorization': 'Bearer ' + Cookies.get('token') }
    })
    .then(res => res.json())
    .then(res => { setData(res.data || []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="fs-4 fw-bold mb-1">Perpindahan Equipment</h2>
      <p className="text-muted mb-4">Riwayat perpindahan peralatan antar cabang.</p>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="text-muted border-bottom">
                <tr>
                  <th className="px-4 py-3 font-weight-medium">Tanggal</th>
                  <th className="px-4 py-3 font-weight-medium">Equipment</th>
                  <th className="px-4 py-3 font-weight-medium">Dari Cabang</th>
                  <th className="px-4 py-3 font-weight-medium">Ke Cabang</th>
                  <th className="px-4 py-3 font-weight-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-5">
    <div className="text-muted mb-2">Belum ada aktivitas perpindahan cabang.</div>
    <small className="text-muted">Perpindahan peralatan antar cabang akan dilacak pada halaman ini.</small>
  </td></tr>
                ) : data.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.movement_date}</td>
                    <td className="px-4 py-3"><strong>{item.equipment?.code}</strong></td>
                    <td className="px-4 py-3">{item.from_branch?.name || '-'}</td>
                    <td className="px-4 py-3">{item.to_branch?.name}</td>
                    <td className="px-4 py-3"><span className="badge bg-success">{item.status}</span></td>
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
