import { useState } from 'react';
import { paymentService } from '@/services/payment.service';
import { PaymentRequest, PaymentResponse } from '@/types/order';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentService.createPayment(paymentData);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khởi tạo thanh toán';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentByOrder = async (orderCode: string): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentService.getPaymentByOrder(orderCode);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi tải thông tin thanh toán';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPayment = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await paymentService.cancelPayment(id);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi hủy thanh toán';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayment,
    getPaymentByOrder,
    cancelPayment,
    isLoading,
    error
  };
};

export default usePayment;
