<?php

namespace App\Http\Controllers;

use App\Application\Services\CommentService;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    public function __construct(
        private CommentService $commentService
    ) {}

    public function index(Request $request, Task $task): AnonymousResourceCollection
    {
        $comments = $this->commentService->getCommentsByTask(
            $task->id,
            $request->get('per_page', 15)
        );

        return CommentResource::collection($comments);
    }

    public function store(StoreCommentRequest $request, Task $task): JsonResponse
    {
        $comment = $this->commentService->create([
            ...$request->validated(),
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => new CommentResource($comment),
        ], 201);
    }
}
