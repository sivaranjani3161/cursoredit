'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, ShieldCheck, Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { createPortal } from 'react-dom';

const API_BASE = '/api/proxy';

const SIDEBAR_WIDTH = 262;
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;

/* ── Per-module operations ── */
const MODULE_OPS: Record<string, Array<{ key: string; label: string }>> = {
  courses: [
    { key: 'create',    label: 'Create'    },
    { key: 'read',      label: 'View'      },
    { key: 'update',    label: 'Edit'      },
    { key: 'delete',    label: 'Delete'    },
    { key: 'publish',   label: 'Publish'   },
  ],
  blogs: [
    { key: 'create',    label: 'Create'    },
    { key: 'read',      label: 'View'      },
    { key: 'update',    label: 'Edit'      },
    { key: 'delete',    label: 'Delete'    },
    { key: 'publish',   label: 'Publish'   },
  ],
  gallery: [
    { key: 'create',    label: 'Create'  },
    { key: 'read',      label: 'View'          },
    { key: 'update',    label: 'Edit '    },
    { key: 'delete',    label: 'Delete'  },
    { key: 'upload',    label: 'Upload Images' },

  ],
  enquiries: [
    { key: 'read',      label: 'View'          },
    { key: 'update',    label: 'Update Status' },
    { key: 'delete',    label: 'Delete'        },
  ],
  testimonials: [
    { key: 'create',    label: 'Create'    },
    { key: 'read',      label: 'View'      },
    { key: 'update',    label: 'Edit'      },
    { key: 'delete',    label: 'Delete'    },
    { key: 'publish',   label: 'Publish'   },
  ],
};

const MODULES: Array<{ key: string; label: string }> = [
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
        for (const mod of MODULES) {
          for (const k of ALL_OP_KEYS) {
            norm[mod.key][k] = Boolean(data?.[mod.key]?.[k]);
          }
        }
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

  const handleDeleteRole = async (roleToDelete: Role) => {
    if (!roleToDelete || roleToDelete.code === 'admin') return;
    const confirmed = confirm(`Delete role "${roleToDelete.name}"?\n\nThis will remove all permissions for this role.`);
    if (!confirmed) return;
    try {
      setDeletingRole(true);
      const res = await fetch(`${API_BASE}/roles/${roleToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error || 'Failed to delete role'); }
      const updated = await fetchRoles();
      const fallbackRoleId = updated[0]?.id ?? null;
      setSelectedRoleId(fallbackRoleId);
      setPermissions(fallbackRoleId ? null : emptyMap());
      toast.success('Role deleted');
    } catch (e: any) { toast.error(e?.message || 'Failed to delete role'); }
    finally { setDeletingRole(false); }
  };

  const isLoading = loadingRoles || loadingPerms || permissions == null;

  /* ── Portal modal ── */
  const modal = showModal && mounted ? createPortal(
    <div
      className="fixed z-[59] flex items-center justify-center"
      style={{
        left:   SIDEBAR_WIDTH,
        top:    TOP_OFFSET,
        right:  RIGHT_OFFSET,
        bottom: BOTTOM_OFFSET,
      }}
    >
      {/* Backdrop */}
      <div
className="absolute inset-0 rounded-xl bg-[rgba(15,15,20,0.52)] backdrop-blur-[3px]"
        onClick={() => setShowModal(false)}
      />

      {/* Modal panel */}
      <div
        className="relative z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden w-full max-w-2xl mx-6"
        style={{ maxHeight: `calc(100vh - ${TOP_OFFSET + BOTTOM_OFFSET + 40}px)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-1 h-5 rounded-full bg-[#00B8C6] shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 shrink-0">
              Role Permissions {selectedRole ? `· ${selectedRole.name}` : ''}
            </h2>
            <span className="text-[11px] text-slate-400 truncate hidden sm:block">
              Configure access levels for each module.
            </span>
            {isAdmin && (
              <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                Admin has full access
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="ml-3 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-slate-50 border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {MODULES.map((mod) => {
                const ops = MODULE_OPS[mod.key] ?? [];
                return (
                  <div
                    key={mod.key}
className="flex flex-col sm:flex-row sm:items-start gap-3 border border-slate-100 rounded-lg px-4 py-3 bg-white hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-28 shrink-0 pt-1">{mod.label}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      {ops.map((op) => {
                        const active = isAdmin ? true : Boolean(permissions?.[mod.key]?.[op.key]);
                        const disabled = isAdmin || saving;
                        return (
                          <button
                            key={op.key}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggle(mod.key, op.key)}
                            title={op.label}
                            className={[
                              'px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all select-none',
                              active
? 'bg-[#00B8C6] text-white border-[#00a3b0]'

                                : 'bg-white text-slate-500 border-slate-300 shadow-[0_2px_0_0_#d1d5db] hover:bg-slate-50 active:shadow-none active:translate-y-px',
                              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
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
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
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
    <div className="space-y-3 relative">
      {/* Add Role */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex-1 max-w-xl">
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
                Add Role
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roles table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRoles ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5"><div className="h-3 w-24 rounded bg-gray-100 animate-pulse" /></td>
                    <td className="px-4 py-2.5 text-right"><div className="h-6 w-20 rounded bg-gray-100 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : (
                roles.map((role) => {
                  const roleIsAdmin = role.code === 'admin';
                  const active = selectedRoleId === role.id;
                  return (
                    <tr key={role.id} className={active ? 'bg-cyan-50/40' : 'hover:bg-slate-50/70'}>
                      <td className="px-4 py-2.5 text-sm font-semibold text-slate-800">{role.name}</td>
                      <td className="px-4 py-2.5">
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

      {/* Portal modal rendered here */}
      {modal}
    </div>
  );
}