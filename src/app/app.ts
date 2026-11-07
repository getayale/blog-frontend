import { Component } from '@angular/core';
import { Blog } from './services/blog';
import { Post } from './models/posts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
   imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  title = 'Gech Blog';
  description = 'Welcome to my personal blog!';
  isLoading=false;
errorMessage='';
searchKeyword = '';

  posts: Post[] = [];

  constructor(private blogService: Blog) {
    this.loadPosts();
  }

loadPosts() {
  this.isLoading = true;
  this.errorMessage = '';

  this.blogService.getPublishedPosts(this.searchKeyword).subscribe({
    next: response => {
      this.posts = response.posts;
      this.isLoading = false;
    },
    error: error => {
      this.errorMessage = 'Unable to load blog posts. Please try again.';
      this.isLoading = false;
    }
  });
}


searchPosts() {
  this.loadPosts();
}

}