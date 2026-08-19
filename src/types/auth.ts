export const ROLES = {
  ADMIN: "ADMIN",
  MILK_COLLECTION_OFFICER: "MILK_COLLECTION_OFFICER",
  FARMER: "FARMER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorBody {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export const ROLE_REDIRECTS: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  MILK_COLLECTION_OFFICER: "/mco/dashboard",
  FARMER: "/farmer/dashboard",
};
