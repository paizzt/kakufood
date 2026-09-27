<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'me']);
    Route::put('/user/profile', [\App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
    Route::put('/user/password', [\App\Http\Controllers\Api\AuthController::class, 'updatePassword']);
    
    Route::apiResource('equipment', \App\Http\Controllers\Api\EquipmentController::class);
    Route::apiResource('branches', \App\Http\Controllers\Api\BranchController::class);
    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
    
    Route::apiResource('damage-reports', \App\Http\Controllers\Api\DamageReportController::class)->except(['destroy']);
    Route::apiResource('maintenances', \App\Http\Controllers\Api\MaintenanceController::class)->only(['index', 'store']);
    Route::apiResource('movements', \App\Http\Controllers\Api\MovementController::class);
    
    Route::get('audit-logs', [\App\Http\Controllers\Api\AuditLogController::class, 'index']);
    Route::get('audit-logs/{module}/{id}', [\App\Http\Controllers\Api\AuditLogController::class, 'show']);
    
    Route::get('dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
});
