'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, Image as ImageIcon, MessageSquare,
  Star, FileText, ShieldCheck, LogOut, ChevronRight, Users, X, Menu,
} from 'lucide-react';
import type { AdminUser } from '@/types';

const navItems = [
  { label: 'Dashboard',    href: '/admin',                      icon: LayoutDashboard, module: 'dashboard' },
  { label: 'Courses',      href: '/admin/courses',              icon: BookOpen,        module: 'courses' },
  { label: 'Blogs',        href: '/admin/blogs',                icon: FileText,        module: 'blogs' },
  { label: 'Gallery',      href: '/admin/gallery',              icon: ImageIcon,       module: 'gallery' },
  { label: 'Enquiries',    href: '/admin/enquiries',            icon: MessageSquare,   module: 'enquiries' },
  { label: 'Testimonials', href: '/admin/testimonials',         icon: Star,            module: 'testimonials' },
];

const adminItems = [
  { label: 'Roles', href: '/admin/permissions', icon: ShieldCheck },
  { label: 'Users', href: '/admin/users',       icon: Users },
];

interface SidebarProps {
  session: ReturnType<typeof useSession>['data'];
  user: AdminUser | undefined;
  userRole: string;
  isAdmin: boolean;
  hasModuleAccess: (module: string) => boolean;
  pathname: string;
}

// Sidebar pixel widths (must stay in sync with AdminLayout)
const COLLAPSED_PX = 56;   // w-14 equivalent
const EXPANDED_PX  = 224;  // w-56 equivalent
const SIDE_GAP     = 8;    // left-2 = 8px

// CSS variable name read by AdminLayout
export const TABLET_OFFSET_VAR = '--tablet-sidebar-offset';

