import apiClient from './api-client';
import { Brand, PaginatedResponse } from '@/types/product';
import { ApiResponse } from '@/types/auth';

export interface BrandRequest {
  name: string;
  logoUrl?: string;
}

export const brandService = {
  async getBrands(page = 0, size = 50): Promise<PaginatedResponse<Brand>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Brand>>>('/brands', {
      params: { page, size }
    });
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy danh sách thương hiệu');
  },

  async createBrand(request: BrandRequest): Promise<Brand> {
    const response = await apiClient.post<ApiResponse<Brand>>('/brands', request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Tạo thương hiệu thất bại');
  },

  async updateBrand(id: string, request: Partial<BrandRequest>): Promise<Brand> {
    const response = await apiClient.put<ApiResponse<Brand>>(`/brands/${id}`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Cập nhật thương hiệu thất bại');
  },

  async deleteBrand(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/brands/${id}`);
    if (response.status !== 200 && response.data?.message) {
      throw new Error(response.data.message);
    }
  }
};

export default brandService;
