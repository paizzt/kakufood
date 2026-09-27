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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable(); // nullable since maybe system actions
            $table->string('module'); // equipment, category, branch, user
            $table->string('action'); // create, update, delete
            $table->unsignedBigInteger('record_id');
            $table->json('old_data')->nullable();
            $table->json('new_data')->nullable();
            $table->string('hash_value')->nullable(); // integrity of this log
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
