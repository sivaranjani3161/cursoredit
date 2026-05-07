import Link from 'next/link';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="glass-dark rounded-3xl border border-white/5 p-12 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You don&apos;t have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B8C6] hover:bg-[#00a0ad] text-white font-bold rounded-2xl transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
