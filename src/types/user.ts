export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  CASHIER = 'cashier'
}

/**
 * User model from backend
 */
export interface User {
  id: number;
  fullname?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  role: UserRole | string;
  phone?: string;
  address?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * User login credentials
 */
export interface LoginCredentials {
  login: string; 
  password: string;
}

/**
 */
export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User;
  token: string;
  expires_in?: number;
}

/**
 * Auth state in React context
 */
export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: UserRole | string | null;
  isAdmin: boolean;
}