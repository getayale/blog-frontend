import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostsResponse ,PostResponse} from '../models/posts';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Blog {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 getPublishedPosts(keyword: string = '',page: number = 1,limit: number = 10) {
  return this.http.get<PostsResponse>(`${this.apiUrl}/posts`, {
    params: {
      keyword,
      page,
      limit
    }
  });
}

getPostById(id:string){
  return this.http.get<PostResponse>(
    `${this.apiUrl}/posts/${id}`
  );
}
}