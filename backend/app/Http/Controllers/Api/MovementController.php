<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movement;
use App\Models\Equipment;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Movement::with(['equipment.category', 'fromBranch', 'toBranch', 'user'])->latest();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $query->where(function ($q) use ($user) {
                $q->where('from_branch_id', $user->branch_id)
                  ->orWhere('to_branch_id', $user->branch_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('equipment', function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
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
            'status' => 'nullable|in:Dalam Perjalanan,Selesai',
            'notes' => 'nullable|string',
            'new_location' => 'nullable|string|max:255',
        ]);
        
        $user = $request->user();
        $equipment = Equipment::with('branch')->findOrFail($validated['equipment_id']);

        if ($validated['to_branch_id'] == $equipment->branch_id) {
            return response()->json([
                'message' => 'Cabang tujuan tidak boleh sama dengan cabang asal saat ini.'
            ], 422);
        }

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json([
                'message' => 'Akses ditolak. Anda hanya dapat memindahkan equipment di cabang Anda.'
            ], 403);
        }

        $status = $request->input('status', 'Selesai');
        $fromBranchId = $equipment->branch_id;

        $validated['from_branch_id'] = $fromBranchId;
        $validated['user_id'] = $user->id;
        $validated['status'] = $status;
        
        $movement = Movement::create($validated);
        
        // Update equipment status / branch
        if ($status === 'Selesai') {
            $updateData = [
                'branch_id' => $validated['to_branch_id'],
                'status' => 'Aktif',
            ];
            if ($request->filled('new_location')) {
                $updateData['location'] = $request->new_location;
            }
            $equipment->update($updateData);
        } else {
            $equipment->update(['status' => 'Dipindahkan']);
        }

        // Record Audit Log
        $log = AuditLog::create([
            'user_id' => $user->id,
            'module' => 'movements',
            'action' => 'create',
            'record_id' => $movement->id,
            'old_data' => json_encode(['branch_id' => $fromBranchId, 'branch_name' => $equipment->branch?->name]),
            'new_data' => json_encode(['branch_id' => $validated['to_branch_id'], 'movement_id' => $movement->id, 'status' => $status]),
            'ip_address' => $request->ip() ?? '127.0.0.1'
        ]);
        $log->hash_value = hash('sha256', $log->id . '|' . $log->action . '|' . $log->record_id);
        $log->save();
        
        $movement->load(['equipment.category', 'fromBranch', 'toBranch', 'user']);
        return response()->json([
            'message' => 'Perpindahan equipment berhasil dicatat.',
            'data' => $movement
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $movement = Movement::with(['equipment.category', 'fromBranch', 'toBranch', 'user'])->findOrFail($id);

        if ($user && $user->role === 'staff' && $user->branch_id) {
            if ($movement->from_branch_id != $user->branch_id && $movement->to_branch_id != $user->branch_id) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }
        }

        return response()->json(['data' => $movement]);
    }

    public function update(Request $request, string $id)
    {
        $movement = Movement::with('equipment')->findOrFail($id);
        $user = $request->user();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            if ($movement->to_branch_id != $user->branch_id && $movement->from_branch_id != $user->branch_id) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }
        }

        $validated = $request->validate([
            'status' => 'required|in:Dalam Perjalanan,Selesai',
            'notes' => 'nullable|string',
            'new_location' => 'nullable|string|max:255',
        ]);

        if ($validated['status'] === 'Selesai' && $movement->status !== 'Selesai') {
            $equipment = Equipment::find($movement->equipment_id);
            if ($equipment) {
                $updateData = [
                    'branch_id' => $movement->to_branch_id,
                    'status' => 'Aktif',
                ];
                if ($request->filled('new_location')) {
                    $updateData['location'] = $request->new_location;
                }
                $equipment->update($updateData);
            }
        }

        $movement->update($validated);

        // Record Audit Log
        $log = AuditLog::create([
            'user_id' => $user->id,
            'module' => 'movements',
            'action' => 'update',
            'record_id' => $movement->id,
            'old_data' => json_encode(['status' => $movement->getOriginal('status')]),
            'new_data' => json_encode(['status' => $validated['status']]),
            'ip_address' => $request->ip() ?? '127.0.0.1'
        ]);
        $log->hash_value = hash('sha256', $log->id . '|' . $log->action . '|' . $log->record_id);
        $log->save();

        $movement->load(['equipment.category', 'fromBranch', 'toBranch', 'user']);
        return response()->json([
            'message' => 'Status perpindahan equipment berhasil diperbarui.',
            'data' => $movement
        ]);
    }
}
