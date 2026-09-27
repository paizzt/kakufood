<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    use HasFactory;
    protected $fillable = ['equipment_id', 'from_branch_id', 'to_branch_id', 'movement_date', 'status', 'notes', 'user_id'];
    
    public function equipment() { return $this->belongsTo(Equipment::class); }
    public function fromBranch() { return $this->belongsTo(Branch::class, 'from_branch_id'); }
    public function toBranch() { return $this->belongsTo(Branch::class, 'to_branch_id'); }
    public function user() { return $this->belongsTo(User::class); }
}
