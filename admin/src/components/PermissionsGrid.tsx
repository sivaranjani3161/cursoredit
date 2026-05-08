'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const MODULES: Array<{ key: string; label: string }> = [
  { key: 'courses',      label: 'Courses'      },
  { key: 'blogs',        label: 'Blogs'        },
  { key: 'gallery',      label: 'Gallery'      },
  { key: 'enquiries',    label: 'Enquiries'    },
  { key: 'testimonials', label: 'Testimonials' },
];

const OPS: Array<{ key: 'create'|'read'|'update'|'delete'; label: string }> = [
  { key: 'create', label: 'Create' },
  { key: 'read',   label: 'Read'   },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
];

type OpKey = (typeof OPS)[number]['key'];
type PermMap = Record<string, Record<OpKey, boolean>>;

interface Role { id: number; name: string; code: string; }

function emptyMap(): PermMap {
  const m: PermMap = {} as any;
  for (const mod of MODULES) {
    m[mod.key] = { create: false, read: false, update: false, delete: false };
  }
  return m;
}

export default function PermissionsGrid() {
  const [roles, setRoles]               = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permissions, setPermissions]   = useState<PermMap | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving]             = useState(false);

  const selectedRole = useMemo(() => roles.find(r => r.id === selectedRoleId) || null, [roles, selectedRoleId]);
  const isAdmin = selectedRole?.code === 'admin';

  /* Fetch roles once */
  useEffect(() => {
    (async () => {
      try {
        setLoadingRoles(true);
        const res = await fetch(`${BACKEND_URL}/api/roles`);
        if (!res.ok) throw new Error();
        const data: Role[] = await res.json();
        setRoles(data);
        if (data.length) setSelectedRoleId(data[0].id);
      } catch { toast.error('Failed to load roles'); }
      finally { setLoadingRoles(false); }
    })();
  }, []);

  /* Fetch permissions whenever role changes */
  useEffect(() => {
    if (selectedRoleId == null) return;
    (async () => {
      try {
        setLoadingPerms(true);
        const res = await fetch(`${BACKEND_URL}/api/permissions?roleId=${selectedRoleId}`);
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
      const res = await fetch(`${BACKEND_URL}/api/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRoleId, permissions }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error || 'Failed'); }
      toast.success('Permissions saved');
      /* Re-fetch to confirm */
      const refresh = await fetch(`${BACKEND_URL}/api/permissions?roleId=${selectedRoleId}`);
      if (refresh.ok) {
        const data = await refresh.json();
        const norm = emptyMap();
        for (const mod of MODULES) for (const op of OPS) norm[mod.key][op.key] = Boolean(data?.[mod.key]?.[op.key]);
        setPermissions(norm);
      }
    } catch (e: any) { toast.error(e?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const isLoading = loadingRoles || loadingPerms || permissions == null;

  return (
    <div className="space-y-5">

      {/* ── Role Selector ── */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Select Role
            </label>
            {loadingRoles ? (
              <div className="h-9 w-56 rounded-lg bg-gray-100 animate-pulse" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedRoleId === role.id
                        ? 'bg-[#00B8C6] text-white border-[#00B8C6]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#00B8C6]/50 hover:text-[#00B8C6]'
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedRole && (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Full Access — Read Only
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-xs font-bold transition-all hover:brightness-95 disabled:opacity-50"
                >
                  {saving
                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-3.5 h-3.5" />}
                  Save Permissions
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Permissions Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isAdmin && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin role always has full access to all modules. These settings cannot be changed.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-36">Module</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Active Permissions</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-52 text-right">Assign (C / R / U / D)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3.5"><div className="h-3 w-20 rounded bg-gray-100 animate-pulse" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 w-36 rounded bg-gray-100 animate-pulse" /></td>
                    <td className="px-5 py-3.5 text-right"><div className="h-3 w-28 rounded bg-gray-100 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : (
                MODULES.map(mod => {
                  const activeOps = OPS.filter(op => isAdmin || Boolean(permissions?.[mod.key]?.[op.key]));
                  return (
                    <tr key={mod.key} className="hover:bg-gray-50/40 transition-colors">
                      {/* Module name */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">{mod.label}</span>
                      </td>

                      {/* Active permission badges */}
                      <td className="px-5 py-3.5">
                        {activeOps.length === 0 ? (
                          <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                            <ShieldOff className="w-3.5 h-3.5" />
                            No access
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {activeOps.map(op => (
                              <span key={op.key}
                                className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00B8C6]/10 text-[#00B8C6] text-[10px] font-bold uppercase tracking-wide">
                                {op.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Checkboxes */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-4">
                          {OPS.map(op => (
                            <label key={op.key} className="flex flex-col items-center gap-1 cursor-pointer group select-none">
                              <input
                                type="checkbox"
                                checked={isAdmin ? true : Boolean(permissions?.[mod.key]?.[op.key])}
                                disabled={isAdmin || saving}
                                onChange={() => toggle(mod.key, op.key)}
                                className="w-4 h-4 rounded border-gray-300 text-[#00B8C6] focus:ring-[#00B8C6]/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                              />
                              <span className="text-[9px] font-black uppercase tracking-wider text-gray-300 group-hover:text-gray-500 transition-colors">
                                {op.key[0].toUpperCase()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom save bar for non-admin */}
        {!isAdmin && !isLoading && (
          <div className="px-5 py-3 border-t border-gray-100 flex justify-end bg-gray-50/30">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00B8C6] text-white text-xs font-bold hover:brightness-95 transition-all disabled:opacity-50"
            >
              {saving
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
