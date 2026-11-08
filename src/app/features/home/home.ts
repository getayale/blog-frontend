
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


import { Blog } from '../../services/blog';
import { Post } from '../../models/posts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  title = 'Gech Blog';
  description = 'Welcome to my personal blog!';

  isLoading = false;
  errorMessage = '';
  searchKeyword = '';

  posts: Post[] = [];

constructor(
  private blogService: Blog,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadPosts();
  }

 loadPosts() {
  this.isLoading = true;
  this.errorMessage = '';

  console.log('Loading posts...');

  this.blogService.getPublishedPosts(this.searchKeyword).subscribe({
 next: (response) => {
  this.posts = response.posts || [];
  this.isLoading = false;

  this.cdr.markForCheck();
},
  error: (error) => {
  console.error('API Error:', error);

  this.errorMessage = 'Unable to load blog posts. Please try again.';
  this.isLoading = false;

  this.cdr.markForCheck();
},
    complete: () => {
      console.log('Request completed.');
    }
  });
}

  searchPosts() {
    this.loadPosts();
  }
}
