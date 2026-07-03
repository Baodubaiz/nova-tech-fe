"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { ProductRequest, ProductVariantRequest } from '@/services/product.service';
import { useCategory } from '@/hooks/useCategory';
import { useBrand } from '@/hooks/useBrand';
import { Product, ProductVariant, Category, Brand } from '@/types/product';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  X,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  Tag,
  Boxes
} from 'lucide-react';

export default function AdminProductsPage() {
  const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getVariantsByProduct, 
    createVariant, 
    updateVariant, 
    deleteVariant 
  } = useProduct();
  const { getCategories } = useCategory();
  const { getBrands } = useBrand();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Expanded Product IDs for viewing variants
  const [expandedProdId, setExpandedProdId] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Modal / Form state for Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pSku, setPSku] = useState('');
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pBrandId, setPBrandId] = useState('');
  const [pCategoryId, setPCategoryId] = useState('');
  const [pIsActive, setPIsActive] = useState(true);
  const [pSlug, setPSlug] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Modal / Form state for Variant
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [vSku, setVSku] = useState('');
  const [vName, setVName] = useState('');
  const [vPrice, setVPrice] = useState<number>(0);
  const [vDiscountPrice, setVDiscountPrice] = useState<number>(0);
  const [vStock, setVStock] = useState<number>(10);
  const [vCondition, setVCondition] = useState<'NEW' | 'USED' | 'REFURBISHED'>('NEW');
  const [vIsActive, setVIsActive] = useState(true);
  const [submittingVariant, setSubmittingVariant] = useState(false);

  // Delete confirmations
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<ProductVariant | null>(null);

  const fetchProducts = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts(pageNumber, 10);
      setProducts(res.content || []);
      setPage(res.number);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Lỗi khi tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        getCategories(0, 100),
        getBrands(0, 100)
      ]);
      setCategories(catRes.content || []);
      setBrands(brandRes.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải danh mục/thương hiệu cho dropdown:', err);
    }
  };

  useEffect(() => {
    fetchProducts(0);
    fetchDropdownData();
  }, []);

  const handleToggleExpand = async (productId: string) => {
    if (expandedProdId === productId) {
      setExpandedProdId(null);
      setVariants([]);
      return;
    }

    setExpandedProdId(productId);
    setVariants([]);
    setLoadingVariants(true);
    try {
      const res = await getVariantsByProduct(productId, 0, 50);
      setVariants(res.content || []);
    } catch (err: unknown) {
      console.error(err);
      alert('Không thể tải các phiên bản của sản phẩm này.');
    } finally {
      setLoadingVariants(false);
    }
  };

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Product actions
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setPSku('');
    setPName('');
    setPDescription('');
    setPBrandId(brands[0]?.id || '');
    setPCategoryId(categories[0]?.id || '');
    setPIsActive(true);
    setPSlug('');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPSku(prod.sku);
    setPName(prod.name);
    setPDescription(prod.description || '');
    setPBrandId(prod.brand?.id || '');
    setPCategoryId(prod.category?.id || '');
    setPIsActive(prod.isActive !== false);
    setPSlug(prod.slug || '');
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pSku.trim() || !pName.trim() || !pBrandId || !pCategoryId || !pSlug.trim()) return;

    setSubmittingProduct(true);
    try {
      const payload: ProductRequest = {
        sku: pSku.trim(),
        name: pName.trim(),
        description: pDescription.trim() || undefined,
        brandId: pBrandId,
        categoryId: pCategoryId,
        isActive: pIsActive,
        slug: pSlug.trim()
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setShowProductModal(false);
      fetchProducts(editingProduct ? page : 0);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi lưu sản phẩm.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      setExpandedProdId(null);
      fetchProducts(0);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa sản phẩm.');
    }
  };

  // Variant actions
  const handleOpenCreateVariant = () => {
    setEditingVariant(null);
    setVSku('');
    setVName('');
    setVPrice(0);
    setVDiscountPrice(0);
    setVStock(10);
    setVCondition('NEW');
    setVIsActive(true);
    setShowVariantModal(true);
  };

  const handleOpenEditVariant = (v: ProductVariant) => {
    setEditingVariant(v);
    setVSku(v.skuVariant);
    setVName(v.variantName);
    setVPrice(v.price);
    setVDiscountPrice(v.discountPrice || 0);
    setVStock(v.stock);
    setVCondition(v.condition || 'NEW');
    setVIsActive(v.isActive !== false);
    setShowVariantModal(true);
  };

  const handleSubmitVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedProdId || !vSku.trim() || !vName.trim() || vPrice <= 0) return;

    setSubmittingVariant(true);
    try {
      const payload: ProductVariantRequest = {
        skuVariant: vSku.trim(),
        variantName: vName.trim(),
        price: vPrice,
        discountPrice: vDiscountPrice > 0 ? vDiscountPrice : undefined,
        stock: vStock,
        condition: vCondition,
        isActive: vIsActive
      };

      if (editingVariant) {
        await updateVariant(editingVariant.id, payload);
      } else {
        await createVariant(expandedProdId, payload);
      }
      setShowVariantModal(false);
      
      // Reload variants
      const vRes = await getVariantsByProduct(expandedProdId, 0, 50);
      setVariants(vRes.content || []);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi lưu phiên bản.');
    } finally {
      setSubmittingVariant(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!deletingVariant || !expandedProdId) return;
    try {
      await deleteVariant(deletingVariant.id);
      setDeletingVariant(null);
      // Reload variants
      const vRes = await getVariantsByProduct(expandedProdId, 0, 50);
      setVariants(vRes.content || []);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa phiên bản.');
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return '0đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Danh sách sản phẩm</h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý cơ sở dữ liệu sản phẩm và các phiên bản tương ứng.</p>
        </div>
        <button 
          onClick={handleOpenCreateProduct}
          className="flex items-center gap-1.5 h-11 px-5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Main Products Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-rose-500 text-sm font-semibold">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="text-sm font-bold block">Không có sản phẩm nào</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-12 px-6 py-4"></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">SKU</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Phân loại</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Thương hiệu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const isExpanded = expandedProdId === prod.id;
                  
                  return (
                    <React.Fragment key={prod.id}>
                      <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleToggleExpand(prod.id)}>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => handleToggleExpand(prod.id)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer flex items-center justify-center transition-colors"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-slate-800">{prod.sku}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-900 block max-w-sm truncate">{prod.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            {prod.category?.name || 'Chưa phân loại'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                            {prod.brand?.name || 'Chưa phân loại'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prod.isActive !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                            {prod.isActive !== false ? 'Hoạt động' : 'Tạm ẩn'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => handleOpenEditProduct(prod)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer border-none transition-colors"
                            title="Sửa sản phẩm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setDeletingProduct(prod)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer border-none transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Variants Panel */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-8 py-6 bg-slate-50/70 border-t border-b border-slate-150">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                  <Boxes className="w-4 h-4 text-cyan-600" />
                                  Các phiên bản variant của sản phẩm
                                </span>
                                <button 
                                  onClick={handleOpenCreateVariant}
                                  className="flex items-center gap-1 px-3 h-8 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black rounded-lg cursor-pointer border-none shadow-sm transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Thêm phiên bản (Variant)
                                </button>
                              </div>

                              {loadingVariants ? (
                                <div className="py-6 text-center text-slate-500 text-xs">
                                  <Loader2 className="w-5 h-5 animate-spin text-cyan-600 mx-auto mb-1.5" />
                                  Đang tải phiên bản...
                                </div>
                              ) : variants.length === 0 ? (
                                <p className="text-xs text-slate-500 italic py-2">Sản phẩm này hiện chưa có phiên bản variant nào.</p>
                              ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-4 py-3 font-bold text-slate-400">SKU Variant</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Tên thuộc tính</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Giá bán</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Khuyến mãi</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Tồn kho</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Độ mới</th>
                                        <th className="px-4 py-3 font-bold text-slate-400">Trạng thái</th>
                                        <th className="px-4 py-3 font-bold text-slate-400 text-right">Thao tác</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {variants.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50/50">
                                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{v.skuVariant}</td>
                                          <td className="px-4 py-3 font-medium text-slate-600">{v.variantName}</td>
                                          <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(v.price)}</td>
                                          <td className="px-4 py-3 text-rose-500 font-semibold">{v.discountPrice ? formatCurrency(v.discountPrice) : 'Không'}</td>
                                          <td className="px-4 py-3 font-bold text-slate-700">{v.stock}</td>
                                          <td className="px-4 py-3 font-medium text-slate-600">{v.condition}</td>
                                          <td className="px-4 py-3">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${v.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                                              {v.isActive ? 'Bán' : 'Ẩn'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-right space-x-1.5">
                                            <button 
                                              onClick={() => handleOpenEditVariant(v)}
                                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer border-none transition-colors"
                                              title="Sửa variant"
                                            >
                                              <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button 
                                              onClick={() => setDeletingVariant(v)}
                                              className="w-7 h-7 rounded bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer border-none transition-colors"
                                              title="Xóa variant"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Trang {page + 1} / {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 0}
                onClick={() => fetchProducts(page - 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Trước
              </button>
              <button 
                disabled={page === totalPages - 1}
                onClick={() => fetchProducts(page + 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Creator/Editor Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer border-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-6">
              {editingProduct ? 'Chỉnh sửa sản phẩm chính' : 'Tạo sản phẩm mới'}
            </h3>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tên sản phẩm</label>
                  <input 
                    type="text" 
                    value={pName}
                    onChange={(e) => {
                      setPName(e.target.value);
                      if (!editingProduct) {
                        setPSlug(generateSlug(e.target.value));
                      }
                    }}
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mã SKU chính</label>
                  <input 
                    type="text" 
                    value={pSku}
                    onChange={(e) => setPSku(e.target.value)}
                    placeholder="SKU-PROD-XXX"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 font-mono uppercase"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Đường dẫn Slug</label>
                  <input 
                    type="text" 
                    value={pSlug}
                    onChange={(e) => setPSlug(generateSlug(e.target.value))}
                    placeholder="slug-san-pham"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Thương hiệu (Brand)</label>
                  <select 
                    value={pBrandId} 
                    onChange={(e) => setPBrandId(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 bg-white"
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Danh mục (Category)</label>
                  <select 
                    value={pCategoryId} 
                    onChange={(e) => setPCategoryId(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 bg-white"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Mô tả sản phẩm</label>
                  <textarea 
                    value={pDescription} 
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Nhập mô tả sản phẩm..."
                    rows={3}
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <input 
                    type="checkbox" 
                    id="pIsActive"
                    checked={pIsActive}
                    onChange={(e) => setPIsActive(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded"
                  />
                  <label htmlFor="pIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">Kích hoạt bán sản phẩm này</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 h-11 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors flex items-center gap-1.5"
                >
                  {submittingProduct && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variant Creator/Editor Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowVariantModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer border-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-6">
              {editingVariant ? 'Chỉnh sửa phiên bản' : 'Thêm phiên bản variant mới'}
            </h3>

            <form onSubmit={handleSubmitVariant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tên phiên bản (Variant Name)</label>
                  <input 
                    type="text" 
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    placeholder="VD: Core i7 / 16GB RAM / 512GB SSD"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">SKU Variant</label>
                  <input 
                    type="text" 
                    value={vSku}
                    onChange={(e) => setVSku(e.target.value)}
                    placeholder="VD: SKU-PROD-XXX-V1"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 font-mono uppercase"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Độ mới (Condition)</label>
                  <select 
                    value={vCondition} 
                    onChange={(e) => setVCondition(e.target.value as 'NEW' | 'USED' | 'REFURBISHED')}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 bg-white"
                    required
                  >
                    <option value="NEW">Mới (NEW)</option>
                    <option value="USED">Đã qua sử dụng (USED)</option>
                    <option value="REFURBISHED">Trưng bày/Tân trang (REFURBISHED)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Giá bán (đ)</label>
                  <input 
                    type="number" 
                    value={vPrice || ''}
                    onChange={(e) => setVPrice(Number(e.target.value))}
                    min={1000}
                    placeholder="Giá tiền VNĐ"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Giá khuyến mãi (đ)</label>
                  <input 
                    type="number" 
                    value={vDiscountPrice || ''}
                    onChange={(e) => setVDiscountPrice(Number(e.target.value))}
                    placeholder="Không bắt buộc"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tồn kho hiện có (Stock)</label>
                  <input 
                    type="number" 
                    value={vStock}
                    onChange={(e) => setVStock(Number(e.target.value))}
                    min={0}
                    placeholder="Số lượng"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 col-span-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="vIsActive"
                    checked={vIsActive}
                    onChange={(e) => setVIsActive(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded"
                  />
                  <label htmlFor="vIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">Bán phiên bản này</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowVariantModal(false)}
                  className="px-4 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submittingVariant}
                  className="px-5 h-11 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors flex items-center gap-1.5"
                >
                  {submittingVariant && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingVariant ? 'Lưu phiên bản' : 'Thêm phiên bản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Dialog */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Xác nhận xóa sản phẩm?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn sắp xóa sản phẩm <strong className="text-slate-800">&quot;{deletingProduct.name}&quot;</strong> và tất cả các phiên bản của nó. Hành động này không thể phục hồi!
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeletingProduct(null)}
                className="w-1/2 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleDeleteProduct}
                className="w-1/2 h-11 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Variant Confirmation Dialog */}
      {deletingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Xác nhận xóa phiên bản variant?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn sắp xóa phiên bản <strong className="text-slate-800">&quot;{deletingVariant.variantName}&quot;</strong> (SKU: {deletingVariant.skuVariant}).
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeletingVariant(null)}
                className="w-1/2 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleDeleteVariant}
                className="w-1/2 h-11 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
              >
                Xóa phiên bản
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
