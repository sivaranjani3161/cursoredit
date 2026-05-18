import type { ApiEnquiry, ApiCourse } from '@/shared/types';

const API_BASE = '/api/proxy';

export const enquiryApi = {
  getAll: async (): Promise<ApiEnquiry[]> => {
    const res = await fetch(`${API_BASE}/enquiries`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  updateStatus: async (id: number, status: string): Promise<ApiEnquiry> => {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
};

export const enquiryCourseApi = {
  getAll: async (): Promise<ApiCourse[]> => {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },
};
