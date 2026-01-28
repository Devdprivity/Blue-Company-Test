import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../models/task.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filters: TaskFilters = {}): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams();

    if (filters.project_id) params = params.set('project_id', filters.project_id.toString());
    if (filters.estado) params = params.set('estado', filters.estado);
    if (filters.prioridad) params = params.set('prioridad', filters.prioridad);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

    return this.http.get<PaginatedResponse<Task>>(this.apiUrl, { params });
  }

  getTask(id: number): Observable<{ data: Task }> {
    return this.http.get<{ data: Task }>(`${this.apiUrl}/${id}`);
  }

  createTask(data: CreateTaskRequest): Observable<{ data: Task }> {
    return this.http.post<{ data: Task }>(this.apiUrl, data);
  }

  updateTask(id: number, data: UpdateTaskRequest): Observable<{ data: Task }> {
    return this.http.put<{ data: Task }>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
