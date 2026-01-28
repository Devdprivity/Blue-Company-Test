import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComments(taskId: number, page = 1, perPage = 15): Observable<PaginatedResponse<Comment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<PaginatedResponse<Comment>>(
      `${this.apiUrl}/tasks/${taskId}/comments`,
      { params }
    );
  }

  createComment(taskId: number, data: CreateCommentRequest): Observable<{ data: Comment }> {
    return this.http.post<{ data: Comment }>(
      `${this.apiUrl}/tasks/${taskId}/comments`,
      data
    );
  }
}
