
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Comment as CommentService } from '../../../services/comment';
import type { Comment as CommentModel } from '../../../models/comments';
import { Blog } from '../../../services/blog';
import type { Post } from '../../../models/posts';
import type { CurrentUser } from '../../../models/auth';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-post-details',
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
})
export class PostDetails {

  post: Post | null = null;

  isLoading = false;
  errorMessage = '';

  comments: CommentModel[] = [];

  currentUser: CurrentUser | null = null;
  isAuthenticated = false;

  newComment = '';
  isSubmittingComment = false;
  commentError = '';
  commentMessage = '';

  // Back navigation
  backLink = '/';
  backLabel = '← Back to Home';

  constructor(
    private route: ActivatedRoute,
    private blogService: Blog,
    private cdr: ChangeDetectorRef,
    private commentService: CommentService,
    private auth: Auth
  ) {
    this.setBackLink();
    this.loadPost();
    this.checkAuthentication();
  }

  // Determine where the user came from
  setBackLink() {
    const from = this.route.snapshot.queryParamMap.get('from');

    if (from === 'dashboard') {
      this.backLink = '/reader-dashboard';
      this.backLabel = '← Back to Dashboard';
    } else {
      this.backLink = '/';
      this.backLabel = '← Back to Home';
    }
  }

  // Load post details
  loadPost() {
    const postId = this.route.snapshot.paramMap.get('id');

    if (!postId) {
      this.errorMessage = 'Post ID not found.';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.blogService.getPostById(postId).subscribe({
      next: (response) => {
        this.post = response.post;
        this.isLoading = false;

        this.loadComments(postId);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load this post.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Load comments
  loadComments(postId: string) {
    this.commentService.getComments(postId).subscribe({
      next: (response) => {
        this.comments = response.comments;
        this.cdr.markForCheck();
      },
      error: () => {
        console.error('Unable to load comments.');
      }
    });
  }

  // Check whether the user is logged in
  checkAuthentication() {
    this.auth.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.user;
        this.isAuthenticated = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Add a new comment
  addComment() {
    const postId = this.route.snapshot.paramMap.get('id');

    if (!postId || !this.newComment.trim()) {
      return;
    }

    this.isSubmittingComment = true;
    this.commentError = '';
    this.commentMessage = '';

    this.commentService.createComment(
      postId,
      this.newComment.trim()
    ).subscribe({
      next: (response) => {
        this.newComment = '';
        this.isSubmittingComment = false;
        this.commentMessage = response.message;

        this.loadComments(postId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isSubmittingComment = false;
        this.commentError =
          error.error?.message || 'Unable to add comment.';

        this.cdr.markForCheck();
      }
    });
  }
}
