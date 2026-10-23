<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Equipment;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Maintenance::with(['equipment.branch', 'user'])->latest();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $query->whereHas('equipment', function ($q) use ($user) {
                $q->where('branch_id', $user->branch_id);
            });
        }

        $maintenances = $query->get();
        return response()->json(['data' => $maintenances]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'maintenance_type' => 'required|string',
            'maintenance_date' => 'required|date',
            'technician' => 'required|string',
            'description' => 'required|string',
            'cost' => 'nullable|numeric',
            'condition_before' => 'nullable|string',
            'condition_after' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $equipment = Equipment::findOrFail($validated['equipment_id']);

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat mencatat perawatan equipment di cabang Anda.'], 403);
        }

        $validated['user_id'] = $user->id;

        $maintenance = Maintenance::create($validated);

        return response()->json(['data' => $maintenance], 201);
    }
}
