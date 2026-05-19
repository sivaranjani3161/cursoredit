import type { ApiGalleryEvent, GalleryFormData, GalleryType } from '@/shared/types';

const API_BASE = '/api/proxy';

export const galleryApi = {
  getAll: async (): Promise<ApiGalleryEvent[]> => {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  getById: async (id: number): Promise<ApiGalleryEvent> => {
    const res = await fetch(`${API_BASE}/gallery/${id}`);
    if (!res.ok) throw new Error('Failed to fetch gallery item');
    return res.json();
  },

  create: async (
    data: GalleryFormData & { createdBy?: number },
    type: GalleryType,
  ): Promise<ApiGalleryEvent> => {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create gallery item');
    }
    return res.json();
  },

  update: async (
    id: number,
    data: GalleryFormData | { imageUrl: string; altText: string | null },
    type: GalleryType,
  ): Promise<ApiGalleryEvent> => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update gallery item');
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },
};
