"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { Product, Category } from '@/types/product';
import { Cpu, Smartphone, Laptop, Monitor, Headphones, HardDrive, ArrowLeft, SlidersHorizontal } from 'lucide-react';

const CATEGORY_META: Record<string, { name: string; icon: any; bannerColor: string }> = {
  'dien-thoai': { name: 'Điện thoại', icon: Smartphone, bannerColor: 'from-blue-600 to-cyan-500' },
  'laptop': { name: 'Laptop', icon: Laptop, bannerColor: 'from-indigo-600 to-purple-500' },
  'pc-linh-kien': { name: 'PC - Linh kiện', icon: Cpu, bannerColor: 'from-blue-700 to-indigo-600' },
  'man-hinh': { name: 'Màn hình', icon: Monitor, bannerColor: 'from-sky-600 to-blue-500' },
  'phu-kien': { name: 'Phụ kiện', icon: Headphones, bannerColor: 'from-teal-600 to-cyan-500' },
  'luu-tru': { name: 'Thiết bị lưu trữ', icon: HardDrive, bannerColor: 'from-slate-700 to-slate-500' },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const meta = CATEGORY_META[slug] || { name: 'Danh mục sản phẩm', icon: Cpu, bannerColor: 'from-blue-600 to-indigo-600' };
  const IconComponent = meta.icon;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load categories to find the correct database category matching our slug
        const catRes = await categoryService.getCategories(0, 100);
        const dbCategories = catRes.content || [];
        setCategories(dbCategories);

        // Try to find the category by slug or name matching
        const matchingCategory = dbCategories.find(c => {
          const catNameLower = c.name.toLowerCase();
          const catSlugLower = (c.slug || '').toLowerCase();
          
          if (slug === 'dien-thoai') return catNameLower.includes('phone') || catNameLower.includes('thoại');
          if (slug === 'laptop') return catNameLower.includes('laptop');
          if (slug === 'pc-linh-kien') return catNameLower.includes('pc') || catNameLower.includes('linh kiện') || catNameLower.includes('cpu');
          if (slug === 'man-hinh') return catNameLower.includes('monitor') || catNameLower.includes('màn hình');
          if (slug === 'phu-kien') return catNameLower.includes('accessory') || catNameLower.includes('phụ kiện');
          if (slug === 'luu-tru') return catNameLower.includes('storage') || catNameLower.includes('lưu trữ');
          
          return catSlugLower === slug.toLowerCase() || catNameLower.includes(slug.toLowerCase());
        });

        // Fetch products
        const prodRes = await productService.getProducts(0, 100);
        const allProducts = prodRes.content || [];

        if (matchingCategory) {
          // Filter products by matching category ID
          const filtered = allProducts.filter(p => p.category?.id === matchingCategory.id);
          setProducts(filtered);
        } else {
          // Fallback fuzzy search by product or brand if category ID doesn't match perfectly
          const filtered = allProducts.filter(p => {
            const prodCatName = (p.category?.name || '').toLowerCase();
            if (slug === 'dien-thoai') return prodCatName.includes('phone') || prodCatName.includes('thoại');
            if (slug === 'laptop') return prodCatName.includes('laptop');
            if (slug === 'pc-linh-kien') return prodCatName.includes('pc') || prodCatName.includes('linh kiện') || prodCatName.includes('cpu');
            if (slug === 'man-hinh') return prodCatName.includes('monitor') || prodCatName.includes('màn hình');
            if (slug === 'phu-kien') return prodCatName.includes('accessory') || prodCatName.includes('phụ kiện');
            if (slug === 'luu-tru') return prodCatName.includes('storage') || prodCatName.includes('lưu trữ');
            return false;
          });
          setProducts(filtered);
        }
        setError(null);
      } catch (err: any) {
        console.error('Error fetching category page data:', err);
        setError('Không thể kết nối danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Extract unique brands for filtering
  const brands = Array.from(new Set(products.map(p => p.brand?.name).filter(Boolean))) as string[];

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let result = [...products];

    // Filter by Brand
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand?.name === selectedBrand);
    }

    // Filter by Price Range
    if (priceRange !== 'all') {
      result = result.filter(p => {
        const variant = p.variants?.[0];
        if (!variant) return false;
        const price = variant.discountPrice || variant.price;

        if (priceRange === 'under-10m') return price < 10000000;
        if (priceRange === '10m-20m') return price >= 10000000 && price <= 20000000;
        if (priceRange === 'above-20m') return price > 20000000;
        return true;
      });
    }

    // Sort products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.discountPrice || a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.discountPrice || b.variants?.[0]?.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.discountPrice || a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.discountPrice || b.variants?.[0]?.price || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      {/* Banner Header */}
      <div className={`w-full bg-gradient-to-r ${meta.bannerColor} py-10 text-white shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border-none cursor-pointer mb-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{meta.name}</h1>
              <p className="text-sm text-white/80 mt-1">Khám phá các sản phẩm chất lượng cao với giá ưu đãi tốt nhất</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide m-0">Bộ lọc tìm kiếm</h3>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider m-0">Thương hiệu</h4>
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider m-0">Mức giá</h4>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="under-10m">Dưới 10 triệu</option>
                <option value="10m-20m">Từ 10 - 20 triệu</option>
                <option value="above-20m">Trên 20 triệu</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider m-0">Sắp xếp theo</h4>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </aside>

          {/* Product Listing Section */}
          <section className="flex-1">
            {loading ? (
              <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-500">Đang tải sản phẩm...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                <p className="font-semibold">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg border-none cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-black text-slate-800 text-lg mb-2">Chưa có sản phẩm nào</h3>
                <p className="text-sm text-slate-500 max-w-sm">Hiện chưa có sản phẩm nào thuộc danh mục này hiển thị trên cửa hàng.</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold text-slate-500">
                    Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
