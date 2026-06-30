"use client";

import React from 'react';
import { Category } from '@/types/product';
import { Cpu, HardDrive, Cpu as GpuIcon, Disc, Keyboard, MousePointer } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  // Bản đồ Icon dựa trên tên Category
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('cpu') || lower.includes('vi xử lý')) return <Cpu className="w-8 h-8 text-cyan-600" />;
    if (lower.includes('vga') || lower.includes('gpu') || lower.includes('card đồ họa')) return <GpuIcon className="w-8 h-8 text-violet-600" />;
    if (lower.includes('ram') || lower.includes('bộ nhớ')) return <HardDrive className="w-8 h-8 text-amber-600" />;
    if (lower.includes('ssd') || lower.includes('hdd') || lower.includes('ổ cứng')) return <Disc className="w-8 h-8 text-emerald-600" />;
    if (lower.includes('main') || lower.includes('bo mạch')) return <HardDrive className="w-8 h-8 text-rose-600" />;
    if (lower.includes('bàn phím') || lower.includes('keyboard')) return <Keyboard className="w-8 h-8 text-pink-600" />;
    if (lower.includes('chuột') || lower.includes('mouse')) return <MousePointer className="w-8 h-8 text-sky-600" />;
    return <Cpu className="w-8 h-8 text-cyan-600" />;
  };

  return (
    <div 
      onClick={onClick}
      className="cursor-pointer group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-50/80 hover:shadow-lg active:scale-95 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-cyan-50">
        {getIcon(category.name)}
      </div>
      <h3 className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
        {category.name}
      </h3>
    </div>
  );
};
