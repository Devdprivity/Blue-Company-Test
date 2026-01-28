<?php

namespace App\Application\Services;

use App\Domain\Projects\Enums\ProjectStatus;
use App\Infrastructure\Repositories\Contracts\ProjectRepositoryInterface;
use App\Infrastructure\Repositories\Contracts\TaskRepositoryInterface;
use App\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function __construct(
        private ProjectRepositoryInterface $projectRepository,
        private TaskRepositoryInterface $taskRepository
    ) {}

    public function getProjectsByOwner(int $ownerId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->projectRepository->getAllByOwner($ownerId, $perPage);
    }

    public function findById(int $id): ?Project
    {
        return $this->projectRepository->findByIdWithTasks($id);
    }

    public function create(array $data): Project
    {
        return $this->projectRepository->create($data);
    }

    public function update(Project $project, array $data): Project
    {
        return $this->projectRepository->update($project, $data);
    }

    public function delete(Project $project): bool
    {
        return $this->projectRepository->delete($project);
    }

    public function complete(Project $project): Project
    {
        return DB::transaction(function () use ($project) {
            $this->taskRepository->finalizeByProject($project->id);
            return $this->projectRepository->update($project, [
                'estado' => ProjectStatus::COMPLETADO->value
            ]);
        });
    }
}
