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
            Route::post('/send-to-dispenser', [MedicationController::class, 'sendToDispenser']);
    });
});

// Rotas de medicação protegidas
Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('medications', MedicationController::class);
});

Route::get('/mqtt-test', function () {

    try {
        $mqtt = new \PhpMqtt\Client\MqttClient(
            'broker.hivemq.com',
            1883,
            'test-' . uniqid()
        );

        $mqtt->connect();

        $mqtt->publish('remedios/teste', '123', 0);

        $mqtt->disconnect();

        return 'OK MQTT';
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});