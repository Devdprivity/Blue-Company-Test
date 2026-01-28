import { User } from './user.model';

export interface Comment {
  id: number;
  cuerpo: string;
  task_id: number;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  cuerpo: string;
}
