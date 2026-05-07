'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Edit2, Mail, User as UserIcon, Shield } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface Role {
  id: number;
  name: string;
  code: string;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  status: string;
  roleId: number;
  role: Role;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    roleId: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/roles`);
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          roleId: Number(formData.roleId),
        }),
      });

      if (res.ok) {
        fetchUsers();
        setShowAddModal(false);
        setFormData({ email: '', name: '', roleId: '' });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  return (
<div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system users and their assigned roles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 rounded-lg hover:bg-[#0052cc] transition-all shadow-sm font-semibold text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="card-minimal overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Access Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0066FF] font-bold text-xs border border-blue-100">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{user.name || 'No Name'}</div>
                      <div className="text-[11px] text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-bold uppercase tracking-wider">
                    {user.role?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-gray-400 hover:text-[#0066FF] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="py-20 text-center text-gray-400 text-sm">
            No users found in the system.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               Invite User
            </h2>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none text-sm transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Role Assignment</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <select
                    required
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none text-sm transition-all appearance-none bg-white"
                  >
                    <option value="">Choose a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-semibold text-sm shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
