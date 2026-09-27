<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Branch::all()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:branches|max:255',
            'name' => 'required|string|max:255',
        ]);

        $branch = Branch::create($request->all());
        return response()->json(['data' => $branch], 201);
    }
}
