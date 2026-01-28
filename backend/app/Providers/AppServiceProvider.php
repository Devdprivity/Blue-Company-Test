<?php

namespace App\Providers;

use App\Infrastructure\Repositories\CommentRepository;
use App\Infrastructure\Repositories\Contracts\CommentRepositoryInterface;
use App\Infrastructure\Repositories\Contracts\ProjectRepositoryInterface;
use App\Infrastructure\Repositories\Contracts\TaskRepositoryInterface;
use App\Infrastructure\Repositories\ProjectRepository;
use App\Infrastructure\Repositories\TaskRepository;
use App\Models\Project;
use App\Models\Task;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(CommentRepositoryInterface::class, CommentRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
    }
}
