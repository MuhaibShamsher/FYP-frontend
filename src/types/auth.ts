export type UserRole = 'admin' | 'risk_analyzer' | 'risk_monitor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name: string;
  role: UserRole;
  is_active: boolean;
}
