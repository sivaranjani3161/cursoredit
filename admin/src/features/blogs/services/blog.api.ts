import type { ApiBlog, BlogFormData } from '@/shared/types';

const API_BASE = '/api/proxy';

export const blogApi = {
  getAll: async (): Promise<ApiBlog[]> => {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  getById: async (id: number): Promise<ApiBlog> => {
    const res = await fetch(`${API_BASE}/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },

  create: async (data: BlogFormData & { createdBy: number }): Promise<ApiBlog> => {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create blog');
    }
    return res.json();
  },

  update: async (id: number, data: BlogFormData): Promise<ApiBlog> => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update blog');
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
  },

  togglePublish: async (blog: ApiBlog): Promise<ApiBlog> => {
    const newStatus: ApiBlog['status'] = blog.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`${API_BASE}/blogs/${blog.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...blog, status: newStatus }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
};
