import React from 'react';
import { Cpu, ChevronRight, Zap } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-white pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px]">
          {/* Main Large Banner */}
          <div className="flex-1 bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-between p-8 sm:p-12 z-10">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 text-slate-900 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Mở Bán Đặc Biệt
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  BUILD PC GAMING<br />
                  <span className="text-yellow-400">SIÊU KHUYẾN MÃI</span>
                </h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  Nhận ngay Voucher giảm giá lên đến 5.000.000đ khi lắp ráp PC trọn bộ với linh kiện mới nhất.
                </p>
                <button className="mt-4 px-6 py-2.5 bg-yellow-400 text-slate-900 font-bold rounded hover:bg-yellow-300 transition-colors shadow-sm">
                  Mua sắm ngay
                </button>
              </div>
            </div>
            
            {/* Visual element placeholder for the main banner */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-30 lg:opacity-100 lg:-translate-x-4">
              <Cpu className="w-64 h-64 text-blue-300" />
            </div>
          </div>

          {/* Right Side Small Banners */}
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            <div className="flex-1 bg-slate-100 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden group border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 z-10">
                Laptop Sinh Viên<br/>Giảm Sốc 30%
              </h3>
              <button className="text-blue-600 text-sm font-semibold flex items-center mt-2 z-10 group-hover:underline">
                Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-20">
                <Cpu className="w-24 h-24 text-slate-500" />
              </div>
            </div>

            <div className="flex-1 bg-slate-100 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden group border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 z-10">
                Phụ Kiện Công Nghệ<br/>Mua 1 Tặng 1
              </h3>
              <button className="text-blue-600 text-sm font-semibold flex items-center mt-2 z-10 group-hover:underline">
                Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-20">
                <Zap className="w-24 h-24 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
