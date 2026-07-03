"use client";

import React, { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { OrderStatus } from '@/types/order';
import {
  FileText,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const {
    orders,
    totalElements,
    loading,
    error,
    fetchAllOrdersForAdmin,
    handleAdminUpdateStatus
  } = useOrder();

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const size = 10;

  // Tự động fetch lại khi đổi trang hoặc đổi bộ lọc trạng thái
  useEffect(() => {
    const filter = statusFilter === 'ALL' ? undefined : statusFilter;
    fetchAllOrdersForAdmin(page, size, filter);
  }, [page, statusFilter]);

  // Hàm xử lý đổi nhanh trạng thái đơn hàng (ví dụ: xác nhận đơn)
  const changeStatus = async (orderId: string, nextStatus: OrderStatus) => {
    if (confirm(`Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái ${nextStatus}?`)) {
      await handleAdminUpdateStatus(orderId, nextStatus, `Cập nhật bởi Admin`);
    }
  };

  // Helper hiển thị badge màu sắc cho từng trạng thái
  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
      PROCESSING: 'bg-blue-50 text-blue-700 border-blue-100',
      SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-100',
      RETURNED: 'bg-purple-50 text-purple-700 border-purple-100',
      COMPLETED: 'bg-green-50 text-green-700 border-green-100'
    };
    return (
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const totalPages = Math.ceil(totalElements / size);

  return (
    <div className="space-y-6 font-sans">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Quản lý Đơn hàng</h1>
          <p className="text-xs text-slate-500 mt-1">Hệ thống xử lý và quản lý toàn bộ hóa đơn khách hàng.</p>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | 'ALL');
              setPage(0); // Reset về trang đầu khi lọc
            }}
            className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả đơn hàng</option>
            <option value="PENDING">Chờ xử lý (PENDING)</option>
            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
            <option value="SHIPPING">Đang giao (SHIPPING)</option>
            <option value="DELIVERED">Đã giao (DELIVERED)</option>
            <option value="CANCELED">Đã hủy (CANCELED)</option>
          </select>
        </div>
      </div>

      {/* Vùng hiển thị lỗi nếu có */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Thùng chứa danh sách / Loading */}
      {loading && orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-24 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-3 font-medium">Đang tải dữ liệu đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Khi trống đơn hàng */
        <div className="bg-white border border-slate-200 rounded-[2rem] p-16 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 border border-slate-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-950">Không tìm thấy đơn hàng</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Hệ thống hiện tại chưa ghi nhận đơn hàng nào khớp với trạng thái được chọn.
            </p>
          </div>
        </div>
      ) : (
        /* Bảng hiển thị danh sách đơn hàng thực tế */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 tracking-wider">
                    <th className="py-4 px-6">Mã Đơn Hàng</th>
                    <th className="py-4 px-4">Ngày Đặt</th>
                    <th className="py-4 px-4">Khách Hàng</th>
                    <th className="py-4 px-4">Tổng Tiền</th>
                    <th className="py-4 px-4">Trạng Thái</th>
                    <th className="py-4 px-6 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Mã đơn */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {order.orderCode || order.id.split('-')[0].toUpperCase()}
                      </td>

                      {/* Ngày đặt */}
                      <td className="py-4 px-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>

                      {/* Thông tin người nhận */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {order.receiverName}
                          </div>
                          <div className="text-[11px] text-slate-400">{order.phone}</div>
                        </div>
                      </td>

                      {/* Tổng tiền */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                      </td>

                      {/* Trạng thái đơn */}
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Nút hành động */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">

                          {/* Nút Xem chi tiết */}
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Duyệt nhanh đơn PENDING thành CONFIRMED */}
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => changeStatus(order.id, OrderStatus.PROCESSING)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                title="Xác nhận đơn"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Nhập lý do hủy đơn:');
                                  if (reason) handleAdminUpdateStatus(order.id, OrderStatus.CANCELLED, reason);
                                }}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Hủy đơn"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Chuyển sang SHIPPING khi đang CONFIRMED */}
                          {order.status === OrderStatus.PROCESSING && (
                            <button
                              onClick={() => changeStatus(order.id, OrderStatus.SHIPPED)}
                              className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                            >
                              Giao hàng
                            </button>
                          )}

                          {/* Hoàn thành đơn hàng khi đang SHIPPING */}
                          {order.status === OrderStatus.SHIPPED && (
                            <button
                              onClick={() => changeStatus(order.id, OrderStatus.DELIVERED)}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                            >
                              Hoàn tất
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-xs text-slate-500">
                Hiển thị trang <span className="font-bold text-slate-800">{page + 1}</span> / {totalPages} ({totalElements} đơn hàng)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1 || loading}
                  className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}