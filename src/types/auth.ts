// src/types/auth.ts

import type { User } from './user';

/**
 * Auth context value
 */
export interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (loginInput: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userRole: string | null;
  isAdmin: boolean;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  user: User;
  token: string;
}

/**
 * Auth hook return type
 */
export interface UseAuthReturn extends AuthContextValue {
  // Additional hook-specific properties if any
}