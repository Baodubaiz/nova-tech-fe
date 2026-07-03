import apiClient from './api-client';
import { Order, CreateOrderRequest, OrderStatus } from '../types/order';

export const orderService = {
  /**
   * GET /api/v1/orders
   * Lấy danh sách tất cả đơn hàng (Thường dùng cho Admin)
   */
  async getAllOrders(page = 0, size = 10, status?: OrderStatus): Promise<{ content: Order[]; totalElements: number }> {
    const response = await apiClient.get('/orders', {
      params: { page, size, status }
    });
    return response.data;
  },

  /**
   * GET /api/v1/orders/{orderId}
   * Xem chi tiết một đơn hàng theo ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * GET /api/v1/orders/my-orders
   * Lấy danh sách đơn hàng của chính User đang đăng nhập (Trang lịch sử mua hàng)
   */
  async getMyOrders(page = 0, size = 10): Promise<{ content: Order[]; totalElements: number }> {
    const response = await apiClient.get('/orders/my-orders', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * POST /api/v1/orders/checkout
   * Tạo đơn hàng mới (Thanh toán/Đặt hàng)
   */
  async checkout(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post('/orders/checkout', data);
    return response.data;
  },

  /**
   * PUT /api/v1/orders/{orderId}/status
   * Cập nhật trạng thái đơn hàng (Dành cho User cập nhật hoặc quy trình tự động cơ bản)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${orderId}/status`, null, {
      params: {
        status,
        note: note || `Cập nhật trạng thái`
      }
    });
    return response.data;
  },

  /**
   * PUT /api/v1/orders/{orderId}/admin/status
   * Quyền Admin cập nhật trạng thái đơn hàng nâng cao
   */
  async adminUpdateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${orderId}/admin/status`, null, {
      params: {
        status,
        note: note || `Trạng thái được cập nhật bởi Admin`
      }
    });
    return response.data;
  },

  /**
   * PUT /api/v1/orders/{orderId}/confirm-bank-transfer
   * Xác nhận đã nhận được tiền chuyển khoản ngân hàng (Dành cho admin duyệt đơn chuyển khoản)
   */
  async confirmBankTransfer(orderId: string, note?: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${orderId}/confirm-bank-transfer`, null, {
      params: { note }
    });
    return response.data;
  },

  /**
   * PUT /api/v1/orders/{orderId}/cancel
   * Hủy đơn hàng
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${orderId}/cancel`, null, {
      params: {
        reason: reason || 'Người dùng yêu cầu hủy đơn hàng'
      }
    });
    return response.data;
  }
};