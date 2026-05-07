'use client';

import { useState, useEffect } from 'react';
import { Check, Save, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"];
const OPERATIONS = ["create", "read", "update", "delete"];

interface RolePermissionMap {
  roleId: number;
  roleCode: string;
  roleName: string;
  permissions: Record<string, Record<string, boolean>>;
}

export default function PermissionsGrid() {
  const [data, setData] = useState<RolePermissionMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/permissions/all`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId: number, module: string, op: string) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.roleId === roleId) {
          if (item.roleCode === 'admin') return item;
          return {
            ...item,
            permissions: {
              ...item.permissions,
              [module]: {
                ...item.permissions[module],
                [op]: !item.permissions[module][op],
              },
            },
          };
        }
        return item;
      })
    );
  };

  const handleSave = async (roleId: number) => {
  setSaving(roleId);

  console.log("ROLE ID:", roleId);

  const roleData = data.find((d) => d.roleId === roleId);

  console.log("ROLE DATA:", roleData);

  if (!roleData) {
    console.log("NO ROLE DATA");
    return;
  }

  const payload = {
    roleId,
    permissions: roleData.permissions,
  };

  console.log("PAYLOAD:", payload);

  try {
    console.log("FETCH START");

    const res = await fetch("http://localhost:3001/api/permissions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("FETCH RESPONSE:", res);

    const text = await res.text();

    console.log("RESPONSE TEXT:", text);

  } catch (error) {
    console.error("FULL FETCH ERROR:", error);
  } finally {
    setSaving(null);
  }
};

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {MODULES.map((module) => (
        <div key={module} className="card-minimal overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-sm font-bold capitalize text-gray-900 tracking-tight">{module} Module</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Access Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest w-1/4">System Role</th>
                  {OPERATIONS.map((op) => (
                    <th key={op} className="px-4 py-4 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      {op}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-gray-400 text-[10px] font-bold uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((roleMap) => {
                  const isAdmin = roleMap.roleCode === 'admin';
                  return (
                    <tr key={roleMap.roleId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin ? 'bg-blue-100 text-[#0066FF]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {roleMap.roleName}
                          </span>
                          {isAdmin && <Lock className="text-gray-300 w-3 h-3" />}
                        </div>
                      </td>
                      {OPERATIONS.map((op) => {
                        const isChecked = roleMap.permissions[module]?.[op];
                        return (
                          <td key={op} className="px-4 py-4">
                            <div className="flex justify-center">
                              <button
                                disabled={isAdmin}
                                onClick={() => togglePermission(roleMap.roleId, module, op)}
                                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                                  isChecked
                                    ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                } ${isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={isAdmin || saving === roleMap.roleId}
                          onClick={() => handleSave(roleMap.roleId)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            isAdmin 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'bg-white text-[#0066FF] border border-blue-100 hover:bg-blue-50'
                          }`}
                        >
                          {saving === roleMap.roleId ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
