<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = AuditLog::with('user')->latest();

        if ($user && $user->role === 'staff') {
            $query->where('user_id', $user->id);
        }

        $logs = $query->get()->map(function ($log) {
            // Verify integrity
            $hashData = $log->id . '|' . $log->module . '|' . $log->action . '|' . $log->record_id . '|' . json_encode($log->old_data) . '|' . json_encode($log->new_data) . '|' . $log->created_at;
            $expectedHash = hash('sha256', $hashData);
            
            $log->is_integrity_valid = ($log->hash_value === $expectedHash);
            return $log;
        });

        return response()->json(['data' => $logs]);
    }

    public function show(Request $request, $module, $id)
    {
        $user = $request->user();
        $query = AuditLog::where('module', $module)
            ->where('record_id', $id)
            ->latest();

        if ($user && $user->role === 'staff') {
            $query->where('user_id', $user->id);
        }

        $logs = $query->get();
            
        return response()->json(['data' => $logs]);
    }
}
