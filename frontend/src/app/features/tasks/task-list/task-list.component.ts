import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task, TaskFilters, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h1>Tareas</h1>

      <div class="filters">
        <div class="filter-group">
          <label>Proyecto</label>
          <select [(ngModel)]="filters.project_id" (change)="loadTasks()">
            <option [ngValue]="undefined">Todos</option>
            @for (project of projects(); track project.id) {
              <option [ngValue]="project.id">{{ project.nombre }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Estado</label>
          <select [(ngModel)]="filters.estado" (change)="loadTasks()">
            <option [ngValue]="undefined">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Prioridad</label>
          <select [(ngModel)]="filters.prioridad" (change)="loadTasks()">
            <option [ngValue]="undefined">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Cargando tareas...</div>
      } @else {
        <div class="tasks-grid">
          @for (task of tasks(); track task.id) {
            <div class="card task-card">
              <div class="task-header">
                <h3>{{ task.titulo }}</h3>
                <div class="badges">
                  <span class="badge badge-{{ task.prioridad }}">{{ task.prioridad }}</span>
                  <span class="badge badge-{{ task.estado }}">{{ task.estado }}</span>
                </div>
              </div>
              <p class="task-project">Proyecto: {{ task.project?.nombre }}</p>
              <a [routerLink]="['/tasks', task.id]" class="btn btn-primary">Ver detalles</a>
            </div>
          } @empty {
            <p class="no-results">No hay tareas que coincidan con los filtros.</p>
          }
        </div>

        @if (pagination()) {
          <div class="pagination">
            <button
              (click)="goToPage(pagination()!.meta.current_page - 1)"
              [disabled]="pagination()!.meta.current_page === 1"
            >
              Anterior
            </button>

            @for (page of getPages(); track page) {
              <button
                [class.active]="page === pagination()!.meta.current_page"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }

            <button
              (click)="goToPage(pagination()!.meta.current_page + 1)"
              [disabled]="pagination()!.meta.current_page === pagination()!.meta.last_page"
            >
              Siguiente
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 20px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .task-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;

      h3 {
        margin: 0;
        font-size: 16px;
      }
    }

    .badges {
      display: flex;
      gap: 5px;
      flex-shrink: 0;
    }

    .task-project {
      color: #666;
      font-size: 14px;
    }

    .no-results {
      text-align: center;
      color: #666;
      padding: 40px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  pagination = signal<PaginatedResponse<Task> | null>(null);
  loading = signal(true);

  filters: TaskFilters = {
    page: 1,
    per_page: 12
  };

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadTasks();
  }

  loadProjects(): void {
    this.projectService.getProjects(1, 100).subscribe({
      next: (response) => {
        this.projects.set(response.data);
      }
    });
  }

  loadTasks(): void {
    this.loading.set(true);
    this.filters.page = 1;

    this.taskService.getTasks(this.filters).subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.pagination.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loading.set(true);

    this.taskService.getTasks(this.filters).subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.pagination.set(response);
        this.loading.set(false);
      }
    });
  }

  getPages(): number[] {
    const pagination = this.pagination();
    if (!pagination) return [];

    const pages: number[] = [];
    const current = pagination.meta.current_page;
    const last = pagination.meta.last_page;

    for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
      pages.push(i);
    }

    return pages;
  }
}
