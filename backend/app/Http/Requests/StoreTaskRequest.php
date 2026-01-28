<?php

namespace App\Http\Requests;

use App\Domain\Tasks\Enums\TaskPriority;
use App\Domain\Tasks\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'min:3', 'max:150'],
            'prioridad' => ['sometimes', Rule::enum(TaskPriority::class)],
            'estado' => ['sometimes', Rule::enum(TaskStatus::class)],
            'project_id' => ['required', 'exists:projects,id'],
        ];
    }
}
