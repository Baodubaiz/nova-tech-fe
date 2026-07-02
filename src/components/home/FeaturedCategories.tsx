"use client";

import React from 'react';
import { Category } from '@/types/product';
import { CategoryCard } from '../category/CategoryCard';

interface FeaturedCategoriesProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onCategorySelect?: (category: Category) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ 
  categories, 
  isLoading, 
  error,
  onCategorySelect 
}) => {
  return (
    <section id="categories" className="py-16 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Danh Mục Nổi Bật
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            Lựa chọn linh kiện điện tử theo phân loại chuyên biệt
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-20" />
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
        {!isLoading && !error && categories.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-500">Không tìm thấy danh mục nào.</p>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onCategorySelect?.(category)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
export default FeaturedCategories;
