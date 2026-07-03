"use client";

import React from 'react';
import { Product } from '@/types/product';
import { env } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // Lấy variant đầu tiên làm variant mặc định để hiển thị
  const defaultVariant = product.variants && product.variants.length > 0 
    ? product.variants.find(v => v.isActive) || product.variants[0]
    : null;

  const price = defaultVariant ? defaultVariant.price : 0;
  const discountPrice = defaultVariant ? defaultVariant.discountPrice : null;
  const stock = defaultVariant ? defaultVariant.stock : 0;
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice > 0;

  // Xử lý đường dẫn ảnh
  let imageUrl = '/placeholder-product.png';
  if (defaultVariant && defaultVariant.images && defaultVariant.images.length > 0) {
    const primaryImg = defaultVariant.images.find(img => img.isThumbnail) || defaultVariant.images[0];
    if (primaryImg.url.startsWith('http')) {
      imageUrl = primaryImg.url;
    } else {
      // Ghép đường dẫn tương đối với base API URL
      const base = env.apiBaseUrl.replace('/api/v1', '');
      imageUrl = `${base}${primaryImg.url}`;
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant) return;

    try {
      await addToCart(defaultVariant.id, 1, user?.id);
      if (onAddToCart) {
        onAddToCart();
      } else {
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-4">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            GIẢM GIÁ
          </span>
        )}
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80'; // Fallback online reliable image if local not found
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4 pt-2">
        {product.brand && (
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
            {product.brand.name}
          </span>
        )}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>

        {/* Specs Highlights */}
        {defaultVariant?.specs && defaultVariant.specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {defaultVariant.specs.slice(0, 2).map((spec) => (
              <span key={spec.id} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {spec.specKey.name}: {spec.value}
              </span>
            ))}
          </div>
        )}

        {/* Pricing & Stock */}
        <div className="mt-auto flex flex-col gap-1">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-red-600">
                  {formatPrice(discountPrice!)}
                </span>
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-slate-900">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <span className={`text-[11px] font-medium ${stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {stock > 0 ? `Còn hàng (${stock})` : 'Hết hàng'}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded flex items-center gap-1 border-none cursor-pointer transition-colors"
            >
              MUA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
