
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe,SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../../services/auth';
import { Author } from '../../../services/author';

import type { CurrentUser } from '../../../models/auth';
import type { AuthorPost } from '../../../models/author';


@Component({
  selector: 'app-author-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,SlicePipe
  ],
  templateUrl: './author-dashboard.html',
  styleUrl: './author-dashboard.scss'
})
export class AuthorDashboard {

  today = new Date();

  // Current logged-in author
  currentUser: CurrentUser | null = null;

  isLoadingUser = true;
  isLoggingOut = false;

  // Messages
  errorMessage = '';
  successMessage = '';

  // Posts
  posts: AuthorPost[] = [];

  isLoadingPosts = false;

  // Pagination
  currentPage = 1;
  limit = 10;
  totalPosts = 0;
  totalPages = 0;

  // Search
  keyword = '';

  // Post form
  showPostForm = false;
  editingPostId: string | null = null;

  postForm = {
    title: '',
    content: ''
  };

  isSubmitting = false;

  // Dashboard statistics
  stats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0
  };

  constructor(
    private auth: Auth,
    private author: Author,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCurrentUser();
    this.loadMyPosts();
  }

  // =========================================
  // CURRENT USER
  // =========================================

  loadCurrentUser(): void {
    this.isLoadingUser = true;

    this.auth.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.user;

        if (this.currentUser.role !== 'AUTHOR') {
          this.router.navigate(['/']);
          return;
        }

        this.isLoadingUser = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.isLoadingUser = false;
        this.router.navigate(['/login']);
        this.cdr.markForCheck();
      }
    });
  }

  // =========================================
  // LOAD AUTHOR POSTS
  // =========================================

  loadMyPosts(page = 1): void {
    this.isLoadingPosts = true;
    this.errorMessage = '';

    this.author.getMyPosts(
      page,
      this.limit,
      this.keyword
    ).subscribe({
      next: (response) => {
        this.posts = response.posts;

        this.currentPage = response.pagination.currentPage;
        this.totalPosts = response.pagination.totalPosts;
        this.totalPages = response.pagination.totalPages;

        this.calculateStats();

        this.isLoadingPosts = false;
        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to load your posts.'
        );

        this.isLoadingPosts = false;
        this.cdr.markForCheck();
      }
    });
  }

  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  calculateStats(): void {
    this.stats.totalPosts = this.totalPosts;

    this.stats.publishedPosts = this.posts.filter(
      post => post.published
    ).length;

    this.stats.draftPosts = this.posts.filter(
      post => !post.published
    ).length;

    this.stats.totalComments = this.posts.reduce(
      (total, post) => total + post._count.comments,
      0
    );
  }

  // =========================================
  // SEARCH POSTS
  // =========================================

  searchPosts(): void {
    this.loadMyPosts(1);
  }

  clearSearch(): void {
    this.keyword = '';
    this.loadMyPosts(1);
  }

  // =========================================
  // PAGINATION
  // =========================================

  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.loadMyPosts(page);
  }

  get paginationPages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  // =========================================
  // OPEN CREATE POST FORM
  // =========================================

  openCreateForm(): void {
    this.editingPostId = null;

    this.postForm = {
      title: '',
      content: ''
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showPostForm = true;
  }

  // =========================================
  // OPEN EDIT POST FORM
  // =========================================

  openEditForm(post: AuthorPost): void {
    this.editingPostId = post.id;

    this.postForm = {
      title: post.title,
      content: post.content
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showPostForm = true;
  }

  // =========================================
  // CLOSE POST FORM
  // =========================================

  closePostForm(): void {
    if (this.isSubmitting) {
      return;
    }

    this.showPostForm = false;
    this.editingPostId = null;

    this.postForm = {
      title: '',
      content: ''
    };
  }

  // =========================================
  // CREATE OR UPDATE POST
  // =========================================

  savePost(): void {
    const title = this.postForm.title.trim();
    const content = this.postForm.content.trim();

    if (!title || !content) {
      this.errorMessage = 'Title and content are required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const postData = {
      title,
      content
    };

    // UPDATE EXISTING POST
    if (this.editingPostId) {
      this.author.updatePost(
        this.editingPostId,
        postData
      ).subscribe({
        next: (response) => {
          this.successMessage = response.message;

          this.showPostForm = false;
          this.editingPostId = null;

          this.postForm = {
            title: '',
            content: ''
          };

          this.isSubmitting = false;
          this.loadMyPosts(this.currentPage);

          this.cdr.markForCheck();
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.getErrorMessage(
            error,
            'Unable to update post.'
          );

          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });

    } else {

      // CREATE NEW POST
      this.author.createPost(postData).subscribe({
        next: (response) => {
          this.successMessage = response.message;

          this.showPostForm = false;

          this.postForm = {
            title: '',
            content: ''
          };

          this.isSubmitting = false;

          this.loadMyPosts(1);

          this.cdr.markForCheck();
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.getErrorMessage(
            error,
            'Unable to create post.'
          );

          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  // =========================================
  // DELETE POST
  // =========================================

  deletePost(post: AuthorPost): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${post.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.author.deletePost(post.id).subscribe({
      next: (response) => {
        this.successMessage = response.message;

        const targetPage =
          this.posts.length === 1 && this.currentPage > 1
            ? this.currentPage - 1
            : this.currentPage;

        this.loadMyPosts(targetPage);

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to delete post.'
        );

        this.cdr.markForCheck();
      }
    });
  }

  // =========================================
  // PUBLISH / UNPUBLISH POST
  // =========================================

  togglePublish(post: AuthorPost): void {
    const newStatus = !post.published;

    const action = newStatus ? 'publish' : 'unpublish';

    const confirmed = confirm(
      `Are you sure you want to ${action} "${post.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.author.updatePostPublishStatus(
      post.id,
      newStatus
    ).subscribe({
      next: (response) => {
        this.successMessage = response.message;

        this.loadMyPosts(this.currentPage);

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to update post status.'
        );

        this.cdr.markForCheck();
      }
    });
  }

  // =========================================
  // POST STATUS
  // =========================================

  getPostStatus(post: AuthorPost): string {
    return post.published ? 'Published' : 'Draft';
  }

  // =========================================
  // NAVIGATE TO DASHBOARD SECTION
  // =========================================

  navigateToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // =========================================
  // LOGOUT
  // =========================================

  logout(): void {
    const confirmed = confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmed) {
      return;
    }

    this.isLoggingOut = true;

    this.auth.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.isLoggingOut = false;

        this.router.navigate(['/login']);

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to logout. Please try again.'
        );

        this.isLoggingOut = false;
        this.cdr.markForCheck();
      }
    });
  }

  // =========================================
  // ERROR HANDLING
  // =========================================

  private getErrorMessage(
    error: HttpErrorResponse,
    fallback: string
  ): string {
    return error.error?.message || fallback;
  }
}
