<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Tasks\Enums\TaskStatus;
use App\Infrastructure\Repositories\Contracts\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskRepository implements TaskRepositoryInterface
{
    public function findById(int $id): ?Task
    {
        return Task::find($id);
    }

    public function findByIdWithRelations(int $id): ?Task
    {
        return Task::with(['project.owner', 'comments.user'])->find($id);
    }

    public function getAllWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return Task::with(['project.owner'])
            ->byProject($filters['project_id'] ?? null)
            ->byStatus($filters['estado'] ?? null)
            ->byPriority($filters['prioridad'] ?? null)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    public function finalizeByProject(int $projectId): int
    {
        return Task::where('project_id', $projectId)
            ->where('estado', '!=', TaskStatus::FINALIZADA->value)
            ->update(['estado' => TaskStatus::FINALIZADA->value]);
    }
}
