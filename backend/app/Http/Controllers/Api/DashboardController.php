<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Branch;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Total Equipment
        $totalEquipment = Equipment::count();
        $totalBranches = Branch::count();

        // Condition stats
        $conditionStats = [
            'baik' => Equipment::where('condition', 'Baik')->count(),
            'rusak_ringan' => Equipment::where('condition', 'Rusak Ringan')->count(),
            'rusak_berat' => Equipment::where('condition', 'Rusak Berat')->count(),
        ];

        // Status stats
        $statusStats = [
            'aktif' => Equipment::where('status', 'Aktif')->count(),
            'perbaikan' => Equipment::where('status', 'Dalam Perbaikan')->count(),
            'hilang' => Equipment::where('status', 'Hilang')->count(),
        ];

        // Recent audit logs
        $recentActivities = \App\Models\AuditLog::with('user')->latest()->take(5)->get();

        // Needs attention (Rusak Ringan, Rusak Berat)
        $needsAttention = Equipment::with('branch')->whereIn('condition', ['Rusak Ringan', 'Rusak Berat'])->latest()->take(5)->get();

        return response()->json([
            'data' => [
                'total_equipment' => $totalEquipment,
                'total_branches' => $totalBranches,
                'conditions' => $conditionStats,
                'statuses' => $statusStats,
                'recent_activities' => $recentActivities,
                'needs_attention' => $needsAttention,
            ]
        ]);
    }
}
