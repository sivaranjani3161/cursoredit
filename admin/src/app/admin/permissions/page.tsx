import PermissionsGrid from '@/components/PermissionsGrid';
import { ShieldCheck } from 'lucide-react';

export default function PermissionsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-blue-50">
            <ShieldCheck className="w-6 h-6 text-[#0066FF]" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
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