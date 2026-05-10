'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, ShieldCheck, Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE = '/api/proxy';

const MODULES: Array<{ key: string; label: string }> = [
  { key: 'courses',      label: 'Courses'      },
  { key: 'blogs',        label: 'Blogs'        },
  { key: 'gallery',      label: 'Gallery'      },
  { key: 'enquiries',    label: 'Enquiries'    },
  { key: 'testimonials', label: 'Testimonials' },
];

const OPS: Array<{ key: 'create'|'read'|'update'|'delete'|'custom'; label: string }> = [
  { key: 'create', label: 'Create' },
  { key: 'read',   label: 'Read'   },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
  { key: 'custom', label: 'Custom' },
];

type OpKey = (typeof OPS)[number]['key'];
type PermMap = Record<string, Record<OpKey, boolean>>;

interface Role { id: number; name: string; code: string; }

function emptyMap(): PermMap {
  const m: PermMap = {} as any;
  for (const mod of MODULES) {
    m[mod.key] = { create: false, read: false, update: false, delete: false, custom: false };
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
        for (const mod of MODULES) for (const op of OPS) norm[mod.key][op.key] = Boolean(data?.[mod.key]?.[op.key]);
        setPermissions(norm);
      } catch {
        toast.error('Failed to load permissions');
        setPermissions(emptyMap());
      } finally { setLoadingPerms(false); }
    })();
  }, [selectedRoleId]);

  const toggle = (moduleKey: string, op: OpKey) => {
    if (!permissions || isAdmin) return;
    setPermissions(prev => prev ? { ...prev, [moduleKey]: { ...prev[moduleKey], [op]: !prev[moduleKey][op] } } : prev);
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
        for (const mod of MODULES) for (const op of OPS) norm[mod.key][op.key] = Boolean(data?.[mod.key]?.[op.key]);
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

  return (
    <div className="space-y-3">
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
                placeholder="Role name (e.g. Counsellor)"
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
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Code</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRoles ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5"><div className="h-3 w-24 rounded bg-gray-100 animate-pulse" /></td>
                    <td className="px-4 py-2.5"><div className="h-3 w-16 rounded bg-gray-100 animate-pulse" /></td>
                    <td className="px-4 py-2.5 text-right"><div className="h-6 w-36 rounded bg-gray-100 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : (
                roles.map((role) => {
                  const roleIsAdmin = role.code === 'admin';
                  const active = selectedRoleId === role.id;
                  return (
                    <tr key={role.id} className={active ? 'bg-cyan-50/40' : 'hover:bg-slate-50/70'}>
                      <td className="px-4 py-2.5 text-sm font-semibold text-slate-800">{role.name}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{role.code}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRoleId(role.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-[#00B8C6] text-[10px] font-bold hover:bg-cyan-100 transition-all"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            Permissions
                          </button>
                          <button
                            type="button"
                            disabled={roleIsAdmin || deletingRole}
                            onClick={() => handleDeleteRole(role)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-bold hover:bg-rose-100 transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
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

      {/* ── Permissions Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isAdmin && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-700 text-[10px] font-semibold">
            <ShieldCheck className="w-3 h-3" />
            Admin role has full access and cannot be modified.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-36">
                  Module
                </th>
                {OPS.map((op) => (
                  <th key={op.key} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                    {op.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5"><div className="h-3 w-16 rounded bg-gray-100 animate-pulse" /></td>
                      {OPS.map((op) => (
                        <td key={op.key} className="px-4 py-2.5 text-center">
                          <div className="h-3.5 w-3.5 rounded bg-gray-100 animate-pulse mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))
                : MODULES.map(mod => (
                    <tr key={mod.key} className="hover:bg-cyan-50/30 transition-colors">
                      <td className="px-4 py-2">
                        <span className="text-sm font-medium text-slate-700">{mod.label}</span>
                      </td>
                      {OPS.map(op => (
                        <td key={op.key} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={isAdmin ? true : Boolean(permissions?.[mod.key]?.[op.key])}
                            disabled={isAdmin || saving}
                            onChange={() => toggle(mod.key, op.key)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#00B8C6] focus:ring-[#00B8C6]/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </td>
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {!isAdmin && !isLoading && (
          <div className="px-4 py-2 border-t border-slate-100 flex justify-end bg-slate-50/60">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[10px] font-bold hover:brightness-95 transition-all disabled:opacity-50"
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
    </div>
  );
}