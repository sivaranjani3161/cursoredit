import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-gray-900">
      <AdminSidebar />
      <main className="ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}