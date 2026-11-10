
import { Component,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Blog } from '../../../services/blog';
import type { Post } from '../../../models/posts';

@Component({
  selector: 'app-reader-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './reader-dashboard.html',
  styleUrl: './reader-dashboard.scss'
})
export class ReaderDashboard {

  posts: Post[] = [];

  isLoading = false;
  errorMessage = '';
  searchKeyword = '';

  constructor(private blogService: Blog,private cdr: ChangeDetectorRef,private auth:Auth,private router:Router) {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogService.getPublishedPosts(this.searchKeyword).subscribe({
      next: (response) => {
        this.posts = response.posts;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load blog posts. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  searchPosts() {
    this.loadPosts();
  }
logout(): void {
  this.auth.logout().subscribe({
    next: () => {
      this.auth.clearCurrentUser();

      this.router.navigate(['/login']);

      this.cdr.markForCheck();
    },

    error: () => {
      this.errorMessage = 'Unable to log out. Please try again.';
      this.cdr.markForCheck();
    }
  });
}

}
