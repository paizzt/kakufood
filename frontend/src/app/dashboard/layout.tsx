'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = React.useState<{name: string, role: string} | null>(null);

  React.useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040, backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile transform */}
      <div 
        className={`position-fixed position-lg-static top-0 start-0 h-100 shadow-sm transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-100'} translate-lg-x-0`}
        style={{ zIndex: 1050, width: '260px', backgroundColor: '#ffffff', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-grow-1 overflow-auto w-100 d-flex flex-column" style={{ transition: 'margin-left 0.3s ease' }}>
        <header className="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 1030 }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-lg-none p-2 border-0 rounded-circle d-flex align-items-center justify-content-center" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-sm-block">Kaku Food System</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <div 
                className="position-relative cursor-pointer p-2 rounded-circle bg-light text-primary hover-maroon" 
                onClick={() => setNotifOpen(!isNotifOpen)}
              >
                <Bell size={20} />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </div>
              
              {isNotifOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1035 }} onClick={() => setNotifOpen(false)} />
                  <div className="position-absolute bg-white rounded-3 shadow-lg border mt-2" style={{ width: '320px', right: 0, zIndex: 1040 }}>
                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-3">
                      <h6 className="mb-0 fw-bold">Notifikasi</h6>
                      <span className="badge bg-danger rounded-pill">Baru</span>
                    </div>
                    <div className="p-0">
                      <Link href="/dashboard/reports" className="d-block p-3 border-bottom text-decoration-none hover-light transition-all" onClick={() => setNotifOpen(false)}>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold small text-danger">Laporan Baru</span>
                          <span className="text-muted" style={{ fontSize: '10px' }}>Baru saja</span>
                        </div>
                        <div className="text-muted small">Cek peralatan yang dilaporkan rusak hari ini untuk segera ditangani.</div>
                      </Link>
                      <Link href="/dashboard/monitoring" className="d-block p-3 border-bottom text-decoration-none hover-light transition-all" onClick={() => setNotifOpen(false)}>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold small text-warning">Perlu Perhatian</span>
                          <span className="text-muted" style={{ fontSize: '10px' }}>1 jam lalu</span>
                        </div>
                        <div className="text-muted small">Beberapa alat berstatus "Rusak Ringan" memerlukan tindakan maintenance.</div>
                      </Link>
                    </div>
                    <div className="p-2 text-center bg-light rounded-bottom-3">
                      <Link href="/dashboard/reports" className="text-primary text-decoration-none small fw-bold" onClick={() => setNotifOpen(false)}>
                        Lihat Semua
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="d-none d-md-flex align-items-center gap-2 border-start ps-3 ms-2">
              <div className="text-end">
                <div className="fw-semibold small text-dark" style={{ lineHeight: '1.2' }}>{user?.name || 'Loading...'}</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{user?.role || 'Admin'}</div>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="" width="36" height="36" className="rounded-circle border" />
            </div>
          </div>
        </header>
        <main className="p-4 p-md-5 mx-auto w-100" style={{ maxWidth: '1400px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
