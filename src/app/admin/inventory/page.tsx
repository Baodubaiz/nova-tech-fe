"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { Product, ProductVariant } from '@/types/product';
import { 
  Database, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface CompiledStockItem {
  id: string;
  productName: string;
  skuVariant: string;
  variantName: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export default function AdminInventoryPage() {
  const { getProducts, getVariantsByProduct } = useProduct();
  const [stockItems, setStockItems] = useState<CompiledStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats calculation
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch products
      const productsRes = await getProducts(0, 50); // Get first 50 products
      const productsList = productsRes.content || [];

      // 2. Fetch variants for each product in parallel
      const compiledList: CompiledStockItem[] = [];

      await Promise.all(
        productsList.map(async (prod: Product) => {
          try {
            const variantsRes = await getVariantsByProduct(prod.id, 0, 50);
            const variantsList = variantsRes.content || [];
            
            variantsList.forEach((v: ProductVariant) => {
              compiledList.push({
                id: v.id,
                productName: prod.name,
                skuVariant: v.skuVariant,
                variantName: v.variantName,
                price: v.price,
                stock: v.stock || 0,
                isActive: v.isActive
              });
            });
          } catch (variantErr) {
            console.warn(`Lỗi khi tải variants cho sản phẩm ${prod.name}:`, variantErr);
          }
        })
      );

      // Sort by stock count ascending
      compiledList.sort((a, b) => a.stock - b.stock);
      setStockItems(compiledList);

      // Calculate statistics
      let total = 0;
      let low = 0;
      let out = 0;

      compiledList.forEach(item => {
        total += item.stock;
        if (item.stock === 0) {
          out++;
        } else if (item.stock < 5) {
          low++;
        }
      });

      setStats({
        totalStock: total,
        lowStockCount: low,
        outOfStockCount: out
      });

    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Lỗi khi đồng bộ dữ liệu tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Báo cáo Tồn kho</h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý và cập nhật số lượng tồn kho sản phẩm.</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="flex items-center gap-1.5 h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer border border-slate-200 transition-colors"
        >
          Đồng bộ tồn kho
        </button>
      </div>

      {/* API Notice banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="block text-xs font-bold text-blue-900">Giới hạn API Backend:</span>
          <span className="block text-[11px] text-blue-700 leading-normal">
            Hệ thống đang kết hợp danh sách sản phẩm và các phiên bản để tính toán tồn kho. Khi dữ liệu lớn hơn, nên triển khai thêm API riêng: 
            <code className="font-mono bg-blue-100/50 px-1 py-0.5 rounded text-[10px] ml-1">GET /api/v1/admin/inventory</code> để tối ưu hiệu năng.
          </span>
        </div>
      </div>

      {/* Mini Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="block text-xs font-bold text-slate-400">Tổng sản phẩm lưu kho</span>
          <span className="block text-xl font-black text-slate-900 mt-1">{stats.totalStock} sản phẩm</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm border-l-amber-500 border-l-4">
          <span className="block text-xs font-bold text-slate-400">Sắp hết hàng (&lt; 5)</span>
          <span className="block text-xl font-black text-amber-600 mt-1">{stats.lowStockCount} phiên bản</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm border-l-rose-500 border-l-4">
          <span className="block text-xs font-bold text-slate-400">Đã hết hàng (0)</span>
          <span className="block text-xl font-black text-rose-600 mt-1">{stats.outOfStockCount} phiên bản</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải và đồng bộ hóa tồn kho...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-rose-500 text-sm font-semibold">{error}</div>
        ) : stockItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="text-sm font-bold block">Không có thông tin phiên bản sản phẩm</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Mã SKU</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Phiên bản</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Giá bán</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Tồn kho</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockItems.map((item) => {
                  let badge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" />
                      An toàn ({item.stock})
                    </span>
                  );

                  if (item.stock === 0) {
                    badge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-600 border-rose-100">
                        <XCircle className="w-3 h-3" />
                        Hết hàng (0)
                      </span>
                    );
                  } else if (item.stock < 5) {
                    badge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-600 border-amber-100">
                        <AlertTriangle className="w-3 h-3" />
                        Sắp hết ({item.stock})
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-slate-800">{item.skuVariant}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-900 block max-w-xs truncate">{item.productName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{item.variantName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-900">{formatCurrency(item.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {badge}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                          {item.isActive ? 'Bán' : 'Ẩn'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
