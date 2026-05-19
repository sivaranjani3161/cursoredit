import type { ApiTestimonial, TestimonialFormData } from '@/shared/types';

const API_BASE = '/api/proxy';

export const testimonialApi = {
  getAll: async (): Promise<ApiTestimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  create: async (data: TestimonialFormData & { createdBy: number }): Promise<ApiTestimonial> => {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create testimonial');
    }
    return res.json();
  },

  update: async (id: number, data: TestimonialFormData): Promise<ApiTestimonial> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update testimonial');
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },
};
