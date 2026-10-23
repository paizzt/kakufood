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
        $user = $request->user();
        $isStaff = ($user && $user->role === 'staff' && $user->branch_id);
        $branchInfo = $isStaff ? Branch::find($user->branch_id) : null;

        $equipmentQuery = Equipment::query();
        if ($isStaff) {
            $equipmentQuery->where('branch_id', $user->branch_id);
        }

        // Total Equipment
        $totalEquipment = (clone $equipmentQuery)->count();
        $totalBranches = $isStaff ? 1 : Branch::count();

        // Condition stats
        $conditionStats = [
            'baik' => (clone $equipmentQuery)->where('condition', 'Baik')->count(),
            'rusak_ringan' => (clone $equipmentQuery)->where('condition', 'Rusak Ringan')->count(),
            'rusak_berat' => (clone $equipmentQuery)->where('condition', 'Rusak Berat')->count(),
        ];

        // Status stats
        $statusStats = [
            'aktif' => (clone $equipmentQuery)->where('status', 'Aktif')->count(),
            'perbaikan' => (clone $equipmentQuery)->where('status', 'Dalam Perbaikan')->count(),
            'hilang' => (clone $equipmentQuery)->where('status', 'Hilang')->count(),
        ];

        // Recent audit logs
        $logsQuery = \App\Models\AuditLog::with('user')->latest();
        if ($isStaff) {
            $logsQuery->where('user_id', $user->id);
        }
        $recentActivities = $logsQuery->take(5)->get();

        // Needs attention (Rusak Ringan, Rusak Berat)
        $attentionQuery = (clone $equipmentQuery)->with('branch')->whereIn('condition', ['Rusak Ringan', 'Rusak Berat'])->latest();
        $needsAttention = $attentionQuery->take(5)->get();

        return response()->json([
            'data' => [
                'total_equipment' => $totalEquipment,
                'total_branches' => $totalBranches,
                'conditions' => $conditionStats,
                'statuses' => $statusStats,
                'recent_activities' => $recentActivities,
                'needs_attention' => $needsAttention,
                'is_staff' => $isStaff,
                'branch' => $branchInfo,
            ]
        ]);
    }
}
