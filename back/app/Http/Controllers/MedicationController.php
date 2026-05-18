<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicationRequest;
use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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
}
