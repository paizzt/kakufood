import React from 'react';
import { Box, CheckCircle, AlertTriangle, XOctagon, PenTool, GitBranch, Bell } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'info';
}

function StatCard({ title, value, icon: Icon, variant = 'primary' }: StatCardProps) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex align-items-center">
        <div className={`flex-shrink-0 bg-primary bg-opacity-10 text-primary rounded p-3 me-3`}>
          <Icon size={24} />
        </div>
        <div>
          <h6 className="card-title text-muted mb-1 fs-6">{title}</h6>
          <h2 className="mb-0 fw-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats({ stats }: { stats: any }) {
  if (!stats) return null;
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Total Equipment" value={stats.total_equipment || 0} icon={Box} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Equipment Baik" value={stats.conditions?.baik || 0} icon={CheckCircle} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Rusak Ringan" value={stats.conditions?.rusak_ringan || 0} icon={AlertTriangle} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Rusak Berat" value={stats.conditions?.rusak_berat || 0} icon={XOctagon} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Dalam Perbaikan" value={stats.statuses?.perbaikan || 0} icon={PenTool} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Equipment Hilang" value={stats.statuses?.hilang || 0} icon={AlertTriangle} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Total Cabang" value={stats.total_branches || 0} icon={GitBranch} variant="primary" />
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard title="Aktif Beroperasi" value={stats.statuses?.aktif || 0} icon={CheckCircle} variant="primary" />
      </div>
    </div>
  );
}
