<?php

namespace Database\Factories;

use App\Domain\Projects\Enums\ProjectStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->sentence(3),
            'estado' => fake()->randomElement(ProjectStatus::cases()),
            'owner_id' => User::factory(),
        ];
    }

    public function nuevo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => ProjectStatus::NUEVO,
        ]);
    }

    public function enProgreso(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => ProjectStatus::EN_PROGRESO,
        ]);
    }

    public function completado(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => ProjectStatus::COMPLETADO,
        ]);
    }
}
