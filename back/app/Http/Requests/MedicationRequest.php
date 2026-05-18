<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Como as rotas já estão protegidas por jwt.auth, pode deixar true
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'posicionamentoMotor' => 'required|string|max:255'
        ];
    }
}
