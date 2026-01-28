<?php

namespace App\Application\Services;

use App\Infrastructure\Repositories\Contracts\CommentRepositoryInterface;
use App\Models\Comment;
use Illuminate\Pagination\LengthAwarePaginator;

class CommentService
{
    public function __construct(
        private CommentRepositoryInterface $commentRepository
    ) {}

    public function getCommentsByTask(int $taskId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->commentRepository->getByTask($taskId, $perPage);
    }

    public function create(array $data): Comment
    {
        return $this->commentRepository->create($data);
    }
}
