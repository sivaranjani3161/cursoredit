'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus, Trash2, Edit2, Mail, User as UserIcon,
  Shield, CheckCircle2, X, Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

const API_BASE = '/api/proxy';
const SIDEBAR_WIDTH = 262;
const TOP_OFFSET = 12;
const RIGHT_OFFSET = 12;
const BOTTOM_OFFSET = 12;

interface Role { id: number; name: string; code: string; }
interface User { id: number; email: string; name: string | null; status: string; roleId: number; role: Role; }

const inp = 'w-full h-7 px-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const inpIcon = 'w-full h-7 pl-7 pr-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:bg-white transition-colors';
const lbl = 'block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5';

export default function UsersPage() {
  const [users, setUsers]             = useState<User[]>([]);
  const [roles, setRoles]             = useState<Role[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [formData, setFormData]       = useState({ email: '', name: '', roleId: '' });
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); fetchUsers(); fetchRoles(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) setUsers(await res.json());
      else toast.error('Failed to load users');
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`);
      if (res.ok) setRoles(await res.json());
    } catch { toast.error('Failed to load roles'); }
  };

  const resetForm = () => {
    setFormData({ email: '', name: '', roleId: '' });
    setEditingUser(null);
    setShowModal(false);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ email: '', name: '', roleId: '' });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name || '', roleId: String(user.roleId) });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email: formData.email.trim().toLowerCase(),
      name: formData.name.trim(),
      roleId: Number(formData.roleId),
    };
    if (!payload.email || !payload.name || Number.isNaN(payload.roleId)) {
      toast.error('Please fill all fields'); return;
    }
    try {
      setSubmitting(true);
      const isEdit = Boolean(editingUser);
      const res = await fetch(
        isEdit ? `${API_BASE}/users/${editingUser!.id}` : `${API_BASE}/users`,
        { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (res.ok) {
        await fetchUsers();
        toast.success(isEdit ? 'User updated' : 'User created');
        resetForm();
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to ${isEdit ? 'update' : 'add'} user`);
      }
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      if (res.ok) { setUsers(users.filter(u => u.id !== id)); toast.success('User deleted'); }
      else { const err = await res.json(); toast.error(err.error || 'Failed to delete user'); }
    } catch { toast.error('An error occurred'); }
  };

  return (
    <div className="p-3 sm:p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">User Management</h1>
          <p className="text-[11px] text-slate-400">Manage system users and their assigned roles</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B8C6] text-white rounded-lg hover:bg-[#009da9] transition-all font-bold text-xs"
        >
          <UserPlus className="w-3.5 h-3.5" /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[820px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">User Name</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse" />
                        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-3 w-40 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-16 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-20 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-4 py-3" />
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] border border-[#00B8C6]/20 shrink-0">
                          {(user.name?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{user.name || 'No Name'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500">{user.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#00B8C6]/10 text-[#00B8C6] text-[10px] font-bold uppercase tracking-wider border border-[#00B8C6]/20">
                        {user.role?.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-[#00B8C6] hover:bg-cyan-100 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && mounted && createPortal(
        <>
          <div
            className="fixed z-[59] bg-black/20 backdrop-blur-[1px]"
            style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
            onClick={resetForm}
          />

          <div
            className="fixed z-[60] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden"
            style={{ left: SIDEBAR_WIDTH, top: TOP_OFFSET, right: RIGHT_OFFSET, bottom: BOTTOM_OFFSET, borderRadius: 10 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-[3px] h-3.5 rounded-full bg-[#00B8C6]" />
                <Users className="w-3.5 h-3.5 text-[#00B8C6]" />
                <h2 className="text-[12.5px] font-bold text-slate-800">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <span className="text-[10.5px] text-slate-400 font-normal">
                  {editingUser ? 'Update user details and role' : 'Create an admin user and assign a role'}
                </span>
              </div>
              <button type="button" onClick={resetForm} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <form id="user-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 flex min-h-0 gap-0">

                {/* ── Left: fields ── */}
                <div className="flex-shrink-0 w-[340px] flex flex-col gap-2.5 px-4 py-3 border-r border-slate-100 bg-slate-50/40">

                  {/* Avatar preview */}
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white mb-0.5">
                    <div className="w-9 h-9 rounded-full bg-[#00B8C6]/10 border border-[#00B8C6]/20 flex items-center justify-center text-[#00B8C6] font-bold text-sm flex-shrink-0">
                      {formData.name ? formData.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-800 truncate">{formData.name || 'Full name'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{formData.email || 'email@example.com'}</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className={lbl}>Full Name <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <UserIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inpIcon}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={lbl}>Email Address <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inpIcon}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className={lbl}>Role <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <Shield className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                      <select
                        required
                        value={formData.roleId}
                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                        className={`${inpIcon} appearance-none`}
                      >
                        <option value="">Choose a role…</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Role pills */}
                  {roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, roleId: String(role.id) })}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                            formData.roleId === String(role.id)
                              ? 'bg-[#00B8C6] text-white border-[#00B8C6]'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#00B8C6]/40 hover:text-[#00B8C6]'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* ── Right: info panel fills remaining space ── */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 bg-slate-50/20">
                  <div className="w-14 h-14 rounded-2xl bg-[#00B8C6]/8 border border-[#00B8C6]/15 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#00B8C6]/60" />
                  </div>
                  <div className="text-center max-w-xs">
                    <p className="text-[12px] font-semibold text-slate-600 mb-1">
                      {editingUser ? 'Editing user access' : 'New admin user'}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {editingUser
                        ? 'Update the name, email, or role for this user. Changes take effect on their next login.'
                        : 'Fill in the details on the left to create a new admin user. They will receive an invitation email to set their password.'}
                    </p>
                  </div>

                  {/* Summary card — shown when form is filled */}
                  {(formData.name || formData.email) && (
                    <div className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-3 space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Summary</p>
                      {formData.name && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-3 h-3 text-slate-300 flex-shrink-0" />
                          <span className="text-[11px] text-slate-700 truncate">{formData.name}</span>
                        </div>
                      )}
                      {formData.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-300 flex-shrink-0" />
                          <span className="text-[11px] text-slate-500 truncate">{formData.email}</span>
                        </div>
                      )}
                      {formData.roleId && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-slate-300 flex-shrink-0" />
                          <span className="text-[11px] text-[#00B8C6] font-semibold">
                            {roles.find(r => String(r.id) === formData.roleId)?.name ?? '—'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </form>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 h-10 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
              <button
                type="button" onClick={resetForm}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                form="user-form"
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
              >
                {submitting
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <CheckCircle2 className="w-3 h-3" />
                }
                {submitting ? 'Saving…' : editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}