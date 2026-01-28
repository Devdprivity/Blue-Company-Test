<?php

namespace App\Infrastructure\Repositories\Contracts;

use App\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
    public function findById(int $id): ?Project;
    public function findByIdWithTasks(int $id): ?Project;
    public function getAllByOwner(int $ownerId, int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Project;
    public function update(Project $project, array $data): Project;
    public function delete(Project $project): bool;
}
