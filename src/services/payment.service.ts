import apiClient from './api-client';
import { PaymentRequest, PaymentResponse } from '@/types/order';

export const paymentService = {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post<{ data: PaymentResponse }>('/payments', paymentData);
    return response.data.data;
  },

  async getPaymentByOrder(orderCode: string): Promise<PaymentResponse> {
    const response = await apiClient.get<{ data: PaymentResponse }>(`/payments/by-order/${orderCode}`);
    return response.data.data;
  },

  async cancelPayment(id: string): Promise<void> {
    await apiClient.post(`/payments/${id}/cancel`);
  }
};

export default paymentService;
