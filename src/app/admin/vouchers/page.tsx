"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useVoucher } from '@/hooks/useVoucher';
import { Voucher, VoucherRequest } from '@/types/voucher';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  X,
  Ticket,
  Percent,
  CircleDollarSign,
  AlertCircle
} from 'lucide-react';

export default function AdminVouchersPage() {
  const { getActiveVouchers, createVoucher } = useVoucher();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [voucherType, setVoucherType] = useState<'FIXED_AMOUNT' | 'PERCENTAGE'>('FIXED_AMOUNT');
  const [value, setValue] = useState<number>(0);
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [submitting, setSubmitting] = useState(false);

  // Notification state
  const [toast, setToast] = useState<string | null>(null);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getActiveVouchers();
      setVouchers(res || []);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Lỗi khi tải danh sách Voucher.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleOpenCreate = () => {
    setCode('');
    setVoucherType('FIXED_AMOUNT');
    setValue(0);
    setMinOrderValue(0);
    setMaxDiscountAmount(0);
    
    // Set default dates: start now, end in 7 days
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 7);
    
    setStartDate(now.toISOString().slice(0, 16));
    setEndDate(future.toISOString().slice(0, 16));
    setUsageLimit(100);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || value <= 0) return;

    if (new Date(startDate) >= new Date(endDate)) {
      alert('Ngày bắt đầu phải trước ngày kết thúc!');
      return;
    }

    setSubmitting(true);
    try {
      const payload: VoucherRequest = {
        code: code.trim().toUpperCase(),
        voucherType,
        value,
        minOrderValue: minOrderValue > 0 ? minOrderValue : undefined,
        maxDiscountAmount: maxDiscountAmount > 0 ? maxDiscountAmount : undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        usageLimit: usageLimit > 0 ? usageLimit : undefined,
        isActive: true
      };

      await createVoucher(payload);
      setShowModal(false);
      fetchVouchers();
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi tạo Voucher.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return '0đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6 font-sans relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          {toast}
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Voucher Khuyến mãi</h1>
          <p className="text-xs text-slate-500 mt-1">Danh sách các mã giảm giá đang hoạt động.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 h-11 px-5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo mã Voucher
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải danh sách voucher...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-rose-500 text-sm font-semibold">{error}</div>
        ) : vouchers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="text-sm font-bold block">Không có voucher hoạt động</span>
            <span className="text-xs text-slate-400 block mt-1">Hãy nhấp vào nút &quot;Tạo mã Voucher&quot; để phát hành.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Mã Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Loại ưu đãi</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Giá trị giảm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Đơn tối thiểu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Đã dùng / Giới hạn</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Hạn sử dụng</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-bold text-slate-900 font-mono">{v.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${v.voucherType === 'PERCENTAGE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {v.voucherType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-900">
                        {v.voucherType === 'PERCENTAGE' ? `${v.value}%` : formatCurrency(v.value)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600">{formatCurrency(v.minOrderValue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 font-medium">
                        {v.usedCount} / {v.usageLimit || '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(v.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => triggerToast('Backend chưa hỗ trợ cập nhật/xóa Voucher')}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer border-none transition-colors"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer border-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-6">Tạo mã Voucher mới</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Mã Code giảm giá</label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MÃ GIẢM GIÁ (VD: SALE10K)"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 font-mono uppercase"
                    required
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Loại giảm giá</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setVoucherType('FIXED_AMOUNT')}
                      className={`flex-1 h-11 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-colors ${voucherType === 'FIXED_AMOUNT' ? 'bg-cyan-50 border-cyan-300 text-cyan-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <CircleDollarSign className="w-4 h-4" />
                      Số tiền cố định (đ)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setVoucherType('PERCENTAGE')}
                      className={`flex-1 h-11 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-colors ${voucherType === 'PERCENTAGE' ? 'bg-cyan-50 border-cyan-300 text-cyan-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Percent className="w-4 h-4" />
                      Phần trăm (%)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Giá trị giảm {voucherType === 'PERCENTAGE' ? '(%)' : '(VND)'}
                  </label>
                  <input 
                    type="number" 
                    value={value || ''}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={1}
                    max={voucherType === 'PERCENTAGE' ? 100 : 999999999}
                    placeholder="VD: 50000 hoặc 10"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Giá trị đơn hàng tối thiểu (đ)</label>
                  <input 
                    type="number" 
                    value={minOrderValue || ''}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    placeholder="VD: 200000"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {voucherType === 'PERCENTAGE' && (
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700">Mức giảm tối đa (đ)</label>
                    <input 
                      type="number" 
                      value={maxDiscountAmount || ''}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      placeholder="VD: 100000 (để trống nếu không giới hạn)"
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ngày bắt đầu</label>
                  <input 
                    type="datetime-local" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ngày kết thúc</label>
                  <input 
                    type="datetime-local" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Số lượng mã phát hành (Usage Limit)</label>
                  <input 
                    type="number" 
                    value={usageLimit || ''}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    min={1}
                    placeholder="VD: 100"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 h-11 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Tạo Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
