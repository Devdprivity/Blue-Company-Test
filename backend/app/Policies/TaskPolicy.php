<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function create(User $user, int $projectId): bool
    {
        $project = \App\Models\Project::find($projectId);
        return $project && $project->isOwner($user);
    }

    public function update(User $user, Task $task): bool
    {
        return $task->project->isOwner($user);
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->project->isOwner($user);
    }
}
