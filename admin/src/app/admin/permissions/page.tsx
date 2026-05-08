import PermissionsGrid from '@/components/PermissionsGrid';
import { ShieldCheck } from 'lucide-react';

export default function PermissionsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-[#00B8C6]/10">
            <ShieldCheck className="w-6 h-6 text-[#00B8C6]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              System Permissions
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage roles and permission access across the platform
            </p>
          </div>
        </div>
      </div>

      <PermissionsGrid />
    </div>
  );
}