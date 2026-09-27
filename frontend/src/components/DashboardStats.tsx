import React from 'react';
import { Box, CheckCircle, AlertTriangle, XOctagon, PenTool, GitBranch, Bell } from 'lucide-react';

import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'info';
  href?: string;
}

function StatCard({ title, value, icon: Icon, variant = 'primary', href }: StatCardProps) {
  const cardContent = (
    <div className={`card h-100 border-0 shadow-sm ${href ? 'hover-primary cursor-pointer' : ''}`} style={{ transition: 'all 0.2s' }} onMouseEnter={(e) => href && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => href && (e.currentTarget.style.transform = 'translateY(0)')}>
      <div className="card-body d-flex align-items-center">
        <div className={`flex-shrink-0 bg-primary bg-opacity-10 text-primary rounded p-3 me-3`}>
          <Icon size={24} />
        </div>
        <div>
          <h6 className="card-title text-muted mb-1 fs-6">{title}</h6>
          <h2 className="mb-0 fw-bold text-dark">{value}</h2>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="text-decoration-none text-dark d-block h-100">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default function DashboardStats({ stats }: { stats: any }) {
  if (!stats) return null;
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Total Equipment" value={stats.total_equipment || 0} icon={Box} variant="primary" href="/dashboard/equipment" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Equipment Baik" value={stats.conditions?.baik || 0} icon={CheckCircle} variant="primary" href="/dashboard/equipment?condition=Baik" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Rusak Ringan" value={stats.conditions?.rusak_ringan || 0} icon={AlertTriangle} variant="primary" href="/dashboard/equipment?condition=Rusak+Ringan" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Rusak Berat" value={stats.conditions?.rusak_berat || 0} icon={XOctagon} variant="primary" href="/dashboard/equipment?condition=Rusak+Berat" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Dalam Perbaikan" value={stats.statuses?.perbaikan || 0} icon={PenTool} variant="primary" href="/dashboard/equipment?status=Dalam+Perbaikan" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Equipment Hilang" value={stats.statuses?.hilang || 0} icon={AlertTriangle} variant="primary" href="/dashboard/equipment?status=Hilang" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Total Cabang" value={stats.total_branches || 0} icon={GitBranch} variant="primary" href="/dashboard/branches" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Aktif Beroperasi" value={stats.statuses?.aktif || 0} icon={CheckCircle} variant="primary" href="/dashboard/equipment?status=Aktif" />
      </div>
    </div>
  );
}
