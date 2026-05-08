'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Star,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Users,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/admin',               icon: LayoutDashboard, module: 'dashboard' },
  { label: 'Courses',      href: '/admin/courses',        icon: BookOpen,        module: 'courses' },
  { label: 'Blogs',        href: '/admin/blogs',          icon: FileText,        module: 'blogs' },
  { label: 'Gallery',      href: '/admin/gallery',        icon: ImageIcon,       module: 'gallery' },
  { label: 'Enquiries',    href: '/admin/enquiries',      icon: MessageSquare,   module: 'enquiries' },
  { label: 'Testimonials', href: '/admin/testimonials',   icon: Star,            module: 'testimonials' },
];

const adminItems = [
  { label: 'Permissions',  href: '/admin/permissions',    icon: ShieldCheck },
  { label: 'Users',        href: '/admin/users',          icon: Users },
];

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as any;
  const userRole = user?.role || 'viewer';
  const isAdmin = userRole === 'admin';

  const hasModuleAccess = (module: string) => {
    if (isAdmin) return true;
    const ops = user?.permissions?.[module];
    if (!ops) return false;
    return Object.values(ops).some(Boolean);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col z-50 shadow-[0_0_30px_rgba(15,23,42,0.05)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm">
          F
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">Finest Admin</h1>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Management Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, module }) => {
          const isAllowed = module === 'dashboard' || hasModuleAccess(module);
          if (!isAllowed) return null;

          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-gray-500 hover:text-cyan-700 hover:bg-cyan-50/70'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-8 pb-2">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Setup</p>
            {adminItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-gray-500 hover:text-cyan-700 hover:bg-cyan-50/70'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User + Sign Out */}
      <div className="border-t border-slate-100 px-4 py-4 space-y-2">
        {session?.user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100">
               {user.name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-gray-900">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {user.roleName || userRole}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-xs">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
