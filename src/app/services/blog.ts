import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../models/posts';

@Injectable({
  providedIn: 'root'
})
export class Blog {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

 getPublishedPosts(keyword: string = '') {
  return this.http.get<PostsResponse>(`${this.apiUrl}/posts`, {
    params: {
      keyword: keyword
    }
  });
}
}