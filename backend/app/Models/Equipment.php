<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $guarded = [];

    public function branch() {
        return $this->belongsTo(Branch::class);
    }
    
    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function damageReports() {
        return $this->hasMany(DamageReport::class);
    }

    public function maintenances() {
        return $this->hasMany(Maintenance::class);
    }
}
