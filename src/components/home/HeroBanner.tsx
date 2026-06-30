import React from 'react';
import { Cpu, ChevronRight, Zap } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-20 lg:py-32">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Linh Kiện Điện Tử Chính Hãng 100%
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            NÂNG TẦM SỨC MẠNH<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
              HỆ THỐNG MÁY TÍNH
            </span>
          </h1>

          <p className="text-slate-600 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
            Khám phá bộ sưu tập vi xử lý mạnh mẽ, card đồ họa hiệu năng cao và giải pháp lưu trữ tốc độ vượt trội cho mọi nhu cầu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a 
              href="#products" 
              className="w-full sm:w-auto h-12 px-6 flex items-center justify-center bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-95 transition-opacity active:scale-95 shadow-lg shadow-cyan-500/10 no-underline border-none"
            >
              Mua sắm ngay
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
            <a 
              href="#categories" 
              className="w-full sm:w-auto h-12 px-6 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors no-underline shadow-sm"
            >
              Xem danh mục
            </a>
          </div>
        </div>

        {/* Visual Showcase */}
        <div className="flex-1 w-full flex justify-center">
          <div className="relative group max-w-[320px] sm:max-w-[400px]">
            {/* Outer Glowing Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-20 transition-opacity group-hover:opacity-30" />
            
            {/* Box container */}
            <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200 flex items-center justify-center p-8 shadow-xl">
              <Cpu className="w-36 h-36 text-cyan-600 animate-pulse" />
              
              {/* Micro-chips decorations */}
              <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-cyan-500" />
              <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-blue-600" />
              <div className="absolute top-1/2 right-6 w-1 h-6 bg-cyan-500/20 rounded" />
              <div className="absolute bottom-1/2 left-6 w-1 h-6 bg-blue-500/20 rounded" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
