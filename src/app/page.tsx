"use client";

import React from 'react';
import Image from 'next/image';
import { routes } from '@/config/routes.config';

import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <main className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl font-black -rotate-12">N</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
          NOVATECH
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">.</span>
        </h1>

        {isAuthenticated && user ? (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-2xl text-cyan-400 font-bold mb-2">Chào mừng trở lại, {user.name}!</p>
            <p className="text-slate-400">Bạn đang đăng nhập với vai trò: <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">{typeof user.role === 'string' ? user.role : (user.role?.name || 'USER')}</span></p>
          </div>
        ) : (
          <p className="max-w-xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Trải nghiệm mua sắm công nghệ đỉnh cao với hệ thống eCommerce hiện đại, 
            bảo mật và nhanh chóng.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => logout()}
                className="flex-1 h-14 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-xl"
              >
                Đăng xuất
              </button>
              <a 
                href={user?.role === 'ADMIN' ? routes.adminDashboard : (routes.userDashboard || '#')}
                className="flex-1 h-14 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl no-underline"
              >
                Vào Dashboard
              </a>
            </>
          ) : (
            <>
              <a 
                href={routes.login}
                className="flex-1 h-14 flex items-center justify-center bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl no-underline"
              >
                Đăng nhập ngay
              </a>
              <a 
                href={routes.register}
                className="flex-1 h-14 flex items-center justify-center bg-slate-900 text-white border border-slate-800 font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 no-underline"
              >
                Tạo tài khoản
              </a>
            </>
          )}
        </div>

        <div className="mt-16 flex items-center gap-8 opacity-40 grayscale contrast-125">
          <Image src="/next.svg" alt="Next.js" width={80} height={16} style={{ width: 'auto', height: 'auto' }} />
          <div className="w-px h-4 bg-slate-700" />
          <Image src="/vercel.svg" alt="Vercel" width={80} height={16} style={{ width: 'auto', height: 'auto' }} />
        </div>
      </main>

      <footer className="absolute bottom-8 text-slate-600 text-sm">
        &copy; 2026 NovaTech Co., Ltd. All rights reserved.
      </footer>
    </div>
  );
}
