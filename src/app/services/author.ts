
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  AuthorPostsResponse,
  AuthorPostResponse,
  CreateAuthorPostRequest,
  UpdateAuthorPostRequest
} from '../models/author';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Author {

  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  // Get the logged-in author's posts
  getMyPosts(page = 1, limit = 10, keyword = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<AuthorPostsResponse>(
      `${this.apiUrl}/mine`,
      {
        params,
        withCredentials: true
      }
    );
  }

  // Create a new post
  createPost(data: CreateAuthorPostRequest) {
    return this.http.post<AuthorPostResponse>(
      this.apiUrl,
      data,
      {
        withCredentials: true
      }
    );
  }

  // Update an existing post
  updatePost(postId: string, data: UpdateAuthorPostRequest) {
    return this.http.put<AuthorPostResponse>(
      `${this.apiUrl}/${postId}`,
      data,
      {
        withCredentials: true
      }
    );
  }

  // Delete a post
  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${postId}`,
      {
        withCredentials: true
      }
    );
  }

  // Publish or unpublish a post
  updatePostPublishStatus(postId: string, published: boolean) {
    return this.http.patch<AuthorPostResponse>(
      `${this.apiUrl}/${postId}/publish`,
      { published },
      {
        withCredentials: true
      }
    );
  }
}
