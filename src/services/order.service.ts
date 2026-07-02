import apiClient from './api-client';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELED';

export const orderService = {
  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<unknown> {
    const response = await apiClient.put(`/orders/${orderId}/status`, null, {
      params: {
        status,
        note: note || `Trạng thái được cập nhật bởi Admin`
      }
    });
    return response.data;
  },

  async getAllOrdersPlaceholder(): Promise<never[]> {
    // Placeholder as backend doesn't support list all orders
    return [];
  }
};

export default orderService;
