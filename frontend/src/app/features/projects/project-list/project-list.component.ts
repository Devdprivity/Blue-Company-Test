import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Mis Proyectos</h1>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          Nuevo Proyecto
        </button>
      </div>

      @if (showCreateForm) {
        <div class="card create-form">
          <h3>Crear Proyecto</h3>
          <form (ngSubmit)="createProject()">
            <div class="form-group">
              <label>Nombre</label>
              <input
                type="text"
                [(ngModel)]="newProject.nombre"
                name="nombre"
                required
                minlength="3"
                maxlength="120"
              />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="creating()">
                {{ creating() ? 'Creando...' : 'Crear' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <div class="loading">Cargando proyectos...</div>
      } @else {
        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <div class="card project-card">
              <div class="project-header">
                <h3>{{ project.nombre }}</h3>
                <span class="badge badge-{{ project.estado }}">{{ project.estado }}</span>
              </div>
              <p class="task-count">{{ project.tasks_count || 0 }} tareas</p>

              <div class="project-actions">
                @if (project.estado !== 'completado') {
                  <button
                    class="btn btn-success"
                    (click)="completeProject(project)"
                    [disabled]="completing() === project.id"
                  >
                    {{ completing() === project.id ? 'Completando...' : 'Completar' }}
                  </button>
                }
                <button
                  class="btn btn-danger"
                  (click)="deleteProject(project)"
                  [disabled]="deleting() === project.id"
                >
                  {{ deleting() === project.id ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>
            </div>
          } @empty {
            <p class="no-results">No tienes proyectos aún.</p>
          }
        </div>

        @if (pagination()) {
          <div class="pagination">
            <button
              (click)="loadPage(pagination()!.meta.current_page - 1)"
              [disabled]="pagination()!.meta.current_page === 1"
            >
              Anterior
            </button>
            <span>Página {{ pagination()!.meta.current_page }} de {{ pagination()!.meta.last_page }}</span>
            <button
              (click)="loadPage(pagination()!.meta.current_page + 1)"
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
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .create-form {
      margin-bottom: 20px;

      h3 { margin-bottom: 15px; }
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .project-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 { margin: 0; }
    }

    .task-count {
      color: #666;
      font-size: 14px;
    }

    .project-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .no-results {
      text-align: center;
      color: #666;
      padding: 40px;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects = signal<Project[]>([]);
  pagination = signal<PaginatedResponse<Project> | null>(null);
  loading = signal(true);
  creating = signal(false);
  completing = signal<number | null>(null);
  deleting = signal<number | null>(null);

  showCreateForm = false;
  newProject = { nombre: '' };

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.projectService.getProjects().subscribe({
      next: (response) => {
        this.projects.set(response.data);
        this.pagination.set(response);
        this.loading.set(false);
      }
    });
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.projectService.getProjects(page).subscribe({
      next: (response) => {
        this.projects.set(response.data);
        this.pagination.set(response);
        this.loading.set(false);
      }
    });
  }

  createProject(): void {
    if (!this.newProject.nombre.trim()) return;

    this.creating.set(true);
    this.projectService.createProject(this.newProject).subscribe({
      next: (response) => {
        this.projects.update(current => [response.data, ...current]);
        this.newProject = { nombre: '' };
        this.showCreateForm = false;
        this.creating.set(false);
      },
      error: () => {
        this.creating.set(false);
      }
    });
  }

  completeProject(project: Project): void {
    this.completing.set(project.id);
    this.projectService.completeProject(project.id).subscribe({
      next: (response) => {
        this.projects.update(current =>
          current.map(p => p.id === project.id ? response.data : p)
        );
        this.completing.set(null);
      },
      error: () => {
        this.completing.set(null);
      }
    });
  }

  deleteProject(project: Project): void {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    this.deleting.set(project.id);
    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects.update(current => current.filter(p => p.id !== project.id));
        this.deleting.set(null);
      },
      error: () => {
        this.deleting.set(null);
      }
    });
  }
}
