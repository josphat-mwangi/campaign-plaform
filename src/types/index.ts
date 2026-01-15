// types/index.ts

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WhitelistedEmail {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  subject: string;
  body: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
