import apiClient from './api-client';
import { Product, ProductVariant, PaginatedResponse } from '@/types/product';
import { ApiResponse } from '@/types/auth';

export interface ProductRequest {
  sku: string;
  name: string;
  description?: string;
  brandId: string;
  categoryId: string;
  isActive?: boolean;
  slug: string;
}

export interface ProductVariantRequest {
  skuVariant: string;
  variantName: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
  isActive?: boolean;
}

export const productService = {
  async getProducts(page = 0, size = 12): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(`/products`, {
      params: { page, size }
    });
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy danh sách sản phẩm');
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy chi tiết sản phẩm');
  },

  async createProduct(request: ProductRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Tạo sản phẩm thất bại');
  },

  async updateProduct(id: string, request: Partial<ProductRequest>): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Cập nhật sản phẩm thất bại');
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    if (response.status !== 200 && response.data?.message) {
      throw new Error(response.data.message);
    }
  },

  // Variants endpoints
  async getVariantsByProduct(productId: string, page = 0, size = 50): Promise<PaginatedResponse<ProductVariant>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ProductVariant>>>(`/products/${productId}/variants`, {
      params: { page, size }
    });
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Không thể lấy danh sách phiên bản');
  },

  async createVariant(productId: string, request: ProductVariantRequest): Promise<ProductVariant> {
    const response = await apiClient.post<ApiResponse<ProductVariant>>(`/products/${productId}/variants`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Tạo phiên bản sản phẩm thất bại');
  },

  async updateVariant(id: string, request: Partial<ProductVariantRequest>): Promise<ProductVariant> {
    const response = await apiClient.put<ApiResponse<ProductVariant>>(`/variants/${id}`, request);
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Cập nhật phiên bản sản phẩm thất bại');
  },

  async deleteVariant(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/variants/${id}`);
    if (response.status !== 200 && response.data?.message) {
      throw new Error(response.data.message);
    }
  }
};

export default productService;
