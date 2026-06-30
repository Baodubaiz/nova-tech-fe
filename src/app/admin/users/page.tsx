"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import userService from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import { AuthUser } from '@/types/auth';
import { 
  Trash2, 
  Loader2, 
  AlertTriangle,
  User as UserIcon,
  Shield,
  UserX
} from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Delete Confirm states
  const [deletingUser, setDeletingUser] = useState<AuthUser | null>(null);

  const fetchUsers = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await userService.getAllUsers(pageNumber, 10);
      setUsers(res.content || []);
      setPage(res.number);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Lỗi khi tải danh sách tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const handleDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === currentUser?.id) {
      alert("Không được phép tự xóa tài khoản của chính mình!");
      setDeletingUser(null);
      return;
    }

    try {
      await userService.deleteUser(deletingUser.id);
      setDeletingUser(null);
      fetchUsers(0);
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa tài khoản.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Danh sách tài khoản</h1>
        <p className="text-xs text-slate-500 mt-1">Tổng cộng {totalElements} người dùng đăng ký tài khoản.</p>
      </div>

      {/* Main content table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải danh sách tài khoản...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-rose-500 text-sm font-semibold">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="text-sm font-bold block">Không có tài khoản nào</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Người dùng</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Số điện thoại</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Vai trò</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const roleName = typeof u.role === 'string' ? u.role : (u.role?.roleName || u.role?.name || 'USER');
                  const isSelf = u.id === currentUser?.id;
                  
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <UserIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                              {u.name || 'Chưa đặt tên'}
                              {isSelf && (
                                <span className="text-[9px] font-black text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-full px-1.5 py-0.5">
                                  TÔI
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{u.phone || 'Chưa cập nhật'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleName === 'ADMIN' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' : 'bg-slate-50 text-slate-500 border-slate-150'}`}>
                          {roleName === 'ADMIN' && <Shield className="w-3 h-3 text-cyan-600" />}
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.isActive !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          {u.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isSelf ? (
                          <span className="text-[10px] font-semibold text-slate-400 italic">Không khả dụng</span>
                        ) : (
                          <button 
                            onClick={() => setDeletingUser(u)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 cursor-pointer border-none transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
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
                onClick={() => fetchUsers(page - 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Trước
              </button>
              <button 
                disabled={page === totalPages - 1}
                onClick={() => fetchUsers(page + 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <UserX className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Xác nhận xóa tài khoản?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn sắp xóa tài khoản của <strong className="text-slate-800">&quot;{deletingUser.name || deletingUser.email}&quot;</strong>. Hành động này không thể phục hồi và sẽ chấm dứt mọi phiên làm việc của người dùng này.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeletingUser(null)}
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
