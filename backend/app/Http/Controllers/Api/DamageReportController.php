<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Equipment;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    public function index()
    {
        $reports = DamageReport::with(['equipment.branch', 'reporter'])->latest()->get();
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

        $validated['reporter_id'] = $request->user()->id;
        $validated['status'] = 'Baru';

        $report = DamageReport::create($validated);
        
        // Auto update equipment condition
        $equipment = Equipment::find($validated['equipment_id']);
        if ($equipment && $validated['severity'] === 'Rusak Berat') {
            $equipment->update(['condition' => 'Rusak Berat', 'status' => 'Tidak Digunakan']);
        } elseif ($equipment && $validated['severity'] === 'Rusak Ringan') {
            $equipment->update(['condition' => 'Rusak Ringan']);
        }

        return response()->json(['data' => $report], 201);
    }

    public function show(string $id)
    {
        $report = DamageReport::with(['equipment.branch', 'reporter'])->findOrFail($id);
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
