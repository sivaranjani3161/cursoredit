import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Pencil } from 'lucide-react';

export default async function EditorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="glass-dark rounded-3xl border border-white/5 p-12 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <Pencil className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Editor Dashboard</h1>
        <p className="text-slate-400 mb-2">Welcome, <strong>{user?.name}</strong></p>
        <p className="text-slate-500 text-sm mb-8">
          You have editor access. You can create and update content, but cannot delete.
        </p>
        <div className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest inline-block">
          Role: Editor
        </div>
      </div>
    </div>
  );
}
