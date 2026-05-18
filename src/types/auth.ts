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
  role: UserRole;
}

export interface UpdateUserRequest {
  name: string;
  role: UserRole;
  is_active: boolean;
}

export interface Organization {
  id: number;
  org_name: string;
  city: string;
  branch_address: string;
  contact_email: string;
  contact_phone: string;
  logo: string | null;
  website_url: string;
  compliance_frameworks: string[];
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateOrganizationRequest {
  org_name?: string;
  city?: string;
  branch_address?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  description?: string;
}
