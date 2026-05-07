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
import permissionsConfig from '@/config/permissions.json';

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
  
  // Use the minimal JSON to filter accessible modules
  const accessibleModules = (permissionsConfig as any)[userRole] || [];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 sidebar-minimal flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex-shrink-0 flex items-center justify-center text-white font-bold">
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
          // Dashboard is always visible, others based on minimal JSON
          const isAllowed = isAdmin || module === 'dashboard' || accessibleModules.includes(module);
          if (!isAllowed) return null;

          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? 'bg-blue-50 text-[#0066FF]'
                  : 'text-gray-500 hover:text-[#0066FF] hover:bg-gray-50'
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
                      ? 'bg-blue-50 text-[#0066FF]'
                      : 'text-gray-500 hover:text-[#0066FF] hover:bg-gray-50'
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
      <div className="border-t border-gray-100 px-4 py-4 space-y-2">
        {session?.user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-xs">
               {user.name?.[0]}
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
