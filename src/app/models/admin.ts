
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
  createdAt: string;
}

export interface AdminPagination {
  currentPage: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  message: string;
  pagination: AdminPagination;
  users: AdminUser[];
}

export interface ChangeUserRoleResponse {
  message: string;
  user: AdminUser;
}

export interface DeleteUserResponse {
  message: string;
}
export interface DashboardStatsResponse {
  message: string;
  stats: {
    totalUsers: number;
    totalAuthors: number;
    totalReaders: number;
    totalPosts: number;
  };
}