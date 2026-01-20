export enum UserRole {
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
  NEEDY = 'needy',
}

export interface User {
  id: string;
  role: UserRole;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  about?: string;
  status?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokensRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}
