<?php

namespace App\Http\Requests;

use App\Domain\Projects\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'string', 'min:3', 'max:120'],
            'estado' => ['sometimes', Rule::enum(ProjectStatus::class)],
        ];
    }
}
