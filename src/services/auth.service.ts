import apiClient from './api-client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse,
  AuthUser
} from '@/types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/users/me', // Assuming this might exist or for future use
};

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.LOGIN, payload);
      const { data } = response.data;
      
      if (!data) {
        throw new Error(response.data.message || 'Đăng nhập thất bại');
      }
      
      return data;
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error).message || 'Đăng nhập thất bại';
      throw new Error(message);
    }
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.REGISTER, payload);
      const { data } = response.data;
      
      if (!data) {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }
      
      return data;
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error).message || 'Đăng ký thất bại';
      throw new Error(message);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.REFRESH, { refreshToken });
      const { data } = response.data;
      
      if (!data) {
        throw new Error(response.data.message || 'Làm mới token thất bại');
      }
      
      return data;
    } catch (error: unknown) {
      throw new Error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Làm mới token thất bại');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<ApiResponse<AuthUser>>(AUTH_ENDPOINTS.ME);
      return response.data.data || null;
    } catch {
      return null;
    }
  }
};

export default authService;
