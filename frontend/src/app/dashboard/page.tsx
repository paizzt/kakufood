import React from 'react';
import DashboardStats from '@/components/DashboardStats';
import { ShieldCheck, PlusCircle, Edit, Trash2, FileText, Bell } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, { 
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (res.status === 401) {
      return { redirect: true };
    }
    
    if (!res.ok) throw new Error('Failed to fetch data');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (data?.redirect) {
    redirect('/logout');
  }

  if (!data) {
    return (
      <div className="text-center py-5">
        <h4>Gagal memuat data dashboard.</h4>
      </div>
    );
  }

  const getActionName = (action: string) => {
    switch(action) {
      case 'create': return 'Equipment Ditambahkan';
      case 'update': return 'Equipment Diperbarui';
      case 'delete': return 'Equipment Dihapus';
      default: return 'Aktivitas Tercatat';
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'Rusak Ringan': return 'warning';
      case 'Rusak Berat': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold mb-1">Monitoring Inventaris</h2>
          <p className="text-muted mb-0">Overview status equipment dan aktivitas terbaru Kaku Food.</p>
        </div>
        <div className="d-flex align-items-center gap-2 text-primary bg-primary bg-opacity-10 px-3 py-2 rounded">
          <ShieldCheck size={18} />
          <span className="fw-medium">Data Integrity: Valid</span>
        </div>
      </div>

      <DashboardStats stats={data} />

      <div className="row g-4">
        {/* Aktivitas Terbaru */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">Aktivitas Terbaru</h6>
              <Link href="/dashboard/audit-logs" className="btn btn-sm btn-link text-decoration-none">Lihat Semua</Link>
            </div>
            <div className="card-body">
              {data.recent_activities && data.recent_activities.length > 0 ? (
                data.recent_activities.map((log: any, index: number) => {
                  const isLast = index === data.recent_activities.length - 1;
                  const color = log.action === 'create' ? 'success' : log.action === 'update' ? 'warning' : 'danger';
                  return (
                    <div className={`d-flex gap-3 mb-3 ${!isLast ? 'pb-3 border-bottom' : ''}`} key={log.id}>
                      <div className={`bg-${color} bg-opacity-10 text-${color} p-2 rounded d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                        {log.action === 'create' ? <PlusCircle size={20} /> : log.action === 'update' ? <Edit size={20} /> : log.action === 'delete' ? <Trash2 size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <h6 className="mb-1">{getActionName(log.action)}: ID #{log.record_id}</h6>
                        <p className="text-muted small mb-0">
                          Oleh {log.user?.name || 'Sistem'} - {new Date(log.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted small py-3">Tidak ada aktivitas terbaru hari ini. Aktivitas seperti penambahan atau pembaruan equipment akan muncul di sini.</div>
              )}
            </div>
          </div>
        </div>

        {/* Perlu Perhatian */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 border-top border-warning border-3">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 text-warning d-flex align-items-center gap-2">
                <Bell size={18} /> Perlu Perhatian
              </h6>
            </div>
            <div className="card-body">
              {data.needs_attention && data.needs_attention.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {data.needs_attention.map((item: any) => (
                    <li className="list-group-item px-0 border-bottom-0 mb-2" key={item.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Link href={`/dashboard/equipment/${item.id}`} className="d-block text-dark fw-bold text-decoration-none hover-primary">
                            {item.code}
                          </Link>
                          <span className="text-muted small">{item.name} ({item.branch?.name || '-'})</span>
                        </div>
                        <span className={`badge bg-${getConditionColor(item.condition)} rounded-pill`}>
                          {item.condition}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted small text-center py-4">
    <div className="mb-1 fw-medium text-success">Semua Normal</div>
    Tidak ada peralatan yang memerlukan perhatian khusus saat ini.
  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
