import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = session.user as any;
  const userRole = user?.role || 'viewer';

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#f4f7fa] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Welcome back,{' '}
            <span className="font-semibold text-gray-700">
              {user?.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {user.roleName || userRole}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
            {user?.name?.[0]}
          </div>
        </div>
      </div>

    </div>
  );
}