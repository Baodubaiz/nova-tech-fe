"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { Product, Category } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { getProducts } = useProduct();
  const { getCategories } = useCategory();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  
  // Loading & Error states
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Cart update trigger
  const [cartTrigger, setCartTrigger] = useState(0);

  // Redirect admin users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = typeof user.role === 'string' 
        ? user.role 
        : (user.role?.roleName || user.role?.name || 'USER');
      if (role === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [user, isAuthenticated, router]);

  const handleAddToCart = () => {
    setCartTrigger(prev => prev + 1);
  };

  useEffect(() => {
    // Fetch Categories
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories(0, 20);
        // data.content holds the categories page content
        setCategories(data.content || []);
        setCategoriesError(null);
      } catch (err: unknown) {
        console.warn('Lỗi tải danh mục:', err);
        setCategoriesError('Không thể kết nối danh mục từ hệ thống.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    // Fetch Products
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await getProducts(0, 12);
        const list = data.content || [];
        setProducts(list);
        
        // Tạo danh sách sản phẩm mới (sort by createdAt giảm dần)
        const sortedNew = [...list].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setNewProducts(sortedNew.slice(0, 4));
        setProductsError(null);
      } catch (err: unknown) {
        console.warn('Lỗi tải sản phẩm:', err);
        setProductsError('Không thể tải danh sách sản phẩm từ hệ thống.');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Header */}
      <Header cartTrigger={cartTrigger} />

      <main className="flex-grow z-10 space-y-6 pb-12">
        {/* Hero Section */}
        <HeroBanner />

        {/* Categories Section */}
        <FeaturedCategories 
          categories={categories} 
          isLoading={categoriesLoading} 
          error={categoriesError}
        />

        {/* Featured Products Section (Sản phẩm nổi bật) */}
        <FeaturedProducts 
          id="products"
          title="Sản Phẩm Bán Chạy"
          subtitle="Top linh kiện công nghệ bán chạy nhất tuần qua"
          products={products}
          isLoading={productsLoading}
          error={productsError}
          onAddToCart={handleAddToCart}
        />

        {/* New Products Section */}
        <FeaturedProducts 
          title="Sản Phẩm Mới Nhất"
          subtitle="Cập nhật linh kiện mới nhất cho cấu hình máy tính của bạn"
          products={newProducts}
          isLoading={productsLoading}
          error={productsError}
          onAddToCart={handleAddToCart}
        />

        {/* Promotion/Combo Placeholder Banner */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl bg-blue-600 border border-blue-500 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-4 text-center md:text-left">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-yellow-400 px-3 py-1 rounded-sm">
                  Khuyến mãi Combo PC
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  BUILD TRỌN BỘ PC - NHẬN NGAY VOUCHER GIẢM 10%
                </h3>
                <p className="text-blue-100 text-sm max-w-lg">
                  * Chương trình khuyến mãi đặc biệt cho các gói tự lắp đặt PC. Áp dụng cho các sản phẩm CPU + VGA + Mainboard.
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-slate-100 active:scale-95 shadow-md shrink-0 border-none cursor-pointer">
                Nhận voucher ngay
              </button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
