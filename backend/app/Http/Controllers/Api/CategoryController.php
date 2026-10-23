<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Category::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category = Category::create($validated);
        return response()->json(['data' => $category], 201);
    }

    public function show(string $id)
    {
        $category = Category::findOrFail($id);
        return response()->json(['data' => $category]);
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category->update($validated);
        return response()->json(['data' => $category]);
    }

    public function destroy(string $id)
    {
        return response()->json([
            'message' => 'Kategori peralatan tidak dapat dihapus untuk menjaga integritas data.'
        ], 403);
    }
}
