<?php

namespace App\Http\Controllers;

use App\Application\Services\TaskService;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $tasks = $this->taskService->getTasksWithFilters(
            $request->only(['project_id', 'estado', 'prioridad']),
            $request->get('per_page', 15)
        );

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $this->authorize('create', [Task::class, $request->project_id]);

        $task = $this->taskService->create($request->validated());

        return response()->json([
            'data' => new TaskResource($task->load('project.owner')),
        ], 201);
    }

    public function show(Task $task): JsonResponse
    {
        $task = $this->taskService->findById($task->id);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task = $this->taskService->update($task, $request->validated());

        return response()->json([
            'data' => new TaskResource($task->load('project.owner')),
        ]);
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $this->taskService->delete($task);

        return response()->json(null, 204);
    }
}
