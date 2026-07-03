"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { PaymentResponse, PaymentMethod } from '@/types/order';
import { CheckCircle2, AlertTriangle, QrCode, Copy, RefreshCw, Landmark, Truck, CreditCard } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { getPaymentByOrder, createPayment, cancelPayment, isLoading } = usePayment();
  const { user } = useAuth();
  
  const orderCode = params?.orderCode as string;
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [payosLoading, setPayosLoading] = useState(false);
  const [payosError, setPayosError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Tạo / lấy lại PayOS checkout link
  const generatePayosLink = async (paymentData?: PaymentResponse) => {
    const target = paymentData || payment;
    if (!target) return;
    try {
      setPayosLoading(true);
      setPayosError(null);
      const result = await createPayment({
        orderCode: target.orderCode,
        amount: target.amount,
        description: target.paymentCode || `Thanh toan don hang ${target.orderCode}`,
        paymentMethod: target.paymentMethod,
      });
      if (result.checkoutUrl) {
        setCheckoutUrl(result.checkoutUrl);
        // Lưu lại để dùng sau nếu cần
        sessionStorage.setItem(`payos_checkout_${target.orderCode}`, result.checkoutUrl);
      } else {
        setPayosError('Không thể tạo link thanh toán. Vui lòng liên hệ hỗ trợ.');
      }
    } catch (err: any) {
      const msg: string = err.message || '';
      // Backend báo đã có giao dịch → link cũ đã hết hạn, không thể tạo mới
      if (msg.includes('đã có giao dịch') || msg.includes('already') || msg.includes('exist')) {
        setPayosError('Link thanh toán đã hết hạn. Vui lòng hủy giao dịch và đặt hàng lại, hoặc liên hệ hỗ trợ.');
      } else {
        setPayosError(msg || 'Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } finally {
      setPayosLoading(false);
    }
  };

  const fetchPayment = async () => {
    if (!orderCode) return;
    try {
      setError(null);
      const data = await getPaymentByOrder(orderCode);
      setPayment(data);

      // Nếu là PAYOS + PENDING
      if (data.paymentMethod === 'PAYOS' && data.status === 'PENDING') {
        // 1. Ưu tiên checkoutUrl từ response
        if (data.checkoutUrl) {
          setCheckoutUrl(data.checkoutUrl);
        } else {
          // 2. Thử lấy từ sessionStorage (được lưu lúc checkout)
          const saved = sessionStorage.getItem(`payos_checkout_${orderCode}`);
          if (saved) {
            setCheckoutUrl(saved);
          } else {
            // 3. Cuối cùng mới gọi API tạo mới
            await generatePayosLink(data);
          }
        }
      } else if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
      }
    } catch (err: any) {
      console.warn('Lỗi khi lấy thông tin giao dịch:', err);
      setError(err.message || 'Không thể lấy thông tin thanh toán.');
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [orderCode]);

  // Handle copy text helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCancelPayment = async () => {
    if (!payment) return;
    try {
      await cancelPayment(payment.id);
      await fetchPayment();
    } catch (err: any) {
      alert(err.message || 'Hủy thanh toán thất bại.');
    }
  };

  // Default Fallbacks
  const bankName = payment?.bankName || 'MB';
  const bankAccountNumber = payment?.bankAccountNumber || '19035688829019';
  const bankAccountName = payment?.bankAccountName || 'CONG TY CONG NGHE NOVATECH';
  const amount = payment?.amount || 0;
  const description = payment?.paymentCode || `Thanh toan don hang ${orderCode}`;

  // VietQR Image API
  const vietQrUrl = `https://img.vietqr.io/image/${bankName}-${bankAccountNumber}-compact.png?amount=${amount}&addInfo=${description}&accountName=${encodeURIComponent(bankAccountName)}`;

  if (isLoading && !payment) {
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

      <main className="flex-grow z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 shadow-md border-none cursor-pointer transition-all"
            >
              Quay lại Trang chủ
            </button>
          </div>
        ) : !payment ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
            <p className="text-slate-500">Đang tìm thông tin giao dịch...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Payment Method Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 text-center shadow-sm">
              {payment.status === 'SUCCESS' ? (
                <>
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Đã Thanh Toán Thành Công!</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Đơn hàng <strong>{orderCode}</strong> đã được thanh toán và đang được xử lý chuẩn bị giao hàng.
                  </p>
                </>
              ) : payment.paymentMethod === 'COD' ? (
                <>
                  <Truck className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Đặt Hàng Thành Công!</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Đơn hàng <strong>{orderCode}</strong> đã được tiếp nhận. Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng (COD).
                  </p>
                </>
              ) : payment.status === 'CANCELLED' || payment.status === 'FAILED' ? (
                <>
                  <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Giao dịch đã bị Hủy hoặc Thất Bại</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Giao dịch thanh toán cho đơn hàng <strong>{orderCode}</strong> không hoàn thành thành công.
                  </p>
                </>
              ) : (
                <>
                  <RefreshCw className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin-slow" />
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Chờ Thanh Toán</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Vui lòng hoàn tất thanh toán số tiền <strong>{amount.toLocaleString('vi-VN')}đ</strong> cho đơn hàng <strong>{orderCode}</strong>.
                  </p>
                </>
              )}
            </div>

            {/* PayOS Redirection Info */}
            {payment.paymentMethod === 'PAYOS' && payment.status === 'PENDING' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center">
                <CreditCard className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">Cổng thanh toán PayOS</h3>
                <p className="text-slate-500 text-sm text-center mb-6 max-w-sm">
                  Bạn sẽ được chuyển hướng an toàn tới giao diện thanh toán PayOS để thanh toán qua Ngân hàng số hoặc QR Code.
                </p>
                {payosLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm">Đang tạo link thanh toán PayOS...</p>
                  </div>
                ) : checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 shadow-md no-underline text-center cursor-pointer transition-all"
                  >
                    Thanh toán ngay bằng PayOS
                  </a>
                ) : payosError ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <p className="text-red-500 text-xs font-semibold text-center">{payosError}</p>
                    <button
                      onClick={() => generatePayosLink()}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm border-none cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Thử lại
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm">Đang tải link thanh toán...</p>
                  </div>
                )}
              </div>
            )}

            {/* Bank Transfer Instructions */}
            {payment.paymentMethod === 'BANK_TRANSFER' && payment.status === 'PENDING' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Bank Account Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Landmark className="w-5 h-5" />
                    <span>Thông tin chuyển khoản</span>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold">Ngân hàng</span>
                        <span className="text-sm font-bold text-slate-800">{bankName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(bankName, 'ngânhàng')}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold">Số tài khoản</span>
                        <span className="text-sm font-bold text-slate-800">{bankAccountNumber}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(bankAccountNumber, 'sốtài khoản')}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold">Chủ tài khoản</span>
                        <span className="text-sm font-bold text-slate-800">{bankAccountName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(bankAccountName, 'chủ tài khoản')}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold">Số tiền chuyển</span>
                        <span className="text-sm font-black text-blue-600">{amount.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <button
                        onClick={() => handleCopy(amount.toString(), 'sốtiền')}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold">Nội dung chuyển khoản</span>
                        <span className="text-sm font-black text-slate-800">{description}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(description, 'nộidung')}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {copiedText && (
                    <div className="p-2 bg-slate-900 text-white rounded-lg text-xs text-center font-bold">
                      Đã sao chép {copiedText} vào bộ nhớ tạm!
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <img src={vietQrUrl} alt="VietQR Code" className="w-44 h-44 object-contain" />
                  </div>
                  <span className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" /> Quét mã QR để chuyển khoản nhanh
                  </span>
                </div>

              </div>
            )}

            {/* Quick Actions / Refresh / Back */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl active:scale-95 border-none cursor-pointer transition-all text-center text-sm"
              >
                Về Trang Chủ
              </button>
              
              {payment.status === 'PENDING' && (
                <>
                  <button
                    onClick={fetchPayment}
                    className="py-4 px-6 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" /> Cập nhật Trạng thái
                  </button>

                  <button
                    onClick={handleCancelPayment}
                    className="py-4 px-6 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl active:scale-95 cursor-pointer border-none transition-all text-sm"
                  >
                    Hủy Giao dịch
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
