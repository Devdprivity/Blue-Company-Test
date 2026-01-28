<?php

namespace App\Infrastructure\Repositories;

use App\Infrastructure\Repositories\Contracts\ProjectRepositoryInterface;
use App\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function findById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function findByIdWithTasks(int $id): ?Project
    {
        return Project::with('tasks')->find($id);
    }

    public function getAllByOwner(int $ownerId, int $perPage = 15): LengthAwarePaginator
    {
        return Project::with('owner')
            ->withCount('tasks')
            ->where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);
        return $project->fresh();
    }

    public function delete(Project $project): bool
    {
        return $project->delete();
    }
}
