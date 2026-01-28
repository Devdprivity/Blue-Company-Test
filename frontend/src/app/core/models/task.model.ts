import { Project } from './project.model';
import { Comment } from './comment.model';

export type TaskPriority = 'baja' | 'media' | 'alta';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'finalizada';

export interface Task {
  id: number;
  titulo: string;
  prioridad: TaskPriority;
  estado: TaskStatus;
  project_id: number;
  project?: Project;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  titulo: string;
  prioridad?: TaskPriority;
  estado?: TaskStatus;
  project_id: number;
}

export interface UpdateTaskRequest {
  titulo?: string;
  prioridad?: TaskPriority;
  estado?: TaskStatus;
}

export interface TaskFilters {
  project_id?: number;
  estado?: TaskStatus;
  prioridad?: TaskPriority;
  page?: number;
  per_page?: number;
}
