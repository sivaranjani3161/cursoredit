'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Mail, User as UserIcon, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE = '/api/proxy';

interface Role { id: number; name: string; code: string; }
interface User { id: number; email: string; name: string | null; status: string; roleId: number; role: Role; }

export default function UsersPage() {
  const [users, setUsers]               = useState<User[]>([]);
  const [roles, setRoles]               = useState<Role[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser]   = useState<User | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [formData, setFormData]         = useState({ email: '', name: '', roleId: '' });

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

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
      else toast.error('Failed to load roles');
    } catch { toast.error('Failed to load roles'); }
  };

  const resetForm = () => {
    setFormData({ email: '', name: '', roleId: '' });
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ email: '', name: '', roleId: '' });
    setShowUserModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name || '', roleId: String(user.roleId) });
    setShowUserModal(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
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
        const error = await res.json();
        toast.error(error.error || `Failed to ${isEdit ? 'update' : 'add'} user`);
      }
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      if (res.ok) { setUsers(users.filter(u => u.id !== id)); toast.success('User deleted'); }
      else { const error = await res.json(); toast.error(error.error || 'Failed to delete user'); }
    } catch { toast.error('An error occurred'); }
  };

  return (
    <div className="space-y-2">

      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">User Management</h1>
          <p className="text-[11px] text-gray-400 leading-tight">Manage system users and their assigned roles</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B8C6] text-white rounded-lg hover:bg-[#009da9] transition-all font-bold text-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">User</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role & Status</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse shrink-0" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                        <div className="h-2.5 w-32 rounded bg-gray-100 animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><div className="h-3 w-20 rounded bg-gray-100 animate-pulse" /></td>
                  <td className="px-4 py-2.5" />
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-cyan-50/30 transition-colors">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] border border-[#00B8C6]/20 shrink-0">
                        {(user.name?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm leading-tight">{user.name || 'No Name'}</div>
                        <div className="text-[10px] text-gray-400 leading-tight">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {user.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00B8C6]/10 text-[#00B8C6] text-[10px] font-bold uppercase tracking-wider">
                        {user.role?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1 text-gray-400 hover:text-[#00B8C6] hover:bg-[#00B8C6]/5 rounded transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl border border-slate-200">

            {/* Modal header */}
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmitUser} className="px-4 py-3 space-y-3">

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg focus:ring-1 focus:ring-[#00B8C6]/50 focus:border-[#00B8C6] outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg focus:ring-1 focus:ring-[#00B8C6]/50 focus:border-[#00B8C6] outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                  <select
                    required
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-1 focus:ring-[#00B8C6]/50 focus:border-[#00B8C6] outline-none text-sm appearance-none"
                  >
                    <option value="">Choose a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#00B8C6] text-white rounded-lg hover:bg-[#009da9] transition-colors font-semibold text-xs disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}