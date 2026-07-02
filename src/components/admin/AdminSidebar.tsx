"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Bookmark, 
  FileText, 
  Users, 
  Ticket, 
  Database, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Sản phẩm', href: '/admin/products', icon: ShoppingBag },
    { name: 'Danh mục', href: '/admin/categories', icon: Layers },
    { name: 'Thương hiệu', href: '/admin/brands', icon: Bookmark },
    { name: 'Đơn hàng', href: '/admin/orders', icon: FileText },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Voucher', href: '/admin/vouchers', icon: Ticket },
    { name: 'Tồn kho', href: '/admin/inventory', icon: Database },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-none transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand/Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-600/20">
              N
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-wider">NOVATECH</span>
              <span className="block text-[10px] font-bold text-cyan-600 uppercase tracking-widest mt-0.5">Admin Control</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold no-underline transition-all ${isActive ? 'bg-cyan-50 text-cyan-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left border-none cursor-pointer bg-transparent text-rose-600 hover:bg-rose-50/50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất hệ thống
          </button>
        </div>
      </aside>
    </>
  );
}
