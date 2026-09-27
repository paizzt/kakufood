<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Movement;
use App\Models\Equipment;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    public function index()
    {
        $movements = Movement::with(['equipment', 'fromBranch', 'toBranch', 'user'])->latest()->get();
        return response()->json(['data' => $movements]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'to_branch_id' => 'required|exists:branches,id',
            'movement_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);
        
        $equipment = Equipment::findOrFail($validated['equipment_id']);
        $validated['from_branch_id'] = $equipment->branch_id;
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'Selesai';
        
        $movement = Movement::create($validated);
        
        // Update equipment branch
        $equipment->update(['branch_id' => $validated['to_branch_id']]);
        
        return response()->json(['data' => $movement], 201);
    }
}
