import PermissionsGrid from '@/components/PermissionsGrid';
import { ShieldCheck } from 'lucide-react';

export default function PermissionsPage() {
  return (
    <div className="p-3 sm:p-4 space-y-2">
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-100">
          <ShieldCheck className="w-4 h-4 text-[#00B8C6]" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">Roles</h1>
          <p className="text-[11px] text-gray-400 leading-tight">Manage roles, users, and permissions in one place.</p>
        </div>
      </div>

      <PermissionsGrid />
    </div>
  );
}