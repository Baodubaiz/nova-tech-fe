"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { useBrand } from '@/hooks/useBrand';
import { useUser } from '@/hooks/useUser';
import { AuthUser } from '@/types/auth';
import { Product } from '@/types/product';
import { 
  ShoppingBag, 
  Layers, 
  Bookmark, 
  Users, 
  Coins, 
  FileText, 
  Loader2,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { getProducts } = useProduct();
  const { getCategories } = useCategory();
  const { getBrands } = useBrand();
  const { getAllUsers } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics state
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    users: 0
  });

  const [recentUsers, setRecentUsers] = useState<AuthUser[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Run fetches concurrently
        const [productsRes, categoriesRes, brandsRes, usersRes] = await Promise.all([
          getProducts(0, 5),
          getCategories(0, 1),
          getBrands(0, 1),
          getAllUsers(0, 5)
        ]);

        setStats({
          products: productsRes.totalElements,
          categories: categoriesRes.totalElements,
          brands: brandsRes.totalElements,
          users: usersRes.totalElements
        });

        // Set lists
        setRecentUsers(usersRes.content || []);
        setRecentProducts(productsRes.content || []);

      } catch (err: unknown) {
        console.error(err);
        setError((err as Error).message || 'Có lỗi xảy ra khi tải dữ liệu tổng quan.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-2" />
        <span className="text-xs font-bold">Đang tải dữ liệu tổng quan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 font-semibold text-sm">
        {error}
      </div>
    );
  }

  const statCards = [
    { 
      name: 'Tổng sản phẩm', 
      value: stats.products, 
      desc: 'Sản phẩm đã tạo', 
      icon: ShoppingBag, 
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      link: '/admin/products'
    },
    { 
      name: 'Tổng danh mục', 
      value: stats.categories, 
      desc: 'Danh mục phân loại', 
      icon: Layers, 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      link: '/admin/categories'
    },
    { 
      name: 'Thương hiệu', 
      value: stats.brands, 
      desc: 'Đối tác liên kết', 
      icon: Bookmark, 
      color: 'bg-violet-50 text-violet-600 border-violet-100',
      link: '/admin/brands'
    },
    { 
      name: 'Người dùng', 
      value: stats.users, 
      desc: 'Tài khoản đăng ký', 
      icon: Users, 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      link: '/admin/users'
    },
    { 
      name: 'Tổng doanh thu', 
      value: 'Chưa có API', 
      desc: 'Yêu cầu API doanh thu', 
      icon: Coins, 
      color: 'bg-slate-50 text-slate-400 border-slate-200',
      link: null
    },
    { 
      name: 'Tổng đơn hàng', 
      value: 'Chưa có API', 
      desc: 'Yêu cầu API đơn hàng', 
      icon: FileText, 
      color: 'bg-slate-50 text-slate-400 border-slate-200',
      link: null
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Tổng quan quản trị</h1>
        <p className="text-xs text-slate-500 mt-1">Dữ liệu được cập nhật thời gian thực trực tiếp từ hệ thống.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const CardEl = (
            <div className={`p-6 border rounded-3xl bg-white shadow-sm flex items-start justify-between transition-all ${card.link ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : ''}`}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">{card.name}</span>
                <span className="text-2xl font-black text-slate-900 block">{card.value}</span>
                <span className="text-[10px] font-semibold text-slate-500 block">{card.desc}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );

          return card.link ? (
            <Link key={idx} href={card.link} className="no-underline block">
              {CardEl}
            </Link>
          ) : (
            <div key={idx}>{CardEl}</div>
          );
        })}
      </div>

      {/* Tables layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Products */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              Sản phẩm mới thêm
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 no-underline">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Chưa có sản phẩm nào.</p>
            ) : (
              recentProducts.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{prod.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">SKU: {prod.sku} • {prod.category?.name || 'Chưa phân loại'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prod.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                    {prod.isActive ? 'Bán' : 'Tạm ẩn'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-600" />
              Tài khoản mới đăng ký
            </h3>
            <Link href="/admin/users" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 no-underline">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Chưa có người dùng nào.</p>
            ) : (
              recentUsers.map((u) => {
                const roleName = typeof u.role === 'string' ? u.role : (u.role?.roleName || u.role?.name || 'USER');
                return (
                  <div key={u.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{u.name || 'Chưa đặt tên'}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{u.email}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleName === 'ADMIN' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                      {roleName}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
