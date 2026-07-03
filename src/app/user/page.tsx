"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/hooks/useUser';
import { useOrder } from '@/hooks/useOrder';
import { orderService } from '@/services/order.service';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderResponse } from '@/types/order';
import { 
  User, 
  Phone, 
  Mail, 
  Shield, 
  UserCog, 
  ShoppingBag, 
  ArrowLeft, 
  Save, 
  Edit3, 
  Loader2,
  Calendar,
  CreditCard,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Hourglass
} from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { updateUser: updateAuthStoreUser } = useAuthStore();
  const userHook = useUser();
  const { getMyOrders, isLoading: ordersLoading } = useOrder();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders'>('profile');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders State
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  // Sync state with user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (!user || activeTab !== 'orders') return;

    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(user.id);
        // Sắp xếp đơn hàng mới nhất lên đầu
        const sorted = (data || []).sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(sorted);
      } catch (err) {
        console.error('Lỗi khi tải danh sách đơn hàng:', err);
      }
    };

    fetchOrders();
  }, [user, activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);

    try {
      const updatedUser = await userHook.updateUser(user.id, {
        name,
        phone,
        avatarUrl: avatarUrl || undefined
      });
      
      updateAuthStoreUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (error: unknown) {
      console.error(error);
      setMessage({ type: 'error', text: (error as Error).message || 'Có lỗi xảy ra khi cập nhật thông tin.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    try {
      setIsSaving(true);
      await orderService.cancelOrder(orderId, user.id, 'Khách hàng chủ động hủy đơn hàng.');
      setMessage({ type: 'success', text: 'Hủy đơn hàng thành công!' });
      
      // Reload orders list
      if (user) {
        const data = await getMyOrders(user.id);
        const sorted = (data || []).sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(sorted);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleName = () => {
    if (!user?.role) return 'Thành viên';
    return typeof user.role === 'string' ? user.role : user.role.name;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Hourglass className="w-3.5 h-3.5" /> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đã xác nhận</span>;
      case 'PROCESSING':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang chuẩn bị</span>;
      case 'SHIPPING':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">🚚 Đang giao hàng</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">✅ Đã giao hàng</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">🏆 Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100">ĐÃ THANH TOÁN</span>;
      case 'UNPAID':
        return <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded text-[10px] border border-rose-100">CHƯA THANH TOÁN</span>;
      case 'FAILED':
        return <span className="text-red-700 font-extrabold bg-red-50 px-2 py-0.5 rounded text-[10px] border border-red-100">THẤT BẠI</span>;
      case 'EXPIRED':
        return <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200">HẾT HẠN</span>;
      default:
        return <span className="text-slate-600 font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 no-underline text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại cửa hàng
          </Link>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Profile Card & Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={name} 
                    className="w-full h-full rounded-full object-cover border-2 border-slate-200"
                    onError={() => setAvatarUrl('')}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
                    {name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{name || 'Khách'}</h2>
              <p className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 inline-block mt-2">
                {getRoleName()}
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-1">
              <button 
                onClick={() => { setActiveTab('profile'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <UserCog className="w-5 h-5" />
                Thông tin cá nhân
              </button>
              <button 
                onClick={() => { setActiveTab('orders'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <ShoppingBag className="w-5 h-5" />
                Lịch sử mua hàng
              </button>
              <button 
                onClick={() => { setActiveTab('security'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Shield className="w-5 h-5" />
                Bảo mật & Mật khẩu
              </button>

              <div className="h-px bg-slate-100 my-3" />

              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer bg-transparent text-red-500 hover:bg-red-50/50 transition-all"
              >
                <User className="w-5 h-5 rotate-180" />
                Đăng xuất tài khoản
              </button>
            </div>

          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[450px] flex flex-col">
              
              {/* Alert Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm border font-semibold animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                  {message.text}
                </div>
              )}

              {/* Profile Details Tab */}
              {activeTab === 'profile' && (
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Hồ sơ cá nhân</h3>
                      <p className="text-xs text-slate-500 mt-1">Cập nhật và quản lý các thông tin cá nhân của bạn</p>
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSave} className="space-y-6 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={!isEditing || isSaving}
                            placeholder="Nhập họ và tên..."
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all font-medium"
                          />
                          <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            disabled={!isEditing || isSaving}
                            placeholder="Nhập số điện thoại..."
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all font-medium"
                          />
                          <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Địa chỉ Email</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            value={user?.email || ''} 
                            disabled
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-500 bg-slate-100/80 font-medium cursor-not-allowed"
                          />
                          <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[10px] text-slate-400">* Email là tài khoản đăng nhập không thể thay đổi</p>
                      </div>

                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Đường dẫn ảnh đại diện (Avatar URL)</label>
                        <input 
                          type="text" 
                          value={avatarUrl} 
                          onChange={(e) => setAvatarUrl(e.target.value)} 
                          disabled={!isEditing || isSaving}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all font-medium"
                        />
                      </div>

                    </div>

                    {isEditing && (
                      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsEditing(false);
                            setName(user?.name || '');
                            setPhone(user?.phone || '');
                            setAvatarUrl(user?.avatarUrl || '');
                          }}
                          disabled={isSaving}
                          className="px-5 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl cursor-pointer transition-colors"
                        >
                          Hủy bỏ
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="px-5 h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border-none shadow-md"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Lưu thay đổi
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Security / Password placeholder Tab */}
              {activeTab === 'security' && (
                <div className="flex-grow flex flex-col justify-center items-center text-center max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Thiết lập bảo mật</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Hệ thống xác thực JWT bảo mật cao. Hiện tại chức năng đổi mật khẩu đang được đồng bộ và sẽ khả dụng trong các bản cập nhật API tiếp theo.
                  </p>
                </div>
              )}

              {/* Order history Tab */}
              {activeTab === 'orders' && (
                <div className="flex-grow flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Lịch sử đơn hàng</h3>
                    <p className="text-xs text-slate-500 mt-1">Xem trạng thái đơn hàng và tiếp tục thanh toán các giao dịch chưa hoàn tất</p>
                  </div>

                  {ordersLoading && orders.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-xs text-slate-400 mt-2 font-bold">Đang tải danh sách đơn hàng...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex-grow flex flex-col justify-center items-center text-center max-w-sm mx-auto space-y-4 py-8">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Bạn chưa có đơn hàng nào</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Hãy chọn sản phẩm yêu thích và bắt đầu trải nghiệm mua sắm cùng NovaTech nhé!
                      </p>
                      <Link 
                        href="/" 
                        className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 no-underline shadow-md cursor-pointer transition-colors border-none"
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white hover:border-slate-300 transition-all">
                          
                          {/* Order Header */}
                          <div className="bg-slate-50 px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center gap-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{order.orderCode}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </div>
                          </div>

                          {/* Order Body / Items List */}
                          <div className="p-4 sm:p-6 space-y-4">
                            <div className="divide-y divide-slate-100">
                              {order.items?.map((item) => (
                                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex justify-between gap-4">
                                  <div>
                                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.variantName}</h4>
                                    <p className="text-xs text-slate-400 mt-1">Số lượng: {item.quantity}</p>
                                  </div>
                                  <span className="font-bold text-sm text-slate-900 shrink-0">
                                    {formatPrice(item.priceAtPurchase * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Order Details & Summary */}
                            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
                              <div className="space-y-1">
                                <p><strong>Người nhận:</strong> {order.receiverName} - {order.phone}</p>
                                <p><strong>Địa chỉ:</strong> {order.addressLine}{order.ward ? `, ${order.ward}` : ''}{order.district ? `, ${order.district}` : ''}, {order.city}</p>
                                <p className="flex items-center gap-1">
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <strong>Thanh toán qua:</strong> {order.paymentMethod}
                                </p>
                              </div>
                              <div className="sm:text-right flex flex-col justify-end gap-1 shrink-0">
                                <p className="text-xs text-slate-400">Tổng thanh toán</p>
                                <p className="text-lg font-black text-blue-600">{formatPrice(order.totalAmount)}</p>
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="border-t border-slate-100 pt-4 flex justify-end items-center gap-3">
                              {/* Resume Payment button if transaction is NOT completed */}
                              {order.paymentStatus === 'UNPAID' && order.status !== 'CANCELLED' && (
                                <Link 
                                  href={`/payment/${order.orderCode}`}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs no-underline shadow-sm transition-all"
                                >
                                  Thanh toán ngay
                                </Link>
                              )}

                              {/* Order Cancel button */}
                              {order.status === 'PENDING' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={isSaving}
                                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Hủy đơn hàng
                                </button>
                              )}
                            </div>

                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
