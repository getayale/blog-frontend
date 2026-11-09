
export interface AuthorPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;

  author: {
    username: string;
  };

  _count: {
    comments: number;
  };
}

export interface AuthorPostsResponse {
  message: string;
  pagination: {
    currentPage: number;
    limit: number;
    totalPosts: number;
    totalPages: number;
  };
  posts: AuthorPost[];
}

export interface AuthorPostResponse {
  message: string;
  post: AuthorPost;
}

export interface CreateAuthorPostRequest {
  title: string;
  content: string;
}

export interface UpdateAuthorPostRequest {
  title: string;
  content: string;
}

export interface AuthorStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
}
