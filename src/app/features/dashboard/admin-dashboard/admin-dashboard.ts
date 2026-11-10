
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';

import { Auth } from '../../../services/auth';
import { Admin } from '../../../services/admin';

import type { CurrentUser } from '../../../models/auth';
import type { AdminUser } from '../../../models/admin';
import type { Post } from '../../../models/posts';
import type { AdminComment } from '../../../models/comments';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, SlicePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

    today = new Date();

  currentUser: CurrentUser | null = null;

  isLoading = false;
  isLoggingOut = false;
  errorMessage = '';
  successMessage = '';

  // DASHBOARD STATISTICS
  stats = {
    totalUsers: 0,
    totalAuthors: 0,
    totalReaders: 0,
    totalPosts: 0
  };

  isLoadingStats = false;

  // USER MANAGEMENT
  users: AdminUser[] = [];
  isLoadingUsers = false;

  userKeyword = '';
  userPage = 1;
  userLimit = 10;
  userTotalPages = 0;
  userTotalUsers = 0;

  // POST MANAGEMENT
  posts: Post[] = [];
  isLoadingPosts = false;

  postKeyword = '';
  postPage = 1;
  postLimit = 10;
  postTotalPages = 0;
  postTotalPosts = 0;

  editingPostId: string | null = null;
  editPostTitle = '';
  editPostContent = '';

  // COMMENT MANAGEMENT
  comments: AdminComment[] = [];
  isLoadingComments = false;

  commentKeyword = '';
  commentPage = 1;
  commentLimit = 10;
  commentTotalPages = 0;
  commentTotalComments = 0;

  selectedPostId: string | null = null;
  selectedPostTitle = '';

  constructor(
    private auth: Auth,
    private admin: Admin,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCurrentUser();
    this.loadDashboardStats();
    this.loadUsers();
    this.loadPosts();
    this.loadComments();
  }

  // CURRENT USER
  loadCurrentUser(): void {
    this.auth.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.user;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load current user:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  // LOGOUT
  logout(): void {
    const confirmed = confirm('Are you sure you want to logout?');

    if (!confirmed || this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.auth.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.auth.clearCurrentUser();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.errorMessage =
          error.error?.message || 'Unable to logout. Please try again.';
        this.isLoggingOut = false;
        this.cdr.detectChanges();
      }
    });
  }

  // DASHBOARD STATISTICS
  loadDashboardStats(): void {
    this.isLoadingStats = true;

    this.admin.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.stats;
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load dashboard statistics:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load dashboard statistics.';
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      }
    });
  }

  // USER MANAGEMENT
  loadUsers(): void {
    this.isLoadingUsers = true;

    this.admin.getAllUsers(
      this.userPage,
      this.userLimit,
      this.userKeyword
    ).subscribe({
      next: (response) => {
        this.users = response.users;
        this.userTotalPages = response.pagination.totalPages;
        this.userTotalUsers = response.pagination.totalUsers;
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load users:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load users.';
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchUsers(): void {
    this.userPage = 1;
    this.loadUsers();
  }

  clearUserSearch(): void {
    this.userKeyword = '';
    this.userPage = 1;
    this.loadUsers();
  }

  previousUserPage(): void {
    if (this.userPage > 1) {
      this.userPage--;
      this.loadUsers();
    }
  }

  nextUserPage(): void {
    if (this.userPage < this.userTotalPages) {
      this.userPage++;
      this.loadUsers();
    }
  }

  changeUserRole(user: AdminUser, role: 'ADMIN' | 'AUTHOR' | 'READER'): void {
    if (user.role === role) {
      return;
    }

    if (!confirm(`Change ${user.username}'s role to ${role}?`)) {
      return;
    }

    this.admin.changeUserRole(user.id, role).subscribe({
      next: (response) => {
        user.role = response.user.role;
        this.successMessage = response.message;
        this.loadDashboardStats();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to change user role.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) {
      return;
    }

    this.admin.deleteUser(user.id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loadUsers();
        this.loadDashboardStats();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to delete user.';
        this.cdr.detectChanges();
      }
    });
  }

  // POST MANAGEMENT
  loadPosts(): void {
    this.isLoadingPosts = true;

    this.admin.getAllPosts(
      this.postPage,
      this.postLimit,
      this.postKeyword
    ).subscribe({
      next: (response) => {
        this.posts = response.posts;
        this.postTotalPages = response.pagination.totalPages;
        this.postTotalPosts = response.pagination.totalPosts;
        this.isLoadingPosts = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load posts:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load posts.';
        this.isLoadingPosts = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchPosts(): void {
    this.postPage = 1;
    this.loadPosts();
  }

  clearPostSearch(): void {
    this.postKeyword = '';
    this.postPage = 1;
    this.loadPosts();
  }

  previousPostPage(): void {
    if (this.postPage > 1) {
      this.postPage--;
      this.loadPosts();
    }
  }

  nextPostPage(): void {
    if (this.postPage < this.postTotalPages) {
      this.postPage++;
      this.loadPosts();
    }
  }

  startEditingPost(post: Post): void {
    this.editingPostId = post.id;
    this.editPostTitle = post.title;
    this.editPostContent = post.content;
  }

  cancelEditingPost(): void {
    this.editingPostId = null;
    this.editPostTitle = '';
    this.editPostContent = '';
  }

  savePostChanges(postId: string): void {
    if (!this.editPostTitle.trim() || !this.editPostContent.trim()) {
      this.errorMessage = 'Post title and content are required.';
      return;
    }

    this.admin.updateAnyPost(postId, {
      title: this.editPostTitle.trim(),
      content: this.editPostContent.trim()
    }).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.cancelEditingPost();
        this.loadPosts();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update post.';
        this.cdr.detectChanges();
      }
    });
  }

  togglePostPublish(post: Post): void {
    const action = post.published ? 'unpublish' : 'publish';

    if (!confirm(`Are you sure you want to ${action} this post?`)) {
      return;
    }

    this.admin.toggleAnyPostPublish(
      post.id,
      !post.published
    ).subscribe({
      next: (response) => {
        post.published = response.post.published;
        this.successMessage = response.message;
        this.loadDashboardStats();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to change post status.';
        this.cdr.detectChanges();
      }
    });
  }

  deletePost(post: Post): void {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    this.admin.deleteAnyPost(post.id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loadPosts();
        this.loadComments();
        this.loadDashboardStats();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to delete post.';
        this.cdr.detectChanges();
      }
    });
  }

  // COMMENT MANAGEMENT
  loadComments(): void {
    this.isLoadingComments = true;

    this.admin.getAllComments(
      this.commentPage,
      this.commentLimit,
      this.commentKeyword
    ).subscribe({
      next: (response) => {
        this.comments = response.comments;
        this.commentTotalPages = response.pagination.totalPages;
        this.commentTotalComments = response.pagination.totalComments;
        this.isLoadingComments = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load comments:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load comments.';
        this.isLoadingComments = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchComments(): void {
    this.commentPage = 1;
    this.loadComments();
  }

  clearCommentSearch(): void {
    this.commentKeyword = '';
    this.commentPage = 1;
    this.loadComments();
  }

  previousCommentPage(): void {
    if (this.commentPage > 1) {
      this.commentPage--;
      this.loadComments();
    }
  }

  nextCommentPage(): void {
    if (this.commentPage < this.commentTotalPages) {
      this.commentPage++;
      this.loadComments();
    }
  }

  deleteComment(comment: AdminComment): void {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.admin.deleteAnyComment(comment.id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loadComments();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to delete comment.';
        this.cdr.detectChanges();
      }
    });
  }

  // FILTER COMMENTS BY POST
  showPostComments(post: Post): void {
    this.selectedPostId = post.id;
    this.selectedPostTitle = post.title;
  }

  hidePostComments(): void {
    this.selectedPostId = null;
    this.selectedPostTitle = '';
  }

  getCommentsForPost(postId: string): AdminComment[] {
    return this.comments.filter(comment => comment.postId === postId);
  }

  // MESSAGE HELPERS
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }


  navigateToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
}
