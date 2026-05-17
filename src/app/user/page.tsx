"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
          {user?.name?.[0] || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Xin chào, {user?.name || 'Khách'}!</h1>
        <p className="text-slate-500 mb-8">Chào mừng bạn đến với bảng điều khiển cá nhân NovaTech.</p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl text-left">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Email</p>
            <p className="text-slate-700 font-medium">{user?.email}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-left">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Vai trò</p>
            <p className="text-slate-700 font-medium">{typeof user?.role === 'string' ? user?.role : user?.role?.name}</p>
          </div>
        </div>

        <Button 
          onClick={logout}
          className="mt-8 w-full h-12 bg-red-50 text-red-600 hover:bg-red-100 border-none font-bold rounded-xl transition-all"
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
