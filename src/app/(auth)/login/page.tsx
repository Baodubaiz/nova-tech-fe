import React, { Suspense } from 'react';
import AnimatedAuthPage from '@/components/auth/AnimatedAuthPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">Đang tải...</div>}>
      <AnimatedAuthPage initialMode="login" />
    </Suspense>
  );
}
