'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, ShieldCheck, Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

const API_BASE = '/api/proxy';

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET    = 12;
const RIGHT_OFFSET  = 12;
const BOTTOM_OFFSET = 12;

const MODULE_OPS: Record<string, Array<{ key: string; label: string }>> = {
  courses:      [{ key: 'create', label: 'Create' }, { key: 'read', label: 'View' }, { key: 'update', label: 'Edit' }, { key: 'delete', label: 'Delete' }, { key: 'publish', label: 'Publish' }],
  blogs:        [{ key: 'create', label: 'Create' }, { key: 'read', label: 'View' }, { key: 'update', label: 'Edit' }, { key: 'delete', label: 'Delete' }, { key: 'publish', label: 'Publish' }],
  gallery:      [{ key: 'create', label: 'Create' }, { key: 'read', label: 'View' }, { key: 'update', label: 'Edit' }, { key: 'delete', label: 'Delete' }, { key: 'upload', label: 'Upload Images' }],
  enquiries:    [{ key: 'read', label: 'View' }, { key: 'update', label: 'Update Status' }, { key: 'delete', label: 'Delete' }],
  testimonials: [{ key: 'create', label: 'Create' }, { key: 'read', label: 'View' }, { key: 'update', label: 'Edit' }, { key: 'delete', label: 'Delete' }, { key: 'publish', label: 'Publish' }],
};

const MODULES = [
  { key: 'courses',      label: 'Courses'      },
  { key: 'blogs',        label: 'Blogs'        },
  { key: 'gallery',      label: 'Gallery'      },
  { key: 'enquiries',    label: 'Enquiries'    },
  { key: 'testimonials', label: 'Testimonials' },
];

const ALL_OP_KEYS = ['create', 'read', 'update', 'delete', 'publish', 'upload', 'custom'];

type PermMap = Record<string, Record<string, boolean>>;
interface Role { id: number; name: string; code: string; }

function emptyMap(): PermMap {
  const m: PermMap = {};
  for (const mod of MODULES) {
    m[mod.key] = {};
    for (const k of ALL_OP_KEYS) m[mod.key][k] = false;
  }
  return m;
}

