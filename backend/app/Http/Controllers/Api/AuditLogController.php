<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::with('user')->latest()->get()->map(function ($log) {
            // Verify integrity
            $hashData = $log->id . '|' . $log->module . '|' . $log->action . '|' . $log->record_id . '|' . json_encode($log->old_data) . '|' . json_encode($log->new_data) . '|' . $log->created_at;
            $expectedHash = hash('sha256', $hashData);
            
            $log->is_integrity_valid = ($log->hash_value === $expectedHash);
            return $log;
        });

        return response()->json(['data' => $logs]);
    }

    public function show($module, $id)
    {
        $logs = AuditLog::where('module', $module)
            ->where('record_id', $id)
            ->latest()
            ->get();
            
        return response()->json(['data' => $logs]);
    }
}
