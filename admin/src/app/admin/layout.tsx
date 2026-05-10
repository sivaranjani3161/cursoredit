import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,rgba(0,184,198,0.12),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(0,184,198,0.08),transparent_28%),linear-gradient(180deg,#f8fdfe_0%,#f4fbfd_100%)] text-gray-900">
      <AdminSidebar />
      <main className="ml-[264px] mr-3 mt-3 mb-3 min-h-[calc(100vh-24px)]">
        <div className="h-full rounded-2xl border border-cyan-100/70 bg-white/80 backdrop-blur-sm p-1.5 shadow-[0_25px_60px_rgba(15,23,42,0.07)]">
          {children}
        </div>
      </main>
    </div>
  );
}