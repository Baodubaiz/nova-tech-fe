import apiClient from './api-client';
import { CheckoutRequest, OrderResponse, OrderStatus } from '@/types/order';

export const orderService = {
  // Lấy tất cả đơn hàng (Admin)
  async getAllOrders(page = 0, size = 10, status?: OrderStatus): Promise<{ content: OrderResponse[]; totalElements: number }> {
    const response = await apiClient.get('/orders', {
      params: { page, size, status }
    });
    return response.data;
  },

  // Xem chi tiết đơn hàng
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Đặt hàng / Checkout
  async checkout(checkoutData: CheckoutRequest, userId: string): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>('/orders/checkout', checkoutData, {
      headers: {
        'User-Id': userId
      }
    });
    return response.data;
  },

  // Lấy đơn hàng của cá nhân
  async getMyOrders(userId: string): Promise<OrderResponse[]> {
    const response = await apiClient.get<OrderResponse[]>('/orders/my-orders', {
      headers: {
        'User-Id': userId
      }
    });
    return response.data;
  },

  // Cập nhật trạng thái (Admin / System)
  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<unknown> {
    const response = await apiClient.put(`/orders/${orderId}/status`, null, {
      params: {
        status,
        note: note || `Cập nhật trạng thái`
      }
    });
    return response.data;
  },

  // Hủy đơn hàng (User)
  async cancelOrder(orderId: string, userId: string, note?: string): Promise<OrderResponse> {
    const response = await apiClient.put<OrderResponse>(`/orders/${orderId}/cancel`, null, {
      headers: {
        'User-Id': userId
      },
      params: {
        note: note || 'Khách hàng chủ động hủy đơn hàng.'
      }
    });
    return response.data;
  },

  // Admin cập nhật trạng thái
  async adminUpdateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<OrderResponse> {
    const response = await apiClient.put(`/orders/${orderId}/admin/status`, null, {
      params: {
        status,
        note: note || `Trạng thái được cập nhật bởi Admin`
      }
    });
    return response.data;
  },

  // Xác nhận chuyển khoản ngân hàng
  async confirmBankTransfer(orderId: string, note?: string): Promise<OrderResponse> {
    const response = await apiClient.put(`/orders/${orderId}/confirm-bank-transfer`, null, {
      params: { note }
    });
    return response.data;
  }
};

export default orderService;