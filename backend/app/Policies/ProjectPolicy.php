<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        return $project->isOwner($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $project->isOwner($user);
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->isOwner($user);
    }

    public function complete(User $user, Project $project): bool
    {
        return $project->isOwner($user);
    }
}
