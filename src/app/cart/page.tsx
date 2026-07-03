"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Cart, CartItem } from '@/types/cart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/navigation';
import { useRouter } from 'next/navigation';

import productService from '@/services/product.service';

export default function CartPage() {
  const { getCart, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartTrigger, setCartTrigger] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const data = await getCart(user?.id);
        
        // Enrich items with real info (images, prices, names)
        try {
          const productsRes = await productService.getProducts(0, 100);
          const allProducts = productsRes.content || [];
          
          if (data && data.items) {
            data.items = data.items.map(item => {
              for (const prod of allProducts) {
                const variant = prod.variants?.find(v => v.id === item.productVariantId);
                if (variant) {
                  const thumbnail = variant.images?.find(img => img.isThumbnail)?.url || variant.images?.[0]?.url || '';
                  return {
                    ...item,
                    productName: variant.variantName.toLowerCase().includes(prod.name.toLowerCase())
                      ? variant.variantName
                      : `${prod.name} ${variant.variantName}`,
                    price: variant.price,
                    imageUrl: thumbnail
                  };
                }
              }
              return item;
            });
          }
        } catch (enrichErr) {
          console.warn('Lỗi khi nạp chi tiết sản phẩm:', enrichErr);
        }

        setCart(data);
      } catch (err) {
        console.warn('Lỗi khi tải giỏ hàng:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user, cartTrigger]);

  const handleRemoveItem = async (item: CartItem) => {
    try {
      await removeFromCart(item.id, item.productVariantId, user?.id);
      setCartTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ:', err);
    }
  };

  const handleUpdateQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await handleRemoveItem(item);
      return;
    }
    try {
      await updateCartItem(item.id, item.productVariantId, newQty, user?.id);
      setCartTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
    }
  };

  // Safe pricing calculation
  const totalAmount = cart?.items?.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0) || 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Header cartTrigger={cartTrigger} />

      <main className="flex-grow z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-8 uppercase flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-primary" />
          Giỏ Hàng Của Bạn
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Đang tải giỏ hàng...</p>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Giỏ hàng trống</h3>
            <p className="text-slate-500 text-sm mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 shadow-md border-none cursor-pointer transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-blue-100 transition-all"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.variantName} className="object-cover w-full h-full" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.productName || item.variantName}</h4>
                      <p className="text-sm font-black text-blue-600 mt-1">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 border-none cursor-pointer active:scale-95 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 border-none cursor-pointer active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border-none cursor-pointer active:scale-95 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-800">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-500 font-bold">Miễn phí</span>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between">
                  <span className="font-bold text-slate-900">Tổng tiền</span>
                  <span className="font-black text-xl text-blue-600">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 shadow-md border-none cursor-pointer transition-all flex items-center justify-center gap-2 group"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
