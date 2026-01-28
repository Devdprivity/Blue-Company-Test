import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(page = 1, perPage = 15): Observable<PaginatedResponse<Project>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedResponse<Project>>(this.apiUrl, { params });
  }

  getProject(id: number): Observable<{ data: Project }> {
    return this.http.get<{ data: Project }>(`${this.apiUrl}/${id}`);
  }

  createProject(data: CreateProjectRequest): Observable<{ data: Project }> {
    return this.http.post<{ data: Project }>(this.apiUrl, data);
  }

  updateProject(id: number, data: UpdateProjectRequest): Observable<{ data: Project }> {
    return this.http.put<{ data: Project }>(`${this.apiUrl}/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  completeProject(id: number): Observable<{ data: Project; message: string }> {
    return this.http.put<{ data: Project; message: string }>(`${this.apiUrl}/${id}/complete`, {});
  }
}
