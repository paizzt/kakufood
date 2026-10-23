<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movement;
use App\Models\Equipment;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Movement::with(['equipment', 'fromBranch', 'toBranch', 'user'])->latest();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $query->where(function ($q) use ($user) {
                $q->where('from_branch_id', $user->branch_id)
                  ->orWhere('to_branch_id', $user->branch_id);
            });
        }

        $movements = $query->get();
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
        
        $user = $request->user();
        $equipment = Equipment::findOrFail($validated['equipment_id']);

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat memindahkan equipment di cabang Anda.'], 403);
        }

        $validated['from_branch_id'] = $equipment->branch_id;
        $validated['user_id'] = $user->id;
        $validated['status'] = 'Selesai';
        
        $movement = Movement::create($validated);
        
        // Update equipment branch
        $equipment->update(['branch_id' => $validated['to_branch_id']]);
        
        return response()->json(['data' => $movement], 201);
    }
}
