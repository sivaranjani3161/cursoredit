import Link from 'next/link';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md glass-dark rounded-2xl sm:rounded-3xl border border-white/5 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <ShieldOff className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8">
          You don&apos;t have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#00B8C6] hover:bg-[#00a0ad] text-white font-bold rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}