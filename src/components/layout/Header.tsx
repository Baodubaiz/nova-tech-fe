"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes.config';
import { ShoppingCart, Search, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import cartService from '@/services/cart.service';
import { Cart } from '@/types/cart';

interface HeaderProps {
  onSearch?: (query: string) => void;
  cartTrigger?: number; // Prop để cập nhật số lượng giỏ hàng từ bên ngoài
}

export const Header: React.FC<HeaderProps> = ({ onSearch, cartTrigger = 0 }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart(user?.id);
        setCart(data);
      } catch (err) {
        console.warn('Lỗi khi lấy giỏ hàng:', err);
      }
    };
    fetchCart();
  }, [user, cartTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const totalCartItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 font-black text-white shadow-lg transition-transform group-hover:rotate-12">
              N
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              NOVATECH<span className="text-cyan-600">.</span>
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-md w-full mx-8">
          <input
            type="text"
            placeholder="Tìm kiếm linh kiện điện tử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-600">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative cursor-pointer p-2 text-slate-500 hover:text-cyan-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-black text-white shadow-md">
                {totalCartItems}
              </span>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Auth Block */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link 
                href={user?.role === 'ADMIN' ? routes.adminDashboard : (routes.userDashboard || '#')} 
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 no-underline"
              >
                <User className="w-4 h-4 text-cyan-600" />
                {user.name || 'Tài khoản'}
              </Link>
              <button 
                onClick={() => logout()}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-red-500 bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href={routes.login} 
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 no-underline"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Link>
              <Link 
                href={routes.register} 
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:opacity-90 no-underline shadow-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {/* Cart Icon for Mobile */}
          <div className="relative p-2 text-slate-500 hover:text-cyan-600">
            <ShoppingCart className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-black text-white">
                {totalCartItems}
              </span>
            )}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 focus:outline-none bg-transparent border-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm linh kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="h-px bg-slate-200 w-full" />

          {isAuthenticated && user ? (
            <div className="space-y-3">
              <Link 
                href={user?.role === 'ADMIN' ? routes.adminDashboard : (routes.userDashboard || '#')}
                className="block text-slate-600 hover:text-slate-900 font-medium no-underline"
              >
                Dashboard của bạn
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-red-500 hover:text-red-400 font-medium bg-transparent border-0 cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link 
                href={routes.login}
                className="block text-slate-600 hover:text-slate-900 font-medium no-underline"
              >
                Đăng nhập
              </Link>
              <Link 
                href={routes.register}
                className="block text-center py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl no-underline"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
