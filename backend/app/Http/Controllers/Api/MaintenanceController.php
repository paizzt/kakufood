<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index()
    {
        $maintenances = Maintenance::with(['equipment.branch', 'user'])->latest()->get();
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

        $validated['user_id'] = $request->user()->id;

        $maintenance = Maintenance::create($validated);

        return response()->json(['data' => $maintenance], 201);
    }
}
