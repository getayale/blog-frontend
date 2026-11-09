
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;

  author: {
    username: string;
  };
}

export interface CommentsResponse {
  message: string;
  comments: Comment[];
}

export interface CommentResponse {
  message: string;
  comment: Comment;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// Admin comment management

export interface AdminComment extends Comment {
  author: {
    id: string;
    username: string;
  };

  post: {
    id: string;
    title: string;
  };
}

export interface AdminCommentsResponse {
  message: string;

  pagination: {
    currentPage: number;
    limit: number;
    totalComments: number;
    totalPages: number;
  };

  comments: AdminComment[];
}

export interface DeleteCommentResponse {
  message: string;
}
