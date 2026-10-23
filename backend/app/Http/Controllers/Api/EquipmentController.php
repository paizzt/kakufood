<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Equipment::with(['branch', 'category'])->latest();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $query->where('branch_id', $user->branch_id);
        } elseif ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $equipments = $query->get();
        return response()->json(['data' => $equipments]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        if ($user && $user->role === 'staff' && $user->branch_id) {
            $data['branch_id'] = $user->branch_id;
        }

        $validator = Validator::make($data, [
            'code' => 'required|string|unique:equipment',
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'branch_id' => 'required|exists:branches,id',
            'condition' => 'required|string',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $equipment = new Equipment($data);
        $equipment->save();

        // Generate SHA-256 Hash for Data Integrity
        $hashString = $equipment->id . '|' . $equipment->code . '|' . ($equipment->purchase_date ?? 'null');
        $equipment->hash_value = hash('sha256', $hashString);
        $equipment->save();

        return response()->json([
            'message' => 'Equipment added successfully',
            'data' => $equipment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $equipment = Equipment::with(['branch', 'category', 'damageReports.reporter', 'maintenances.user'])->find($id);
        
        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat melihat equipment cabang Anda.'], 403);
        }

        // Fetch audit logs manually because relation is not explicitly defined in Model (module=equipment, record_id=$id)
        $auditLogs = \App\Models\AuditLog::with('user')
                        ->where('module', 'equipment')
                        ->where('record_id', $id)
                        ->latest()
                        ->get();
        
        // Verify Integrity
        $expectedHash = hash('sha256', $equipment->id . '|' . $equipment->code . '|' . ($equipment->purchase_date ?? 'null'));
        $is_integrity_valid = ($equipment->hash_value === $expectedHash);

        return response()->json([
            'data' => $equipment,
            'audit_logs' => $auditLogs,
            'integrity_valid' => $is_integrity_valid
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $equipment = Equipment::find($id);

        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        if ($user && $user->role === 'staff' && $equipment->branch_id != $user->branch_id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat memperbarui equipment cabang Anda.'], 403);
        }

        $data = $request->all();
        if ($user && $user->role === 'staff' && $user->branch_id) {
            $data['branch_id'] = $user->branch_id;
        }

        $validator = Validator::make($data, [
            'code' => 'required|string|unique:equipment,code,'.$id,
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'branch_id' => 'required|exists:branches,id',
            'condition' => 'required|string',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $equipment->fill($data);
        
        // Update hash value
        $hashString = $equipment->id . '|' . $equipment->code . '|' . ($equipment->purchase_date ?? 'null');
        $equipment->hash_value = hash('sha256', $hashString);
        
        $equipment->save();

        return response()->json([
            'message' => 'Equipment updated successfully',
            'data' => $equipment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        if ($user && $user->role === 'staff') {
            return response()->json(['message' => 'Staff tidak diizinkan menghapus data equipment.'], 403);
        }

        $equipment = Equipment::find($id);

        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        $equipment->delete();
        return response()->json(['message' => 'Equipment deleted successfully']);
    }
}
