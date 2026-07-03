import { voucherService } from '@/services/voucher.service';
import { VoucherRequest } from '@/types/voucher';

export const useVoucher = () => {
  const getActiveVouchers = async () => {
    return await voucherService.getActiveVouchers();
  };

  const createVoucher = async (request: VoucherRequest) => {
    return await voucherService.createVoucher(request);
  };

  return {
    getActiveVouchers,
    createVoucher
  };
};

export default useVoucher;
