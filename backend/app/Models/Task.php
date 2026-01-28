<?php

namespace App\Models;

use App\Domain\Tasks\Enums\TaskPriority;
use App\Domain\Tasks\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'prioridad',
        'estado',
        'project_id',
    ];

    protected function casts(): array
    {
        return [
            'prioridad' => TaskPriority::class,
            'estado' => TaskStatus::class,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function scopeByStatus(Builder $query, ?string $estado): Builder
    {
        return $estado ? $query->where('estado', $estado) : $query;
    }

    public function scopeByPriority(Builder $query, ?string $prioridad): Builder
    {
        return $prioridad ? $query->where('prioridad', $prioridad) : $query;
    }

    public function scopeByProject(Builder $query, ?int $projectId): Builder
    {
        return $projectId ? $query->where('project_id', $projectId) : $query;
    }
}
