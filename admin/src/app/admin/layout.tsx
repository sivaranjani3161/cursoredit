import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-white">
      <AdminSidebar />
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}