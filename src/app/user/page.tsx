"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/services/user.service';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, Phone, Mail, Shield, UserCog, ShoppingBag, ArrowLeft, Save, Edit3, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders'>('profile');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state with user
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);

    try {
      const roleId = typeof user.role === 'object' && user.role !== null ? user.role.id : undefined;
      const updatedUser = await userService.updateUser(user.id, {
        name,
        phone,
        avatarUrl: avatarUrl || undefined,
        roleId,
        isActive: true
      });
      
      // Update global store state so Header and UI reflect new data
      updateUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (error: unknown) {
      console.error(error);
      setMessage({ type: 'error', text: (error as Error).message || 'Có lỗi xảy ra khi cập nhật thông tin.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleName = () => {
    if (!user?.role) return 'Thành viên';
    return typeof user.role === 'string' ? user.role : user.role.name;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 no-underline text-sm font-semibold transition-colors">
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
                  <div className="w-full h-full bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
                    {name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{name || 'Khách'}</h2>
              <p className="text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-full px-2.5 py-0.5 inline-block mt-2">
                {getRoleName()}
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-1">
              <button 
                onClick={() => { setActiveTab('profile'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-cyan-50 text-cyan-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <UserCog className="w-5 h-5" />
                Thông tin cá nhân
              </button>
              <button 
                onClick={() => { setActiveTab('orders'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'orders' ? 'bg-cyan-50 text-cyan-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <ShoppingBag className="w-5 h-5" />
                Lịch sử mua hàng
              </button>
              <button 
                onClick={() => { setActiveTab('security'); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left border-none cursor-pointer transition-all ${activeTab === 'security' ? 'bg-cyan-50 text-cyan-600' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[400px] flex flex-col">
              
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
                      
                      {/* Name field */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={!isEditing || isSaving}
                            placeholder="Nhập họ và tên..."
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all font-medium"
                          />
                          <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Phone field */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            disabled={!isEditing || isSaving}
                            placeholder="Nhập số điện thoại..."
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all font-medium"
                          />
                          <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Email field (Read only) */}
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

                      {/* Avatar field */}
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Đường dẫn ảnh đại diện (Avatar URL)</label>
                        <input 
                          type="text" 
                          value={avatarUrl} 
                          onChange={(e) => setAvatarUrl(e.target.value)} 
                          disabled={!isEditing || isSaving}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 disabled:bg-slate-50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all font-medium"
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
                          className="px-5 h-11 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:opacity-90 disabled:opacity-50 text-white text-sm font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border-none shadow-md"
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
                  <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Thiết lập bảo mật</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Hệ thống xác thực JWT bảo mật cao. Hiện tại chức năng đổi mật khẩu đang được đồng bộ và sẽ khả dụng trong các bản cập nhật API tiếp theo.
                  </p>
                </div>
              )}

              {/* Order history placeholder Tab */}
              {activeTab === 'orders' && (
                <div className="flex-grow flex flex-col justify-center items-center text-center max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Lịch sử đơn hàng</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Bạn chưa có đơn đặt hàng nào gần đây. Hãy chọn sản phẩm yêu thích và bắt đầu xây dựng cấu hình PC mơ ước của mình nhé!
                  </p>
                  <Link 
                    href="/" 
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white text-sm font-bold rounded-xl hover:opacity-90 no-underline shadow-md cursor-pointer transition-opacity border-none"
                  >
                    Tiếp tục mua sắm
                  </Link>
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
