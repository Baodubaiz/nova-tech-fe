"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/types/product';
import { Search, ArrowLeft, SlidersHorizontal } from 'lucide-react';

export default function SearchPage() {
  const { getProducts } = useProduct();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        if (!query.trim()) {
          setProducts([]);
          setError(null);
          return;
        }

        const res = await getProducts(0, 100, query.trim());
        setProducts(res.content || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching search results:', err);
        setError('Không thể lấy kết quả tìm kiếm.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

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
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-10 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border-none cursor-pointer mb-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
              </h1>
              <p className="text-sm text-white/80 mt-1">Khám phá các sản phẩm phù hợp với nhu cầu của bạn</p>
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
                <span className="text-sm font-semibold text-slate-500">Đang tải kết quả...</span>
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
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-black text-slate-800 text-lg mb-2">Không tìm thấy kết quả</h3>
                <p className="text-sm text-slate-500 max-w-sm">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}". Hãy thử lại bằng từ khóa khác nhé.</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold text-slate-500">
                    Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm
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