// ── Shared NavLink ────────────────────────────────────────────────────────────
function NavLink({
  href, icon: Icon, label, isActive, onClick, collapsed = false,
}: {
  href: string; icon: React.ElementType; label: string;
  isActive: boolean; onClick?: () => void; collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        flex items-center rounded-lg transition-all duration-200 group relative
        ${collapsed ? 'justify-center w-9 h-9 mx-auto' : 'gap-2.5 px-3 py-2 w-full'}
        ${isActive
          ? 'bg-[#00B8C6] text-white shadow-[0_6px_16px_rgba(0,184,198,0.3)]'
          : 'text-gray-500 hover:text-cyan-700 hover:bg-cyan-50/70'
        }
      `}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="font-medium text-sm truncate">{label}</span>}
      {!collapsed && isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-70 flex-shrink-0" />}

      {/* Tooltip shown only in icon-rail mode */}
      {collapsed && (
        <span className="
          pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2
          px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999] shadow-lg
        ">
          {label}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
        </span>
      )}
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DESKTOP — pixel-perfect original, zero changes
// ════════════════════════════════════════════════════════════════════════════
function DesktopSidebar({ session, user, userRole, isAdmin, hasModuleAccess, pathname }: SidebarProps) {
  return (
    <aside className="fixed left-3 top-3 bottom-3 h-auto w-60 bg-white border border-cyan-100 rounded-2xl flex flex-col z-50 shadow-[0_18px_45px_rgba(0,184,198,0.15)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-white">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm">F</div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-gray-900">Finest Coder Admin</h1>
          <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Management Console</p>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon, module }) => {
          if (module !== 'dashboard' && !hasModuleAccess(module)) return null;
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} />;
        })}
        {isAdmin && (
          <div className="pt-4 pb-1">
            <p className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Setup</p>
            {adminItems.map(({ label, href, icon }) => {
              const isActive = pathname.startsWith(href);
              return <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} />;
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-slate-100 px-3 py-2.5 space-y-1 bg-slate-50/70">
        {session?.user && (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100 shrink-0">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-gray-900">{user?.name}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{user?.roleName || userRole}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-xs">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TABLET — icon rail that expands; writes CSS var so layout can push content
// ════════════════════════════════════════════════════════════════════════════
function TabletSidebar({ session, user, userRole, isAdmin, hasModuleAccess, pathname }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  

  // Keep :root CSS var in sync so AdminLayout's <main> transitions smoothly
  useEffect(() => {
    const offset = (expanded ? EXPANDED_PX : COLLAPSED_PX) + SIDE_GAP + SIDE_GAP;
    document.documentElement.style.setProperty(TABLET_OFFSET_VAR, `${offset}px`);
  }, [expanded]);

  // Initialise CSS var on mount (collapsed), clean up on unmount
  useEffect(() => {
    const initial = COLLAPSED_PX + SIDE_GAP + SIDE_GAP;
    document.documentElement.style.setProperty(TABLET_OFFSET_VAR, `${initial}px`);
return () => {
  document.documentElement.style.removeProperty(TABLET_OFFSET_VAR);
};  }, []);

  return (
    <>
      

      <aside
        style={{ width: expanded ? `${EXPANDED_PX}px` : `${COLLAPSED_PX}px` }}
        className="
          fixed left-2 top-2 bottom-2
          bg-white border border-cyan-100 rounded-2xl flex flex-col
          z-50 shadow-[0_18px_45px_rgba(0,184,198,0.15)]
          overflow-hidden
          transition-[width] duration-200 ease-in-out
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-white flex-shrink-0 min-h-[52px]">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-cyan-600 hover:bg-cyan-100 transition-all"
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {expanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Brand — fades in when expanded */}
          <div
            className="overflow-hidden min-w-0 transition-[opacity] duration-150"
            style={{ width: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          >
            <p className="text-xs font-bold tracking-tight text-gray-900 whitespace-nowrap leading-tight">Finest Coder</p>
            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col">
          <div className={`flex flex-col ${expanded ? 'px-2 space-y-0.5' : 'items-center space-y-1'}`}>
            {navItems.map(({ label, href, icon, module }) => {
              if (module !== 'dashboard' && !hasModuleAccess(module)) return null;
              const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
              return (
                <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} collapsed={!expanded} />
              );
            })}

            {isAdmin && (
              <div className={`pt-2 border-t border-slate-100 mt-2 ${expanded ? 'w-full space-y-0.5' : 'w-full flex flex-col items-center space-y-1'}`}>
                {expanded && (
                  <p className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1 whitespace-nowrap">Setup</p>
                )}
                {adminItems.map(({ label, href, icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} collapsed={!expanded} />
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-100 bg-slate-50/70 rounded-b-2xl flex-shrink-0 ${expanded ? 'px-3 py-2.5 space-y-1' : 'py-2.5 flex flex-col items-center gap-2'}`}>
          {session?.user && (
            expanded ? (
              <div className="flex items-center gap-2 px-1 py-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100 flex-shrink-0">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs font-bold truncate text-gray-900 whitespace-nowrap">{user?.name}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">{user?.roleName || userRole}</p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100 cursor-default">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999] shadow-lg">
                  {user?.name} · {user?.roleName || userRole}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
                </span>
              </div>
            )
          )}

          {expanded ? (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-xs whitespace-nowrap">Sign Out</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999] shadow-lg">
                Sign Out
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MOBILE — unchanged
// ════════════════════════════════════════════════════════════════════════════
function MobileSidebar({ session, user, userRole, isAdmin, hasModuleAccess, pathname }: SidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
<header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-4 z-40">        <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-700 hover:bg-cyan-50 transition-all" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">F</div>
          <span className="text-sm font-bold tracking-tight text-gray-900">Finest Coder</span>
        </div>
        {session?.user && (
          <div className="ml-auto w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100">
            {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </header>

      {open && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm">F</div>
          <div className="flex-1">
            <h1 className="text-sm font-bold tracking-tight text-gray-900">Finest Coder Admin</h1>
            <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Management Console</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, href, icon, module }) => {
            if (module !== 'dashboard' && !hasModuleAccess(module)) return null;
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} onClick={() => setOpen(false)} />;
          })}
          {isAdmin && (
            <div className="pt-4 pb-1">
              <p className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Setup</p>
              {adminItems.map(({ label, href, icon }) => {
                const isActive = pathname.startsWith(href);
                return <NavLink key={href} href={href} icon={icon} label={label} isActive={isActive} onClick={() => setOpen(false)} />;
              })}
            </div>
          )}
        </nav>

        <div className="border-t border-slate-100 px-3 py-2.5 space-y-1 bg-slate-50/70">
          {session?.user && (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-100 shrink-0">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-gray-900">{user?.name}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{user?.roleName || userRole}</p>
              </div>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-xs">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ════════════════════════════════════════════════════════════════════════════
export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const userRole = user?.role || 'viewer';
  const isAdmin = userRole === 'admin';

  const hasModuleAccess = (module: string) => {
    if (isAdmin) return true;
    const ops = user?.permissions?.[module];
    if (!ops) return false;
    return Object.values(ops).some(Boolean);
  };

  const props: SidebarProps = { session, user: user as AdminUser | undefined, userRole, isAdmin, hasModuleAccess, pathname };

  return (
    <>
      <div className="hidden lg:block">
        <DesktopSidebar {...props} />
      </div>
      <div className="hidden md:block lg:hidden">
        <TabletSidebar {...props} />
      </div>
      <div className="block md:hidden">
        <MobileSidebar {...props} />
      </div>
    </>
  );
}