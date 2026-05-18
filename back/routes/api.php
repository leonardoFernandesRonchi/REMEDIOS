<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicationController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    // Rotas públicas
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Rotas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// Rotas de medicação protegidas
Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('medications', MedicationController::class);
});