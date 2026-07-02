"use client";

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '../product/ProductCard';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddToCart?: () => void;
  id?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  isLoading,
  error,
  onAddToCart,
  id
}) => {
  return (
    <section id={id} className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-slate-500 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[340px]">
                <div className="aspect-square bg-slate-100 rounded-xl mb-4 w-full" />
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
                <div className="h-6 bg-slate-100 rounded w-1/2 mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-500">Không tìm thấy sản phẩm nào.</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
export default FeaturedProducts;
