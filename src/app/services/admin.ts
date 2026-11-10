
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  AdminUsersResponse,
  ChangeUserRoleResponse,
  DeleteUserResponse,
  DashboardStatsResponse
} from '../models/admin';

import type {
  PostsResponse,
  PostResponse
} from '../models/posts';

import type {
  AdminCommentsResponse,
  DeleteCommentResponse
} from '../models/comments';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Admin {

 private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // =========================
  // USER MANAGEMENT
  // =========================

  getAllUsers(page = 1, limit = 10, keyword = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<AdminUsersResponse>(
      `${this.apiUrl}/users`,
      { params, withCredentials: true }
    );
  }

  changeUserRole(
    userId: string,
    role: 'ADMIN' | 'AUTHOR' | 'READER'
  ) {
    return this.http.patch<ChangeUserRoleResponse>(
      `${this.apiUrl}/users/${userId}/role`,
      { role },
      { withCredentials: true }
    );
  }

  deleteUser(userId: string) {
    return this.http.delete<DeleteUserResponse>(
      `${this.apiUrl}/users/${userId}`,
      { withCredentials: true }
    );
  }

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  getDashboardStats() {
    return this.http.get<DashboardStatsResponse>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }

  // =========================
  // POST MANAGEMENT
  // =========================

  getAllPosts(page = 1, limit = 10, keyword = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<PostsResponse>(
      `${this.apiUrl}/posts`,
      { params, withCredentials: true }
    );
  }

  updateAnyPost(
    postId: string,
    data: { title: string; content: string }
  ) {
    return this.http.patch<PostResponse>(
      `${this.apiUrl}/posts/${postId}`,
      data,
      { withCredentials: true }
    );
  }

  toggleAnyPostPublish(postId: string, published: boolean) {
    return this.http.patch<PostResponse>(
      `${this.apiUrl}/posts/${postId}/publish`,
      { published },
      { withCredentials: true }
    );
  }

  deleteAnyPost(postId: string) {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/posts/${postId}`,
      { withCredentials: true }
    );
  }

  // =========================
  // COMMENT MANAGEMENT
  // =========================

  getAllComments(page = 1, limit = 10, keyword = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<AdminCommentsResponse>(
      `${this.apiUrl}/comments`,
      { params, withCredentials: true }
    );
  }

  deleteAnyComment(commentId: string) {
    return this.http.delete<DeleteCommentResponse>(
      `${this.apiUrl}/comments/${commentId}`,
      { withCredentials: true }
    );
  }

}
