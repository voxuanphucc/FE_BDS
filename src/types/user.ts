// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  avatar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  isActive?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: {
    from: string;
    to: string;
  };
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  users: User[];
  pagination: UserPagination;
  filters: UserFilters;
}
