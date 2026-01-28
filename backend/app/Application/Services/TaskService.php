<?php

namespace App\Application\Services;

use App\Infrastructure\Repositories\Contracts\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    public function __construct(
        private TaskRepositoryInterface $taskRepository
    ) {}

    public function getTasksWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->taskRepository->getAllWithFilters($filters, $perPage);
    }

    public function findById(int $id): ?Task
    {
        return $this->taskRepository->findByIdWithRelations($id);
    }

    public function create(array $data): Task
    {
        return $this->taskRepository->create($data);
    }

    public function update(Task $task, array $data): Task
    {
        return $this->taskRepository->update($task, $data);
    }

    public function delete(Task $task): bool
    {
        return $this->taskRepository->delete($task);
    }
}
