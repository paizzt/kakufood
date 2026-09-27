<?php

namespace App\Observers;

use App\Models\Equipment;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

class EquipmentObserver
{
    private function logAction(Equipment $equipment, string $action, $oldData = null, $newData = null)
    {
        $log = new AuditLog([
            'user_id' => null, // null for now, normally auth()->id()
            'module' => 'equipment',
            'action' => $action,
            'record_id' => $equipment->id,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => Request::ip() ?? '127.0.0.1'
        ]);

        $log->save();

        // Calculate hash for the audit log to ensure audit trail integrity
        $hashData = $log->id . '|' . $log->module . '|' . $log->action . '|' . $log->record_id . '|' . json_encode($oldData) . '|' . json_encode($newData) . '|' . $log->created_at;
        $log->hash_value = hash('sha256', $hashData);
        $log->save();
    }

    /**
     * Handle the Equipment "created" event.
     */
    public function created(Equipment $equipment): void
    {
        $this->logAction($equipment, 'create', null, $equipment->toArray());
    }

    /**
     * Handle the Equipment "updated" event.
     */
    public function updated(Equipment $equipment): void
    {
        // Get the changed attributes
        $changes = $equipment->getChanges();
        $original = array_intersect_key($equipment->getOriginal(), $changes);

        // Don't log if only hash_value changed (to prevent infinite loop or useless logs during our own hash generation)
        if (count($changes) === 1 && isset($changes['hash_value'])) {
            return;
        }

        $this->logAction($equipment, 'update', $original, $changes);
    }

    /**
     * Handle the Equipment "deleted" event.
     */
    public function deleted(Equipment $equipment): void
    {
        $this->logAction($equipment, 'delete', $equipment->toArray(), null);
    }
}
