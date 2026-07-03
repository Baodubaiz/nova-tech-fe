"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes.config';
import { ShoppingCart, Search, Menu, X, LogIn, LogOut, User, Smartphone, Laptop, Monitor, Headphones, HardDrive, Cpu, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Cart } from '@/types/cart';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

interface HeaderProps {
  onSearch?: (query: string) => void;
  cartTrigger?: number;
}

const CATEGORIES = [
  { name: 'Điện thoại', icon: Smartphone, href: '/category/dien-thoai' },
  { name: 'Laptop', icon: Laptop, href: '/category/laptop' },
  { name: 'PC - Linh kiện', icon: Cpu, href: '/category/pc-linh-kien' },
  { name: 'Màn hình', icon: Monitor, href: '/category/man-hinh' },
  { name: 'Phụ kiện', icon: Headphones, href: '/category/phu-kien' },
  { name: 'Thiết bị lưu trữ', icon: HardDrive, href: '/category/luu-tru' },
];

export const Header: React.FC<HeaderProps> = ({ onSearch, cartTrigger = 0 }) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [logoError, setLogoError] = useState(false);

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart(user?.id);
        setCart(data);
      } catch (err) {
        console.warn('Lỗi khi lấy giỏ hàng:', err);
      }
    };
    fetchCart();
  }, [user, cartTrigger]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim().length === 0) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);
      try {
        const response = await productService.getProducts(0, 5, debouncedSearchQuery);
        setSearchResults(response.content || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim().length > 0) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Bar - Primary Blue Background */}
      <div className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group no-underline shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-black text-xl shadow-md transition-all group-hover:scale-105">
              N
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-white uppercase">
              NOVA<span className="text-cyan-400">TECH</span>
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:flex relative flex-1 max-w-2xl mx-4 group">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex">
              <input
                type="text"
                placeholder="Nhập tên điện thoại, máy tính, phụ kiện... cần tìm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length > 0) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full h-10 px-4 pr-10 rounded-lg bg-white border-none text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-slate-100 rounded-r-lg text-slate-600 hover:bg-slate-200 transition-colors">
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
              </button>
            </form>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-[60]">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.slug || product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 no-underline transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <Image src={product.images[0].url} alt={product.name} width={40} height={40} className="object-cover" />
                          ) : (
                            <span className="text-xs text-slate-400">No img</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.variants?.[0]?.price?.toLocaleString('vi-VN')}đ</p>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full p-3 text-sm font-bold text-blue-600 hover:bg-blue-50 bg-white border-none cursor-pointer transition-colors"
                    >
                      Xem tất cả kết quả cho "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 font-medium">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions - Right */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {/* Auth Block */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link
                  href={user?.role === 'ADMIN' ? routes.adminDashboard : (routes.userDashboard || '#')}
                  className="flex flex-col items-center gap-1 text-white hover:text-blue-200 no-underline"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[11px] truncate max-w-[80px]">{user.name || 'Tài khoản'}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex flex-col items-center gap-1 text-white hover:text-red-300 bg-transparent border-0 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[11px]">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link
                  href={routes.login}
                  className="flex flex-col items-center gap-1 text-white hover:text-blue-200 no-underline"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-[11px]">Đăng nhập</span>
                </Link>
                <Link
                  href={routes.register}
                  className="px-4 py-2 bg-white text-primary text-sm font-bold rounded-lg hover:bg-blue-50 no-underline shadow-sm transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative flex flex-col items-center gap-1 text-white hover:text-blue-200 no-underline cursor-pointer group">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-slate-900 shadow-md transform group-hover:scale-110 transition-transform">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">Giỏ hàng</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4 shrink-0">
            <Link href="/cart" className="relative text-white">
              <ShoppingCart className="w-6 h-6" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-black text-slate-900">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none bg-transparent border-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Nav Bar - Categories */}
      <div className="hidden md:block bg-slate-900 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between overflow-x-auto py-2 scrollbar-hide">
            <ul className="flex items-center gap-1 min-w-max m-0 p-0 list-none">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.name}>
                    <Link
                      href={category.href}
                      className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors no-underline"
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary text-white px-4 py-4 space-y-4 border-t border-blue-700 shadow-xl absolute top-16 left-0 w-full z-40">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 rounded-l-lg bg-white border-none text-sm text-slate-900 focus:outline-none"
            />
            <button type="submit" className="bg-slate-100 text-slate-600 px-4 rounded-r-lg">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-700">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center gap-2 p-2 rounded bg-blue-800/50 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800 no-underline"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-blue-700 pt-4 mt-2">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-200">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user.name || 'Tài khoản'}</span>
                </div>
                <Link
                  href={user?.role === 'ADMIN' ? routes.adminDashboard : (routes.userDashboard || '#')}
                  className="block text-white font-medium no-underline py-2"
                >
                  Dashboard của bạn
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-red-300 font-medium bg-transparent border-0 cursor-pointer py-2"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href={routes.login}
                  className="flex items-center gap-2 text-white font-medium no-underline py-2"
                >
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
                </Link>
                <Link
                  href={routes.register}
                  className="block text-center py-3 bg-white text-primary font-bold rounded-lg no-underline mt-2 shadow-sm"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

