import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
