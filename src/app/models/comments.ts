
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
