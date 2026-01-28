<?php

namespace Database\Factories;

use App\Domain\Tasks\Enums\TaskPriority;
use App\Domain\Tasks\Enums\TaskStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titulo' => fake()->sentence(4),
            'prioridad' => fake()->randomElement(TaskPriority::cases()),
            'estado' => fake()->randomElement(TaskStatus::cases()),
            'project_id' => Project::factory(),
        ];
    }

    public function baja(): static
    {
        return $this->state(fn (array $attributes) => [
            'prioridad' => TaskPriority::BAJA,
        ]);
    }

    public function media(): static
    {
        return $this->state(fn (array $attributes) => [
            'prioridad' => TaskPriority::MEDIA,
        ]);
    }

    public function alta(): static
    {
        return $this->state(fn (array $attributes) => [
            'prioridad' => TaskPriority::ALTA,
        ]);
    }

    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => TaskStatus::PENDIENTE,
        ]);
    }

    public function enProgreso(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => TaskStatus::EN_PROGRESO,
        ]);
    }

    public function finalizada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => TaskStatus::FINALIZADA,
        ]);
    }
}
