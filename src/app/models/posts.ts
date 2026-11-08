
export interface Post {
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
}

export interface PostsResponse {
  message: string;
  pagination: {
    currentPage: number;
    limit: number;
    totalPosts: number;
    totalPages: number;
  };
  posts: Post[];
}

// Response for retrieving one post
export interface PostResponse {
  message: string;
  post: Post;
}
