import apiClient from './api-client';
import { Voucher, VoucherRequest } from '@/types/voucher';

export const voucherService = {
  async getActiveVouchers(): Promise<Voucher[]> {
    const response = await apiClient.get<Voucher[]>('/vouchers');
    return response.data || [];
  },

  async createVoucher(request: VoucherRequest): Promise<Voucher> {
    const response = await apiClient.post<Voucher>('/vouchers', request);
    return response.data;
  }
};

export default voucherService;
