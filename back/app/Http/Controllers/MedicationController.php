<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicationRequest;
use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Services\MqttService;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;



class MedicationController extends Controller
{
    public function index(): JsonResponse
    {
        $medications = Auth::user()->medications;
        return response()->json($medications);
    }

    public function store(MedicationRequest $request): JsonResponse
    {
        $medication = Auth::user()->medications()->create($request->validated());

        return response()->json([
            'message' => 'Medicação criada com sucesso',
            'medication' => $medication
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $medication = Auth::user()->medications()->findOrFail($id);
        return response()->json($medication);
    }

    public function update(MedicationRequest $request, int $id): JsonResponse
    {
        $medication = Auth::user()->medications()->findOrFail($id);
        $medication->update($request->validated());

        return response()->json([
            'message' => 'Medicação atualizada com sucesso',
            'medication' => $medication
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $medication = Auth::user()->medications()->findOrFail($id);
        $medication->delete();

        return response()->json([
            'message' => 'Medicação removida com sucesso'
        ]);
    }

   public function sendToDispenser(Request $request): JsonResponse
{
    $request->validate([
        'value' => 'required|integer|min:1|max:9'
    ]);

    $server   = env('MQTT_HOST');
    $port     = env('MQTT_PORT');
    $username = env('MQTT_USERNAME');
    $password = env('MQTT_PASSWORD');

    $clientId = 'laravel-client-' . uniqid();

    $mqtt = new MqttClient($server, $port, $clientId);

    $connectionSettings = (new ConnectionSettings)
        ->setUsername($username)
        ->setPassword($password)
        ->setUseTls(true);

    $mqtt->connect($connectionSettings, true);

    $mqtt->publish(
        'remedios/dispenser',
        (string) $request->value,
        0
    );

    $mqtt->disconnect();

    return response()->json([
        'message' => 'Valor enviado com sucesso',
        'value' => $request->value
    ]);
}


}
