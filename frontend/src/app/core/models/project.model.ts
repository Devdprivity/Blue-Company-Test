import { User } from './user.model';
import { Task } from './task.model';

export type ProjectStatus = 'nuevo' | 'en_progreso' | 'completado';

export interface Project {
  id: number;
  nombre: string;
  estado: ProjectStatus;
  owner_id: number;
  owner?: User;
  tasks_count?: number;
  tasks?: Task[];
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  nombre: string;
  estado?: ProjectStatus;
}

export interface UpdateProjectRequest {
  nombre?: string;
  estado?: ProjectStatus;
}
