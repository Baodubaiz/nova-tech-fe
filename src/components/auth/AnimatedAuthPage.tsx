"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { cn } from '@/lib/utils';

interface AnimatedAuthPageProps {
  initialMode?: 'login' | 'register';
}

export default function AnimatedAuthPage({ initialMode = 'login' }: AnimatedAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showSuccess, setShowSuccess] = useState(false);
  const isRegister = mode === 'register';

  useEffect(() => {
    const targetPath = mode === 'register' ? '/register' : '/login';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [mode]);

  const handleToggle = (targetMode: 'login' | 'register') => {
    setMode(targetMode);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden font-sans flex items-center justify-center">

      {/* Background Lighting (Sáng rực rỡ) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent)] z-0" />

      <div className="relative w-full h-screen flex flex-col overflow-hidden z-10">

        {/* FORMS CONTAINER - Trượt ngang trên cả Mobile và Desktop */}
        <div className={cn(
          "relative w-full h-full flex transition-transform duration-1000 ease-in-out",
          isRegister ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>

          {/* LOGIN SECTION (50% Desktop, 100% Mobile) */}
          <div className={cn(
            "w-full lg:w-1/2 h-full flex-shrink-0 flex items-center justify-center px-6 lg:px-24 transition-all duration-1000",
            // Trên Desktop: Làm mờ khi trượt qua. Trên Mobile: Luôn hiển thị vì nó đang trượt
            isRegister ? "lg:opacity-0 lg:invisible lg:scale-95" : "opacity-100 visible scale-100"
          )}>
            <div className="w-full max-w-md bg-white/60 backdrop-blur-3xl p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3rem] border border-white/80 shadow-2xl">
              <LoginForm onSwitchToRegister={() => handleToggle('register')} />
            </div>
          </div>

          {/* REGISTER SECTION (50% Desktop, 100% Mobile) */}
          <div className={cn(
            "w-full lg:w-1/2 h-full flex-shrink-0 flex items-center justify-center px-6 lg:px-24 transition-all duration-1000",
            !isRegister ? "lg:opacity-0 lg:invisible lg:scale-95" : "opacity-100 visible scale-100"
          )}>
            <div className="w-full max-w-md bg-white/60 backdrop-blur-3xl p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3rem] border border-white/80 shadow-2xl">
              <RegisterForm
                onSwitchToLogin={() => handleToggle('login')}
                onRegisterSuccess={() => {
                  setShowSuccess(true);
                  handleToggle('login');
                }}
              />
            </div>
          </div>
        </div>

        {/* ULTRA ORB OVERLAY - Chỉ hiển thị trên Desktop (LG) */}
        <div className={cn(
          "absolute top-[-25%] bottom-[-25%] w-[85%] overflow-hidden transition-all duration-1000 z-50 hidden lg:block",
          isRegister
            ? "left-0 -translate-x-[42%] rounded-full shadow-[-50px_0_100px_rgba(59,130,246,0.2)]"
            : "left-full -translate-x-[58%] rounded-full shadow-[50px_0_100px_rgba(59,130,246,0.2)]"
        )}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.6, 0.05, 0.01, 0.99)'
          }}
        >
          <div className={cn(
            "relative left-[-100%] h-full w-[200%] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 transition-transform duration-1000",
            isRegister ? "translate-x-1/2" : "translate-x-0"
          )}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.6, 0.05, 0.01, 0.99)'
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.4),transparent)] opacity-60" />
            <div className="absolute top-0 flex h-full w-full items-center">
              {/* Content Side 1 */}
              <div className={cn(
                "flex h-full w-1/2 flex-col items-center justify-center px-12 transition-all duration-1000",
                isRegister ? "translate-x-[15%] opacity-100 scale-100" : "-translate-x-20 opacity-0 scale-90"
              )}>
                <div className="w-full max-w-sm text-center">
                  <div className="mb-10 w-24 h-24 bg-white/20 rounded-[2.5rem] shadow-2xl backdrop-blur-xl flex items-center justify-center border border-white/30 mx-auto rotate-12">
                    <span className="text-white text-5xl font-black">N</span>
                  </div>
                  <h2 className="mb-6 text-6xl font-black text-white drop-shadow-2xl">Mừng bạn!</h2>
                  <p className="mb-12 text-xl text-white/90 leading-relaxed font-medium">Đăng nhập để khám phá NovaTech.</p>
                  <button onClick={() => handleToggle('login')} className="px-16 py-5 rounded-full bg-white text-blue-700 font-black text-xl shadow-xl hover:scale-110 active:scale-95 transition-all">ĐĂNG NHẬP</button>
                </div>
              </div>

              {/* Content Side 2 */}
              <div className={cn(
                "flex h-full w-1/2 flex-col items-center justify-center px-12 transition-all duration-1000",
                !isRegister ? "-translate-x-[15%] opacity-100 scale-100" : "translate-x-20 opacity-0 scale-90"
              )}>
                <div className="w-full max-w-sm text-center">
                  <div className="mb-10 w-24 h-24 bg-white/20 rounded-[2.5rem] shadow-2xl backdrop-blur-xl flex items-center justify-center border border-white/30 mx-auto -rotate-12">
                    <span className="text-white text-4xl font-black">N</span>
                  </div>
                  <h2 className="mb-6 text-6xl font-black text-white drop-shadow-2xl">Xin chào!</h2>
                  <p className="mb-12 text-xl text-white/90 leading-relaxed font-medium">Bắt đầu mua sắm cùng chúng tôi ngay.</p>
                  <button onClick={() => handleToggle('register')} className="px-16 py-5 rounded-full bg-white text-cyan-700 font-black text-xl shadow-xl hover:scale-110 active:scale-95 transition-all">ĐĂNG KÝ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
