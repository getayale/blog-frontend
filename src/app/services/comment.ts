
import { Injectable } from '@angular/core';
import { CommentResponse, CommentsResponse } from '../models/comments';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Comment {
 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all comments for a post
  getComments(postId: string) {
    return this.http.get<CommentsResponse>(
      `${this.apiUrl}/comments/${postId}`
    );
  }

  // Create a comment
  createComment(postId: string, content: string) {
    return this.http.post<CommentResponse>(
      `${this.apiUrl}/comments/${postId}`,
      { content },
      { withCredentials: true }
    );
  }

  // Update a comment
  updateComment(commentId: string, content: string) {
    return this.http.put<CommentResponse>(
      `${this.apiUrl}/comments/${commentId}`,
      { content },
      { withCredentials: true }
    );
  }

  // Delete a comment
  deleteComment(commentId: string) {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/comments/${commentId}`,
      { withCredentials: true }
    );
  }
}
