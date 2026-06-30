"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess?: () => void;
}

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không đúng định dạng.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeTerms) {
      setError('Bạn cần đồng ý với điều khoản dịch vụ.');
      return;
    }

    try {
      await register({ name, email, password });
      setIsSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Đăng ký</h2>
        <p className="text-slate-500 mt-2">Tạo tài khoản NovaTech để bắt đầu mua sắm</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-100 animate-in fade-in zoom-in duration-300 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-bold">Đăng ký thành công! Đang tiến hành đăng nhập...</span>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="reg-name" className="text-sm font-semibold text-slate-700 ml-1">
            Họ và tên
          </label>
          <Input
            id="reg-name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-email" className="text-sm font-semibold text-slate-700 ml-1">
            Email
          </label>
          <Input
            id="reg-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-sm font-semibold text-slate-700 ml-1">
              Mật khẩu
            </label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="text-sm font-semibold text-slate-700 ml-1">
              Xác nhận
            </label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 px-1 py-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
            Tôi đồng ý với <span className="text-cyan-600 font-medium">Điều khoản dịch vụ</span> và <span className="text-cyan-600 font-medium">Chính sách bảo mật</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-[0.98] font-bold text-white border-none"
          disabled={isLoading}
        >
          {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
        </Button>

        <div className="mt-4 text-center lg:hidden">
          <p className="text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-cyan-600 hover:underline"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
