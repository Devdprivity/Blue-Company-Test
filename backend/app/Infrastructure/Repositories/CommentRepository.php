<?php

namespace App\Infrastructure\Repositories;

use App\Infrastructure\Repositories\Contracts\CommentRepositoryInterface;
use App\Models\Comment;
use Illuminate\Pagination\LengthAwarePaginator;

class CommentRepository implements CommentRepositoryInterface
{
    public function getByTask(int $taskId, int $perPage = 15): LengthAwarePaginator
    {
        return Comment::with('user')
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function create(array $data): Comment
    {
        $comment = Comment::create($data);
        return $comment->load('user');
    }
}
