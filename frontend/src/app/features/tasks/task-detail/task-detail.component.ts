import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { CommentService } from '../../../core/services/comment.service';
import { Task } from '../../../core/models/task.model';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <a routerLink="/tasks" class="back-link">← Volver a tareas</a>

      @if (loading()) {
        <div class="loading">Cargando tarea...</div>
      } @else if (task()) {
        <div class="task-detail card">
          <div class="task-header">
            <h1>{{ task()!.titulo }}</h1>
            <div class="badges">
              <span class="badge badge-{{ task()!.prioridad }}">{{ task()!.prioridad }}</span>
              <span class="badge badge-{{ task()!.estado }}">{{ task()!.estado }}</span>
            </div>
          </div>

          <div class="task-info">
            <p><strong>Proyecto:</strong> {{ task()!.project?.nombre }}</p>
            <p><strong>Owner:</strong> {{ task()!.project?.owner?.nombre }}</p>
            <p><strong>Creada:</strong> {{ task()!.created_at | date:'medium' }}</p>
          </div>
        </div>

        <div class="comments-section card">
          <h2>Comentarios</h2>

          <form class="comment-form" (ngSubmit)="addComment()">
            <div class="form-group">
              <textarea
                [(ngModel)]="newComment"
                name="comment"
                placeholder="Escribe un comentario..."
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              {{ submitting() ? 'Enviando...' : 'Agregar comentario' }}
            </button>
          </form>

          <div class="comments-list">
            @for (comment of comments(); track comment.id) {
              <div class="comment">
                <div class="comment-header">
                  <strong>{{ comment.user?.nombre }}</strong>
                  <span class="comment-date">{{ comment.created_at | date:'medium' }}</span>
                </div>
                <p>{{ comment.cuerpo }}</p>
              </div>
            } @empty {
              <p class="no-comments">No hay comentarios aún.</p>
            }
          </div>

          @if (hasMoreComments()) {
            <button class="btn btn-secondary" (click)="loadMoreComments()">
              Cargar más comentarios
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #007bff;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    .task-detail {
      margin-bottom: 20px;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      h1 {
        margin: 0;
        font-size: 24px;
      }
    }

    .badges {
      display: flex;
      gap: 10px;
    }

    .task-info {
      p {
        margin: 10px 0;
        color: #666;
      }
    }

    .comments-section h2 {
      margin-bottom: 20px;
    }

    .comment-form {
      margin-bottom: 30px;

      textarea {
        resize: vertical;
      }
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .comment {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .comment-date {
      color: #666;
      font-size: 12px;
    }

    .no-comments {
      color: #666;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  task = signal<Task | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  submitting = signal(false);
  newComment = '';
  commentsPage = 1;
  hasMoreComments = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask(id);
    this.loadComments(id);
  }

  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: (response) => {
        this.task.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.router.navigate(['/tasks']);
      }
    });
  }

  loadComments(taskId: number): void {
    this.commentService.getComments(taskId, this.commentsPage).subscribe({
      next: (response) => {
        this.comments.set(response.data);
        this.hasMoreComments.set(response.meta.current_page < response.meta.last_page);
      }
    });
  }

  loadMoreComments(): void {
    const taskId = this.task()?.id;
    if (!taskId) return;

    this.commentsPage++;
    this.commentService.getComments(taskId, this.commentsPage).subscribe({
      next: (response) => {
        this.comments.update(current => [...current, ...response.data]);
        this.hasMoreComments.set(response.meta.current_page < response.meta.last_page);
      }
    });
  }

  addComment(): void {
    const taskId = this.task()?.id;
    if (!taskId || !this.newComment.trim()) return;

    this.submitting.set(true);

    this.commentService.createComment(taskId, { cuerpo: this.newComment }).subscribe({
      next: (response) => {
        this.comments.update(current => [response.data, ...current]);
        this.newComment = '';
        this.submitting.set(false);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}
