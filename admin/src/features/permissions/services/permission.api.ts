import type { PermissionsMap } from '@/shared/types';

const API_BASE = '/api/proxy';

export const permissionApi = {
  getByRole: async (roleId: number): Promise<PermissionsMap> => {
    const res = await fetch(`${API_BASE}/permissions/${roleId}`);
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  },

  update: async (roleId: number, permissions: PermissionsMap): Promise<void> => {
    const res = await fetch(`${API_BASE}/permissions/${roleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions }),
    });
    if (!res.ok) throw new Error('Failed to update permissions');
  },
};
