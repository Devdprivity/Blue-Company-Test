<?php

namespace App\Infrastructure\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

interface TaskRepositoryInterface
{
    public function findById(int $id): ?Task;
    public function findByIdWithRelations(int $id): ?Task;
    public function getAllWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Task;
    public function update(Task $task, array $data): Task;
    public function delete(Task $task): bool;
    public function finalizeByProject(int $projectId): int;
}
