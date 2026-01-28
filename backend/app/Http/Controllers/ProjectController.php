<?php

namespace App\Http\Controllers;

use App\Application\Services\ProjectService;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $projects = $this->projectService->getProjectsByOwner(
            $request->user()->id,
            $request->get('per_page', 15)
        );

        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => new ProjectResource($project->load('owner')),
        ], 201);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project = $this->projectService->findById($project->id);

        return response()->json([
            'data' => new ProjectResource($project),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project = $this->projectService->update($project, $request->validated());

        return response()->json([
            'data' => new ProjectResource($project->load('owner')),
        ]);
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->delete($project);

        return response()->json(null, 204);
    }

    public function complete(Request $request, Project $project): JsonResponse
    {
        $this->authorize('complete', $project);

        $project = $this->projectService->complete($project);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'tasks'])),
            'message' => 'Proyecto completado y tareas finalizadas',
        ]);
    }
}
