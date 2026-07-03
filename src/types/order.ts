export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    RETURNED = 'RETURNED',
    // Thêm các trạng thái khác nếu hệ thống của bạn có dùng nhé
}

export enum PaymentMethod {
    COD = 'COD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    MOMO = 'MOMO',
    VNPAY = 'VNPAY',
    PAYOS = 'PAYOS', // Tích hợp PayOS cho hệ thống thanh toán tự động
}

export enum OrderPaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED',
}

// Định nghĩa interface cho mối quan hệ (bạn có thể import từ file user.ts hoặc voucher.ts của bạn)
export interface UserSummary {
    id: string;
    email: string;
    fullName?: string;
}

export interface VoucherSummary {
    id: string;
    code: string;
    discountValue: number;
}

export interface Order {
    id: string; // UUID mapping sang string trong TypeScript
    user?: UserSummary; // FetchType.LAZY nên có thể trả về object hoặc chỉ id tùy API build
    orderCode: string;
    voucher?: VoucherSummary | null; // Có thể null nếu không áp dụng mã giảm giá
    totalAmount: number; // BigDecimal quy đổi thành dạng number (hoặc string nếu bạn muốn chuẩn xác số thập phân lớn)

    // Thông tin giao hàng
    receiverName: string;
    phone: string;
    addressLine: string;
    ward?: string | null;
    district?: string | null;
    city: string;
    country: string;

    // Trạng thái đơn hàng & Thanh toán
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: OrderPaymentStatus;

    // Timestamps
    createdAt: string; // Định dạng ISO String (yyyy-MM-ddTHH:mm:ss)
    updatedAt?: string;
}

// DTO tiện ích khi bạn gửi dữ liệu tạo đơn hàng mới từ Frontend lên Backend
export interface CreateOrderRequest {
    voucherId?: string | null;
    receiverName: string;
    phone: string;
    addressLine: string;
    ward?: string;
    district?: string;
    city: string;
    country?: string;
    paymentMethod: PaymentMethod;
}

export interface CheckoutRequest {
  voucherCode?: string;
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  city: string;
  paymentMethod: PaymentMethod;
}

export interface OrderItemResponse {
  id: string;
  productVariantId: string;
  variantName: string;
  priceAtPurchase: number;
  quantity: number;
}

export interface OrderResponse extends Order {
  items?: OrderItemResponse[];
}

export interface PaymentRequest {
  orderCode: string;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  id: string;
  paymentCode: string;
  orderCode: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: PaymentMethod;
  checkoutUrl?: string;
  qrCode?: string;
  description?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  paidAt?: string;
  expiredAt?: string;
  createdAt?: string;
}