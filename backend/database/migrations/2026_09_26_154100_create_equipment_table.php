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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->foreignId('category_id')->constrained();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->foreignId('branch_id')->constrained();
            $table->string('location')->nullable();
            $table->string('condition'); // Baik, Rusak Ringan, Rusak Berat
            $table->string('status'); // Aktif, Tidak Digunakan, Dalam Perbaikan, Hilang, Dipindahkan
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->string('person_in_charge')->nullable();
            $table->string('photo')->nullable();
            $table->text('description')->nullable();
            $table->string('hash_value')->nullable(); // SHA-256 for data integrity
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
