import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import {
  BookOpen, FileText, Image as ImageIcon, MessageSquare,
  ShieldCheck, Star, Users, Sparkles,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = session.user as any;
  const userRole = user?.role || 'viewer';

  const quickCards = [
    { title: 'Courses',      desc: 'Create and maintain learning journeys with structured modules.',          icon: BookOpen },
    { title: 'Blogs',        desc: 'Publish articles with tags, status control, and related content.',        icon: FileText },
    { title: 'Gallery',      desc: 'Manage events, highlights, and image collections.',                       icon: ImageIcon },
    { title: 'Enquiries',    desc: 'Track incoming leads and update follow-up status.',                       icon: MessageSquare },
    { title: 'Testimonials', desc: 'Curate text and video testimonials with sort priority.',                  icon: Star },
    { title: 'Users & Roles',desc: 'Control access safely with role-based governance.',                      icon: Users },
    { title: 'Permissions',  desc: 'Grant precise create, read, update, delete capabilities.',                icon: ShieldCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight truncate">
            Welcome, {user?.name || 'Admin'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage content, access, and workflows from one focused control center.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {user.roleName || userRole}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#00B8C6] font-bold shadow-sm text-sm">
            {user?.name?.[0]}
          </div>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="rounded-xl sm:rounded-2xl border border-cyan-100 bg-white p-4 sm:p-5 sm:p-6 mb-5 shadow-[0_16px_36px_rgba(0,184,198,0.09)]">
        <div className="flex items-start gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-50 flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B8C6]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
              Professional, focused, and fast
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              This workspace is optimized for clarity: less clutter, cleaner hierarchy, and high-contrast actions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
  key={card.title}
  className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_34px_rgba(0,184,198,0.12)] transition-shadow"
>
  {/* Mobile: icon + text side by side. sm+: icon on top */}
  <div className="flex items-start gap-3 sm:block">
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0 sm:mb-3">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B8C6]" />
    </div>
    <div>
      <h3 className="text-sm sm:text-base font-semibold text-slate-900">{card.title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{card.desc}</p>
    </div>
  </div>
</div>
          );
        })}
      </div>
    </div>
  );
}