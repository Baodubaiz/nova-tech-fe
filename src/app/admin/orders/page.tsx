"use client";

import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Quản lý Đơn hàng</h1>
        <p className="text-xs text-slate-500 mt-1">Quản lý các đơn đặt hàng trong toàn hệ thống.</p>
      </div>

      {/* Placeholder content card */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center shadow-sm max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-950">Chức năng đang chờ API</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Backend Spring Boot hiện tại chưa hỗ trợ API lấy danh sách toàn bộ đơn hàng trong hệ thống dành cho tài khoản Admin. 
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="block text-xs font-bold text-amber-900">Đề xuất nâng cấp API:</span>
            <span className="block text-[11px] text-amber-700 leading-normal">
              Cần triển khai thêm endpoint <code className="font-mono bg-amber-100/50 px-1 py-0.5 rounded text-[10px]">GET /api/v1/admin/orders</code> và <code className="font-mono bg-amber-100/50 px-1 py-0.5 rounded text-[10px]">GET /api/v1/admin/orders/{"{id}"}</code> ở Spring Boot để hoàn thiện mô-đun quản trị này.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Link 
            href="/admin" 
            className="inline-flex items-center justify-center h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl no-underline transition-colors"
          >
            Quay lại bảng điều khiển
          </Link>
        </div>

      </div>

    </div>
  );
}
