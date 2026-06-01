export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type Role = {
  id: string;
  name?: string;
  roleName?: string;
};

export type AuthUser = {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  role?: string | Role;
  roles?: string[];
  avatarUrl?: string;
  phone?: string;
  isActive?: boolean;
};

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: AuthUser;
};

export type ApiResponse<T> = {
  message?: string;
  data?: T;
  status?: number;
  success?: boolean;
};
