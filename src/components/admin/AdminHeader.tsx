"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name[0].toUpperCase();
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Back to website button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 no-underline text-xs font-bold transition-colors bg-slate-50 hover:bg-cyan-50/50 border border-slate-100 rounded-full px-4 py-2"
        >
          <ShoppingBag className="w-4 h-4 text-cyan-600" />
          Xem trang cửa hàng
        </Link>
      </div>

      {/* Account Info Panel */}
      <div className="flex items-center gap-6">
        
        {/* Notification Icon (Visual option) */}
        <button className="relative w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100 rounded-full flex items-center justify-center cursor-pointer transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-sm font-bold text-slate-900">{user?.name || 'Quản trị viên'}</span>
            <span className="block text-[10px] font-bold text-slate-400 mt-0.5">{user?.email || 'admin@novatech.com'}</span>
          </div>

          <div className="relative w-10 h-10">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name || 'Admin'} 
                className="w-full h-full rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-full h-full bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center font-bold text-sm border border-cyan-100">
                {getInitials(user?.name)}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
