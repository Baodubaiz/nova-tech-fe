export type VoucherType = 'FIXED_AMOUNT' | 'PERCENTAGE';

export interface Voucher {
  id: string;
  code: string;
  voucherType: VoucherType;
  value: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface VoucherRequest {
  code: string;
  voucherType: VoucherType;
  value: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string; // ISO String
  endDate: string; // ISO String
  usageLimit?: number;
  isActive?: boolean;
}