export default function PermissionsGrid() {
  const [roles, setRoles]                   = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permissions, setPermissions]       = useState<PermMap | null>(null);
  const [loadingRoles, setLoadingRoles]     = useState(true);
  const [loadingPerms, setLoadingPerms]     = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [creatingRole, setCreatingRole]     = useState(false);
  const [deletingRole, setDeletingRole]     = useState(false);
  const [newRoleName, setNewRoleName]       = useState('');
  const [showModal, setShowModal]           = useState(false);
  const [mounted, setMounted]               = useState(false);
  const [deleteTarget, setDeleteTarget]     = useState<Role | null>(null);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  const selectedRole = useMemo(() => roles.find(r => r.id === selectedRoleId) || null, [roles, selectedRoleId]);
  const isAdmin = selectedRole?.code === 'admin';

  const slugifyRoleCode = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const fetchRoles = async () => {
    const res = await fetch(`${API_BASE}/roles`);
    if (!res.ok) throw new Error('Failed to load roles');
    const data: Role[] = await res.json();
    setRoles(data);
    return data;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingRoles(true);
        const data = await fetchRoles();
        if (data.length) setSelectedRoleId(data[0].id);
      } catch { toast.error('Failed to load roles'); }
      finally { setLoadingRoles(false); }
    })();
  }, []);

  useEffect(() => {
    if (selectedRoleId == null) return;
    (async () => {
      try {
        setLoadingPerms(true);
        const res = await fetch(`${API_BASE}/permissions?roleId=${selectedRoleId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const norm = emptyMap();
        for (const mod of MODULES) for (const k of ALL_OP_KEYS) norm[mod.key][k] = Boolean(data?.[mod.key]?.[k]);
        setPermissions(norm);
      } catch {
        toast.error('Failed to load permissions');
        setPermissions(emptyMap());
      } finally { setLoadingPerms(false); }
    })();
  }, [selectedRoleId]);

  const toggle = (moduleKey: string, opKey: string) => {
    if (!permissions || isAdmin) return;
    setPermissions(prev => prev
      ? { ...prev, [moduleKey]: { ...prev[moduleKey], [opKey]: !prev[moduleKey][opKey] } }
      : prev
    );
  };

  const handleSave = async () => {
    if (selectedRoleId == null || !permissions || isAdmin) return;
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRoleId, permissions }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error || 'Failed'); }
      toast.success('Permissions saved');
      const refresh = await fetch(`${API_BASE}/permissions?roleId=${selectedRoleId}`);
      if (refresh.ok) {
        const data = await refresh.json();
        const norm = emptyMap();
        for (const mod of MODULES) for (const k of ALL_OP_KEYS) norm[mod.key][k] = Boolean(data?.[mod.key]?.[k]);
        setPermissions(norm);
      }
    } catch (e: any) { toast.error(e?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleCreateRole = async () => {
    const name = newRoleName.trim();
    const code = slugifyRoleCode(name);
    if (!name) { toast.error('Role name is required'); return; }
    if (!code) { toast.error('Enter a valid role name'); return; }
    try {
      setCreatingRole(true);
      const res = await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error || 'Failed to create role'); }
      const created = (await res.json()) as Role;
      await fetchRoles();
      setSelectedRoleId(created.id);
      setNewRoleName('');
      toast.success('Role added');
    } catch (e: any) { toast.error(e?.message || 'Failed to create role'); }
    finally { setCreatingRole(false); }
  };

  const handleDeleteRole = (role: Role) => {
    if (!role || role.code === 'admin') return;
    setDeleteTarget(role);
  };

  const confirmDeleteRole = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingRole(true);
      const res = await fetch(`${API_BASE}/roles/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error || 'Failed to delete role'); }
      const updated = await fetchRoles();
      const fallbackRoleId = updated[0]?.id ?? null;
      setSelectedRoleId(fallbackRoleId);
      setPermissions(fallbackRoleId ? null : emptyMap());
      toast.success('Role deleted');
    } catch (e: any) { toast.error(e?.message || 'Failed to delete role'); }
    finally {
      setDeletingRole(false);
      setDeleteTarget(null);
    }
  };

  const isLoading = loadingRoles || loadingPerms || permissions == null;

  /* ── Permissions modal ── */
  const modal = showModal && mounted ? createPortal(
<div className="fixed z-[59] inset-0 flex items-stretch sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
     <div
  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none sm:pointer-events-auto"
  onClick={() => setShowModal(false)}
/>

      {/*
        Mobile  (<sm): bottom sheet
        sm+:          centered dialog
        Desktop (lg+): original sidebar-offset centered
      */}
   <div
  className="
    relative z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden w-full

    /* ── MOBILE: true full-screen ── */
    h-dvh max-h-dvh rounded-none

    /* ── sm+: centered dialog (unchanged) ── */
    sm:rounded-2xl sm:h-auto sm:max-h-[85dvh] sm:w-auto

    /* ── sm max-width cap ── */
    sm:max-w-xl
  "
  onClick={(e) => e.stopPropagation()}
  ref={(el) => {
    if (!el) return;
    if (window.innerWidth >= 1024) {
      const contentLeft  = SIDEBAR_WIDTH + TOP_OFFSET;
      const contentRight = RIGHT_OFFSET;
      el.style.position  = 'fixed';
      el.style.top       = '50%';
      el.style.left      = `calc(${contentLeft}px + ((100vw - ${contentLeft}px - ${contentRight}px) / 2))`;
      el.style.transform = 'translate(-50%, -50%)';
      el.style.width     = '560px';
      el.style.maxHeight = `calc(100vh - ${TOP_OFFSET + BOTTOM_OFFSET + 40}px)`;
      el.style.borderRadius = '16px';
    }
  }}
>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-11 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-[3px] h-4 rounded-full bg-[#00B8C6] flex-shrink-0" />
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B8C6] flex-shrink-0" />
            <h2 className="text-[12.5px] font-bold text-slate-800 flex-shrink-0 truncate">
              {selectedRole ? selectedRole.name : 'Permissions'}
            </h2>
            {isAdmin ? (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                Full access
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 truncate hidden sm:block">
                Configure access levels
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="ml-2 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-slate-50 border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {MODULES.map((mod) => {
                const ops = MODULE_OPS[mod.key] ?? [];
                return (
                  <div key={mod.key} className="py-2.5 first:pt-1 last:pb-1">
                    {/* Module label */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      {mod.label}
                    </p>
                    {/* Permission chips — wrap on mobile */}
                    <div className="flex flex-wrap gap-1.5">
                      {ops.map((op) => {
                        const active   = isAdmin ? true : Boolean(permissions?.[mod.key]?.[op.key]);
                        const disabled = isAdmin || saving;
                        return (
                          <button
                            key={op.key}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggle(mod.key, op.key)}
                            className={[
                              'h-7 px-2.5 rounded-full text-[10px] font-semibold border transition-all select-none leading-none',
                              active
                                ? 'bg-[#00B8C6] text-white border-[#00B8C6]'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600',
                              disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
                            ].join(' ')}
                          >
                            {op.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isAdmin && !isLoading && (
          <div className="px-4 sm:px-5 h-12 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-bold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
            >
              {saving
                ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3 h-3" />
              }
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="space-y-3">

      {/* ── Add Role ── */}
      <div className="bg-white rounded-xl border border-slate-200 px-3 sm:px-4 py-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 sm:max-w-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Add Role
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRole()}
                placeholder="Role name"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B8C6]/20 focus:border-[#00B8C6] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleCreateRole}
                disabled={creatingRole}
                className="inline-flex shrink-0 items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[10px] font-bold hover:brightness-95 transition-all disabled:opacity-50"
              >
                {creatingRole
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Plus className="w-3 h-3" />
                }
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

     {/* ── Roles table ── */}
<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

  {/* Mobile card list — hidden on sm+ */}
  <div className="sm:hidden divide-y divide-slate-100">
    {loadingRoles ? (
      Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-3">
          <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
          <div className="h-7 w-20 rounded bg-gray-100 animate-pulse" />
        </div>
      ))
    ) : (
      roles.map((role) => {
        const roleIsAdmin = role.code === 'admin';
        const active = selectedRoleId === role.id;
        return (
          <div
            key={role.id}
            className={`flex items-center justify-between px-3 py-3 ${active ? 'bg-cyan-50/40' : ''}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#00B8C6]/10 border border-[#00B8C6]/20 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] flex-shrink-0">
                {role.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-800 truncate">{role.name}</span>
              {roleIsAdmin && (
                <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={() => { setSelectedRoleId(role.id); setShowModal(true); }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-cyan-200 bg-cyan-50 text-[#00B8C6] hover:bg-cyan-100 transition-all"
                title="Permissions"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={roleIsAdmin || deletingRole}
                onClick={() => handleDeleteRole(role)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>

  {/* Desktop/tablet table — hidden on mobile */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left min-w-[320px]">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</th>
          <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loadingRoles ? (
          Array.from({ length: 3 }).map((_, i) => (
            <tr key={i}>
              <td className="px-3 sm:px-4 py-2.5"><div className="h-3 w-24 rounded bg-gray-100 animate-pulse" /></td>
              <td className="px-3 sm:px-4 py-2.5 text-right"><div className="h-6 w-20 rounded bg-gray-100 animate-pulse ml-auto" /></td>
            </tr>
          ))
        ) : (
          roles.map((role) => {
            const roleIsAdmin = role.code === 'admin';
            const active = selectedRoleId === role.id;
            return (
              <tr key={role.id} className={active ? 'bg-cyan-50/40' : 'hover:bg-slate-50/70'}>
                <td className="px-3 sm:px-4 py-2.5 text-sm font-semibold text-slate-800">{role.name}</td>
                <td className="px-3 sm:px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setSelectedRoleId(role.id); setShowModal(true); }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-cyan-200 bg-cyan-50 text-[#00B8C6] hover:bg-cyan-100 transition-all"
                      title="Permissions"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={roleIsAdmin || deletingRole}
                      onClick={() => handleDeleteRole(role)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>

</div>

      {/* ── Delete Role confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Role</p>
                  <p className="text-[11px] text-slate-400">This will remove all permissions for this role</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">Role to be deleted</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTarget.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteRole}
                  disabled={deletingRole}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deletingRole && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal}
    </div>
  );
}