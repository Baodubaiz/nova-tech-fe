"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { CategoryRequest } from '@/services/category.service';
import { Category } from '@/types/product';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  X,
  AlertTriangle
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { getCategories, createCategory, updateCategory, deleteCategory } = useCategory();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal / Form states
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const fetchCategories = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories(pageNumber, 10);
      setCategories(res.content || []);
      setPage(res.number);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Lỗi khi tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(0);
  }, []);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSubmitting(true);
    try {
      const payload: CategoryRequest = { name: name.trim(), slug: slug.trim() };
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      setShowModal(false);
      fetchCategories(editingCategory ? page : 0);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi lưu danh mục.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      fetchCategories(0);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa danh mục.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Danh mục sản phẩm</h1>
          <p className="text-xs text-slate-500 mt-1">Tổng cộng {totalElements} danh mục đã được thiết lập.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 h-11 px-5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>

      {/* Main content table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải danh mục...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-rose-500 text-sm font-semibold">{error}</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="text-sm font-bold block">Không có danh mục nào</span>
            <span className="text-xs text-slate-400 block mt-1">Hãy nhấp vào nút &quot;Thêm danh mục&quot; để bắt đầu.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Tên danh mục</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Đường dẫn tĩnh (Slug)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500">{cat.slug}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(cat)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer border-none transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeletingCategory(cat)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer border-none transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                onClick={() => fetchCategories(page - 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Trước
              </button>
              <button 
                disabled={page === totalPages - 1}
                onClick={() => fetchCategories(page + 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer border-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-6">
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên danh mục</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Nhập tên danh mục..."
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Slug</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="slug-danh-muc"
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 font-mono"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 h-11 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Xác nhận xóa danh mục?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn sắp xóa danh mục <strong className="text-slate-800">&quot;{deletingCategory.name}&quot;</strong>. Hành động này không thể hoàn tác và có thể ảnh hưởng đến sản phẩm liên kết.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeletingCategory(null)}
                className="w-1/2 h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleDelete}
                className="w-1/2 h-11 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
