<?php

namespace App\Infrastructure\Repositories\Contracts;

use App\Models\Comment;
use Illuminate\Pagination\LengthAwarePaginator;

interface CommentRepositoryInterface
{
    public function getByTask(int $taskId, int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Comment;
}
