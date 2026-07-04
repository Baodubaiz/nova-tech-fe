"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      await login({ email, password });
    } catch (err: unknown) {
      setError((err as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Đăng nhập</h2>
        <p className="text-slate-500 mt-2">Chào mừng bạn quay lại NovaTech</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 ml-1">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="example@novatech.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <button type="button" className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline transition-all">
              Quên mật khẩu?
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2 px-1">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
          />
          <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
            Ghi nhớ đăng nhập
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-[0.98] font-bold text-white border-none"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <div className="mt-6 text-center lg:hidden">
          <p className="text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-cyan-600 hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
