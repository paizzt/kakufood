<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipment')->cascadeOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->string('damage_type'); // misal: Mekanikal, Elektrikal, dll
            $table->enum('severity', ['Rusak Ringan', 'Rusak Berat']);
            $table->text('description');
            $table->string('photo')->nullable();
            $table->enum('status', ['Baru', 'Diverifikasi', 'Dalam Perbaikan', 'Selesai', 'Ditolak'])->default('Baru');
            $table->text('admin_notes')->nullable();
            $table->timestamp('reported_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};
