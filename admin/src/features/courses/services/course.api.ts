import type { ApiCourse, ApiCourseCategory, CourseFormData } from '@/shared/types';

const API_BASE = '/api/proxy';

export const courseApi = {
  getAll: async (): Promise<ApiCourse[]> => {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  getById: async (id: number): Promise<ApiCourse> => {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  create: async (data: CourseFormData & { createdBy: number }): Promise<ApiCourse> => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create course');
    }
    return res.json();
  },

  update: async (id: number, data: CourseFormData): Promise<ApiCourse> => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update course');
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete course');
  },

  togglePublish: async (course: ApiCourse): Promise<ApiCourse> => {
    const res = await fetch(`${API_BASE}/courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...course, isActive: !course.isActive }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to toggle publish');
    }
    return res.json();
  },
};

export const categoryApi = {
  getAll: async (): Promise<ApiCourseCategory[]> => {
    const res = await fetch(`${API_BASE}/course-categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  create: async (data: { name: string; slug: string; description: string | null }): Promise<ApiCourseCategory> => {
    const res = await fetch(`${API_BASE}/course-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/course-categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
  },
};
