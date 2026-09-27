'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LayoutDashboard, Box, Settings, LogOut, PackagePlus, AlertTriangle, PenTool, GitCompare } from 'lucide-react';

import { X } from 'lucide-react';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<{name: string, role: string} | null>(null);

  React.useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {}
    }
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {}
    
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Peralatan', href: '/dashboard/equipment', icon: Box },
    { name: 'Tambah', href: '/dashboard/equipment/add', icon: PackagePlus },
    { name: 'Monitoring', href: '/dashboard/monitoring', icon: AlertTriangle },
    { name: 'Laporan', href: '/dashboard/reports', icon: PenTool },
    { name: 'Perpindahan', href: '/dashboard/movements', icon: GitCompare },
    { name: 'Audit', href: '/dashboard/audit-logs', icon: AlertTriangle },
    { name: 'Kategori', href: '/dashboard/categories', icon: Box },
    { name: 'Cabang', href: '/dashboard/branches', icon: GitCompare },
    { name: 'Pengguna', href: '/dashboard/users', icon: Settings },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end shadow-sm h-100 overflow-y-auto custom-scrollbar" style={{ width: '250px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0 w-100 px-2">
        <Link href="/dashboard" className="text-decoration-none d-flex align-items-center justify-content-center flex-grow-1">
          <img src="/logo.jpg" alt="Kaku Food Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        {onClose && (
          <button className="btn btn-light d-lg-none p-1 border-0 rounded-circle" onClick={onClose}>
            <X size={20} className="text-muted" />
          </button>
        )}
      </div>

      <hr />
      <ul className="nav nav-pills flex-column mb-auto gap-2 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li className="nav-item" key={item.name}>
              <Link
                href={item.href}
                className={`nav-link d-flex py-2 px-3 rounded-3 align-items-center gap-2 ${isActive ? 'active' : 'text-dark'}`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <div className="mt-auto pt-3 d-flex flex-column gap-2 px-2">
        <button 
          onClick={handleLogout} 
          className="btn btn-light text-danger w-100 d-flex align-items-center justify-content-start gap-2 border"
          style={{ fontSize: '14px' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
