import apiClient from './api-client';
import { AuthUser, ApiResponse } from '@/types/auth';
import { PaginatedResponse } from '@/types/product';

export interface UserUpdateRequest {
  name: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: string;
  isActive?: boolean;
}

export const userService = {
  async updateUser(id: string, request: UserUpdateRequest): Promise<AuthUser> {
    const response = await apiClient.put<ApiResponse<AuthUser>>(`/users/${id}`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Cập nhật thông tin thất bại');
  },

  async getUserById(id: string): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(`/users/${id}`);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy thông tin người dùng');
  },

  async getAllUsers(page = 0, size = 10): Promise<PaginatedResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<AuthUser>>>('/users', {
      params: { page, size }
    });
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy danh sách người dùng');
  },

  async deleteUser(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    if (response.status !== 200 && response.data?.message) {
      throw new Error(response.data.message);
    }
  }
};

export default userService;
