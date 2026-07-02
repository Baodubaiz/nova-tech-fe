"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        setIsAuthorized(false);
      } else {
        const role = typeof user.role === 'string' 
          ? user.role 
          : (user.role?.roleName || user.role?.name || 'USER');
        
        if (role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      }
    }
  }, [user, isAuthenticated, isLoading]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-600 mb-4" />
        <p className="text-sm font-bold">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-800 px-6 font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Truy cập bị từ chối</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tài khoản của bạn không có quyền truy cập vào bảng điều khiển quản trị viên. Vui lòng liên hệ với người quản lý hệ thống hoặc đăng nhập bằng tài khoản có thẩm quyền.
            </p>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex flex-col gap-2">
            <Link 
              href="/" 
              className="w-full flex items-center justify-center gap-2 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl no-underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Trang chủ
            </Link>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 h-11 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất & Đăng nhập lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
