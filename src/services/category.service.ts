import apiClient from './api-client';
import { Category, PaginatedResponse } from '@/types/product';
import { ApiResponse } from '@/types/auth';

export interface CategoryRequest {
  name: string;
  slug: string;
}

export const categoryService = {
  async getCategories(page = 0, size = 20): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Category>>>(`/categories`, {
      params: { page, size }
    });
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy danh sách danh mục');
  },

  async createCategory(request: CategoryRequest): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Tạo danh mục thất bại');
  },

  async updateCategory(id: string, request: Partial<CategoryRequest>): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Cập nhật danh mục thất bại');
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
    if (response.status !== 200 && response.data?.message) {
      throw new Error(response.data.message);
    }
  }
};

export default categoryService;
