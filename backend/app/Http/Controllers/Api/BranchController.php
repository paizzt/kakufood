<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user && $user->role === 'staff' && $user->branch_id) {
            $branches = Branch::where('id', $user->branch_id)->get();
        } else {
            $branches = Branch::all();
        }
        return response()->json(['data' => $branches]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Hanya kepala cabang / admin yang dapat menambah cabang.'], 403);
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:branches,code|max:255',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'manager' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $branch = Branch::create($validated);
        return response()->json(['data' => $branch], 201);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        if ($user && $user->role === 'staff' && $user->branch_id != $id) {
            return response()->json(['message' => 'Akses ditolak. Anda hanya dapat melihat cabang Anda.'], 403);
        }

        $branch = Branch::findOrFail($id);
        return response()->json(['data' => $branch]);
    }

    public function update(Request $request, string $id)
    {
        $user = $request->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Hanya kepala cabang / admin yang dapat memperbarui cabang.'], 403);
        }

        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:branches,code,' . $id,
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'manager' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $branch->update($validated);
        return response()->json(['data' => $branch]);
    }

    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['message' => 'Hanya kepala cabang / admin yang dapat menghapus cabang.'], 403);
        }

        $branch = Branch::findOrFail($id);
        $branch->delete();
        return response()->json(['message' => 'Cabang berhasil dihapus']);
    }
}
