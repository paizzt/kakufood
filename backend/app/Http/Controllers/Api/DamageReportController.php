<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Equipment;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = DamageReport::with(['equipment.branch', 'reporter'])->latest();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $query->whereHas('equipment', function ($q) use ($user) {
                $q->where('branch_id', $user->branch_id);
            });
        }

        $reports = $query->get();
        return response()->json(['data' => $reports]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'damage_type' => 'required|string',
            'severity' => 'required|in:Rusak Ringan,Rusak Berat',
            'description' => 'required|string',
        ]);

        $user = $request->user();
        $equipment = Equipment::findOrFail($validated['equipment_id']);

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat melaporkan kerusakan equipment di cabang Anda.'], 403);
        }

        $validated['reporter_id'] = $user->id;
        $validated['status'] = 'Baru';

        $report = DamageReport::create($validated);
        
        // Auto update equipment condition
        if ($validated['severity'] === 'Rusak Berat') {
            $equipment->update(['condition' => 'Rusak Berat', 'status' => 'Tidak Digunakan']);
        } elseif ($validated['severity'] === 'Rusak Ringan') {
            $equipment->update(['condition' => 'Rusak Ringan']);
        }

        return response()->json(['data' => $report], 201);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $report = DamageReport::with(['equipment.branch', 'reporter'])->findOrFail($id);

        if ($user && $user->role === 'staff' && $report->equipment && $report->equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat melihat laporan equipment cabang Anda.'], 403);
        }

        return response()->json(['data' => $report]);
    }

    public function update(Request $request, string $id)
    {
        $report = DamageReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:Baru,Diverifikasi,Dalam Perbaikan,Selesai,Ditolak',
            'admin_notes' => 'nullable|string',
        ]);

        if ($validated['status'] === 'Selesai' && $report->status !== 'Selesai') {
            $validated['resolved_at'] = now();
            // Restore equipment condition
            $equipment = Equipment::find($report->equipment_id);
            if ($equipment) {
                $equipment->update(['condition' => 'Baik', 'status' => 'Aktif']);
            }
        }

        $report->update($validated);

        return response()->json(['data' => $report]);
    }
}
