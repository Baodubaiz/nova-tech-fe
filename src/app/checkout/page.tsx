"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrder';
import { useVoucher } from '@/hooks/useVoucher';
import { Cart } from '@/types/cart';
import { Voucher } from '@/types/voucher';
import { PaymentMethod } from '@/types/order';
import { MapPin, Phone, User, CreditCard, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { getCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { checkout, isLoading: orderLoading } = useOrder();
  const { getActiveVouchers } = useVoucher();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  
  // Shipping form state
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PAYOS);
  
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(true);

  // Authenticate check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user) return;
    
    // Load Cart
    const fetchCart = async () => {
      try {
        setCartLoading(true);
        const data = await getCart(user.id);
        setCart(data);
      } catch (err) {
        console.warn('Lỗi khi tải giỏ hàng:', err);
      } finally {
        setCartLoading(false);
      }
    };

    // Load Vouchers
    const fetchVouchers = async () => {
      try {
        const data = await getActiveVouchers();
        setVouchers(data || []);
      } catch (err) {
        console.warn('Lỗi khi tải danh sách voucher:', err);
      }
    };

    fetchCart();
    fetchVouchers();
  }, [user]);

  // Set default form values from user info if available
  useEffect(() => {
    if (user) {
      setReceiverName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleApplyVoucher = (code: string) => {
    setVoucherError(null);
    const codeClean = code.trim().toUpperCase();
    const match = vouchers.find(v => v.code.toUpperCase() === codeClean);
    if (!match) {
      setVoucherError('Voucher không tồn tại hoặc đã hết hạn.');
      setSelectedVoucher(null);
      return;
    }

    // Validate minimum order value
    const subTotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    if (match.minOrderValue && subTotal < match.minOrderValue) {
      setVoucherError(`Đơn hàng chưa đạt giá trị tối thiểu ${match.minOrderValue.toLocaleString('vi-VN')}đ`);
      setSelectedVoucher(null);
      return;
    }

    setSelectedVoucher(match);
    setVoucherCode(match.code);
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherCode('');
    setVoucherError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    if (!receiverName || !phone || !addressLine || !city) {
      setError('Vui lòng nhập đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    try {
      const checkoutData = {
        receiverName,
        phone,
        addressLine,
        ward,
        district,
        city,
        paymentMethod,
        voucherCode: selectedVoucher?.code || undefined
      };

      const orderResponse = await checkout(checkoutData, user.id);
      
      // Nếu backend trả về checkoutUrl (PayOS link), lưu lại để dùng trên trang payment
      if (orderResponse.checkoutUrl) {
        sessionStorage.setItem(`payos_checkout_${orderResponse.orderCode}`, orderResponse.checkoutUrl);
      }
      
      // Redirect to payment details page
      router.push(`/payment/${orderResponse.orderCode}`);
    } catch (err: any) {
      setError(err.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  const subTotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  // Calculate discount
  let discountAmount = 0;
  if (selectedVoucher) {
    if (selectedVoucher.voucherType === 'FIXED_AMOUNT') {
      discountAmount = selectedVoucher.value;
    } else {
      discountAmount = subTotal * (selectedVoucher.value / 100);
      if (selectedVoucher.maxDiscountAmount && discountAmount > selectedVoucher.maxDiscountAmount) {
        discountAmount = selectedVoucher.maxDiscountAmount;
      }
    }
  }

  const finalTotal = Math.max(0, subTotal - discountAmount);

  if (cartLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Header />

      <main className="flex-grow z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Checkout Form (2 cols on large screen) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
            
            {/* Shipping Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                <MapPin className="w-5 h-5 text-primary" />
                Thông Tin Nhận Hàng
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Họ và tên *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Số điện thoại *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="0987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Địa chỉ chi tiết (Số nhà, tên đường...) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 123 Đường Lê Lợi"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Phường / Xã</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phường Bến Thành"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Quận / Huyện</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quận 1"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Thành phố Hồ Chí Minh"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                <CreditCard className="w-5 h-5 text-primary" />
                Phương Thức Thanh Toán
              </h2>

              <div className="grid grid-cols-1 gap-4">
                
                {/* PayOS Option */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.PAYOS ? 'border-primary bg-blue-50/20' : 'border-slate-100 bg-white hover:border-slate-200'}`} title="Chọn PayOS để thanh toán nhanh qua QR Code, ATM hoặc thẻ nội địa. Khi xác nhận sẽ chuyển hướng tới cổng PayOS.">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PaymentMethod.PAYOS}
                      checked={paymentMethod === PaymentMethod.PAYOS}
                      onChange={() => setPaymentMethod(PaymentMethod.PAYOS)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="font-bold text-sm block">Thanh toán qua PayOS (QR Code / ATM / Visa)</span>
                      <span className="text-xs text-slate-500">Thanh toán tức thời bằng mã QR ngân hàng hoặc thẻ nội địa</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Phổ biến</span>
                </label>

                {/* Bank Transfer Option */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.BANK_TRANSFER ? 'border-primary bg-blue-50/20' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PaymentMethod.BANK_TRANSFER}
                      checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
                      onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="font-bold text-sm block">Chuyển khoản ngân hàng trực tiếp</span>
                      <span className="text-xs text-slate-500">Chuyển khoản thủ công và gửi minh chứng thanh toán</span>
                    </div>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.COD ? 'border-primary bg-blue-50/20' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PaymentMethod.COD}
                      checked={paymentMethod === PaymentMethod.COD}
                      onChange={() => setPaymentMethod(PaymentMethod.COD)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="font-bold text-sm block">Thanh toán khi nhận hàng (COD)</span>
                      <span className="text-xs text-slate-500">Nhận hàng và thanh toán bằng tiền mặt cho nhân viên giao hàng</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Cart Summary & Total */}
          <div className="space-y-6">
            
            {/* Items Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Giỏ hàng của bạn
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-4 mb-4 pr-1">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-800 truncate">{item.variantName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Số lượng: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm text-slate-900 shrink-0">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher Area */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Mã giảm giá (Voucher)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm shadow-inner uppercase"
                    />
                  </div>
                  {selectedVoucher ? (
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="px-4 h-10 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm border-none cursor-pointer"
                    >
                      Hủy
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher(voucherCode)}
                      className="px-4 h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm border-none cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  )}
                </div>

                {selectedVoucher && (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs flex justify-between items-center">
                    <span>Áp dụng thành công mã <strong>{selectedVoucher.code}</strong></span>
                    <span className="font-black">-{selectedVoucher.voucherType === 'FIXED_AMOUNT' ? `${selectedVoucher.value.toLocaleString('vi-VN')}đ` : `${selectedVoucher.value}%`}</span>
                  </div>
                )}
                {voucherError && (
                  <p className="text-xs text-red-500 font-medium px-1">{voucherError}</p>
                )}
              </div>

              {/* Final Totals */}
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-800">{subTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedVoucher && (
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Mã giảm giá</span>
                    <span className="font-semibold text-red-500">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-500 font-bold">Miễn phí</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between">
                  <span className="font-bold text-slate-900">Tổng thanh toán</span>
                  <span className="font-black text-xl text-blue-600">{finalTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={orderLoading || !cart?.items?.length}
                className={`w-full py-4 mt-6 text-white font-bold rounded-xl active:scale-95 shadow-md border-none cursor-pointer transition-all flex items-center justify-center gap-2 ${orderLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'}`}
              >
                {orderLoading ? 'Đang tạo đơn hàng...' : 'Xác nhận Đặt hàng'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
