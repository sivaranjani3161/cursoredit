'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus, Trash2, Edit2, Mail, User as UserIcon,
  Shield, CheckCircle2, X, Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { useError } from '@/shared/context/ErrorContext';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required'),
  roleId: z.number({ invalid_type_error: 'Please select a role' }).int().positive('Please select a role'),
});

const API_BASE = '/api/proxy';

interface Role { id: number; name: string; code: string; }
interface User { id: number; email: string; name: string | null; status: string; roleId: number; role: Role; }

export default function UsersPage() {
  const { setError } = useError();
  const [users, setUsers]             = useState<User[]>([]);
  const [roles, setRoles]             = useState<Role[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [formData, setFormData]       = useState({ email: '', name: '', roleId: '' });
  const [mounted, setMounted]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { setMounted(true); fetchUsers(); fetchRoles(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) setUsers(await res.json());
      else setError('Failed to load users');
    } catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`);
      if (res.ok) setRoles(await res.json());
    } catch { setError('Failed to load roles'); }
  };

  const resetForm = () => { setFormData({ email: '', name: '', roleId: '' }); setEditingUser(null); setShowModal(false); };
  const openCreate = () => { setEditingUser(null); setFormData({ email: '', name: '', roleId: '' }); setShowModal(true); };
  const openEdit   = (user: User) => { setEditingUser(user); setFormData({ email: user.email, name: user.name || '', roleId: String(user.roleId) }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email:  formData.email.trim().toLowerCase(),
      name:   formData.name.trim(),
      roleId: Number(formData.roleId),
    };
    const parsed = userSchema.safeParse(payload);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Validation failed'); return; }
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
        setError(err.error || `Failed to ${isEdit ? 'update' : 'add'} user`);
      }
    } catch { setError('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { setUsers(users.filter(u => u.id !== deleteTarget.id)); toast.success('User deleted'); }
      else { const err = await res.json(); setError(err.error || 'Failed to delete user'); }
    } catch { setError('An error occurred'); }
    finally { setDeleting(false); setDeleteTarget(null); 
      
    }
  };

  return (
    <div className="p-3 sm:p-4 space-y-3">

      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 shadow-sm gap-3">
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">User Management</h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Manage system users and their assigned roles</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B8C6] text-white rounded-lg hover:bg-[#009da9] transition-all font-bold text-xs flex-shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Add User</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
<div className="overflow-x-auto">
  <table className="w-full text-left">
            <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
  <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">User</th>
  <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Email</th>
  <th className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Status</th>
  <th className="hidden sm:table-cell px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-[140px] min-w-[140px]">Role</th>
  <th className="w-[80px] min-w-[80px] px-2 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
</tr>

            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse" />
                        <div className="h-3 w-20 sm:w-24 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden sm:table-cell"><div className="h-3 w-32 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-3 sm:px-4 py-3 hidden md:table-cell"><div className="h-3 w-16 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-3 sm:px-4 py-3"><div className="h-3 w-16 rounded bg-slate-100 animate-pulse" /></td>
                    <td className="px-3 sm:px-4 py-3" />
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-cyan-50/30 transition-colors">
<td className="px-3 sm:px-4 py-3 align-middle w-full max-w-[0] sm:max-w-none">
                     <div className="flex items-start gap-2 min-w-0">
  <div className="w-8 h-8 rounded-full bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] border border-[#00B8C6]/20 shrink-0">
    {(user.name?.[0] || user.email[0]).toUpperCase()}
  </div>

 <div className="min-w-0 flex-1 overflow-hidden">
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-slate-800 text-sm truncate">
        {user.name || 'No Name'}
      </span>

<span className="text-[11px] leading-relaxed text-slate-400 break-words sm:hidden">        {user.email}
      </span>

<div className="flex flex-wrap gap-1 pt-1 sm:hidden">  
       <span className="px-2 py-0.5 rounded-full bg-[#00B8C6]/10 text-[#00B8C6] text-[9px] font-bold uppercase tracking-wider border border-[#00B8C6]/20 whitespace-nowrap">
  {user.role?.name}
</span>

        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
          user.status === 'ACTIVE'
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {user.status}
        </span>
      </div>
    </div>
  </div>
</div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-[11px] text-slate-500 hidden sm:table-cell">{user.email}</td>
                    <td className="px-3 sm:px-4 py-2.5 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {user.status}
                      </span>
                    </td>
<td className="hidden sm:table-cell px-3 sm:px-4 py-2.5 w-[140px] min-w-[140px]">
  <span className="px-2 py-0.5 rounded-full bg-[#00B8C6]/10 text-[#00B8C6] text-[10px] font-bold uppercase tracking-wider border border-[#00B8C6]/20 whitespace-nowrap">
    {user.role?.name}
  </span>
</td>
                    <td className="px-3 sm:px-4 py-2.5">
<div className="flex items-center justify-end gap-1 flex-nowrap">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-[#00B8C6] hover:bg-cyan-100 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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

      {/* ── Delete confirmation modal ── */}
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
                  <p className="text-sm font-bold text-slate-800">Delete User</p>
                  <p className="text-[11px] text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[10px] text-slate-400 mb-0.5">User to be deleted</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{deleteTarget.name || deleteTarget.email}</p>
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
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deleting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal portal ── */}
      {showModal && mounted && createPortal(
        <>
          {/* Backdrop */}
<div className="fixed inset-0 z-[59] bg-black/20 backdrop-blur-[1px] hidden lg:block" onClick={resetForm} />


          {/*
            Desktop (lg+): inset from sidebar + offsets — matches original exactly
            Mobile/Tablet:  full-screen sheet from bottom or centered dialog
          */}
          <div className="
  fixed z-[60] flex flex-col bg-white overflow-hidden

  inset-0

  md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
  md:w-[520px] md:max-h-[85dvh] md:rounded-2xl md:border md:border-slate-200 md:shadow-2xl

  lg:translate-x-0 lg:translate-y-0 lg:rounded-[10px] lg:border lg:border-slate-200 lg:shadow-2xl
  lg:top-[12px] lg:bottom-[12px] lg:left-[274px] lg:right-[12px]
  lg:w-auto lg:max-h-none
">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 h-11 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-[3px] h-4 rounded-full bg-[#00B8C6] flex-shrink-0" />
                <Users className="w-3.5 h-3.5 text-[#00B8C6] flex-shrink-0" />
                <h2 className="text-[13px] font-bold text-slate-800 flex-shrink-0">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <span className="text-[11px] text-slate-400 font-normal truncate hidden sm:block">
                  {editingUser ? 'Update user details and role' : 'Create an admin user and assign a role'}
                </span>
              </div>
              <button type="button" onClick={resetForm} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <form id="user-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-4 sm:px-6 py-5 flex flex-col gap-4 max-w-lg">

                {/* Avatar preview */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="w-9 h-9 rounded-full bg-[#00B8C6]/10 border border-[#00B8C6]/20 flex items-center justify-center text-[#00B8C6] font-bold text-sm flex-shrink-0">
                    {formData.name ? formData.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-slate-800 truncate leading-tight">{formData.name || 'Full name'}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{formData.email || 'email@example.com'}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="flex flex-col gap-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">
                    Role <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    <select
                      required
                      value={formData.roleId}
                      onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                      className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-900 focus:outline-none focus:border-[#00B8C6] focus:ring-2 focus:ring-[#00B8C6]/10 transition-all appearance-none"
                    >
                      <option value="">Choose a role…</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Role pills */}
                  {roles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, roleId: String(role.id) })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            formData.roleId === String(role.id)
                              ? 'bg-[#00B8C6] text-white border-[#00B8C6] shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-[#00B8C6]/50 hover:text-[#00B8C6]'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 sm:px-5 h-12 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
              <button
                type="button" onClick={resetForm}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                form="user-form"
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[11px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
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