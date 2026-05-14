/**
 * Central API helper for finestapp → backend communication.
 * Backend runs on http://localhost:3001
 */

import { ApiBlog } from "@/app/types/blog";
import { ApiTestimonial } from "@/app/types/testimonial";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const API = {
  courses: {
    /** All active courses – basic info (for listings / dropdowns) */
    active: () => `${BACKEND_URL}/api/courses/active`,
    /** Full course data by slug (includes highlights, structure, features) */
    bySlug: (slug: string) => `${BACKEND_URL}/api/courses/slug/${slug}`,
  },
  testimonials: {
    all: () => `${BACKEND_URL}/api/testimonials`,
  },
  blogs: {
    all: () => `${BACKEND_URL}/api/blogs`,
    byId: (id: number) => `${BACKEND_URL}/api/blogs/${id}`,
  },
};

/** Typed fetch wrapper – returns null on 404/error instead of throwing */
export async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Fetch all blogs and return only PUBLISHED ones */
export async function fetchPublishedBlogs(): Promise<ApiBlog[]> {
  const data = await apiFetch<ApiBlog[]>(API.blogs.all());
  if (!data) return [];
  return data.filter((b) => b.status === "PUBLISHED");
}

/** Fetch all blogs and return the one matching slug (any status) */
export async function fetchBlogBySlug(slug: string): Promise<ApiBlog | null> {
  const data = await apiFetch<ApiBlog[]>(API.blogs.all());
  if (!data) return null;
  return data.find((b) => b.slug === slug) ?? null;
}

/** Fetch all active testimonials */
export async function fetchTestimonials(): Promise<ApiTestimonial[]> {
  const data = await apiFetch<ApiTestimonial[]>(API.testimonials.all());
  if (!data) return [];
  return data.filter((t) => t.isActive);
}

/** Fetch only text testimonials (isActive) */
export async function fetchTextTestimonials(): Promise<ApiTestimonial[]> {
  const all = await fetchTestimonials();
  return all.filter((t) => t.type === "text");
}

/** Fetch only video testimonials (isActive) */
export async function fetchVideoTestimonials(): Promise<ApiTestimonial[]> {
  const all = await fetchTestimonials();
  return all.filter((t) => t.type === "video");
}

/** Fetch related blogs from a list of IDs (from published pool) */
export async function fetchRelatedBlogs(
  currentId: number,
  relatedBlogIds: number[],
  allBlogs: ApiBlog[]
): Promise<ApiBlog[]> {
  // Prefer explicitly set related blogs
  if (relatedBlogIds.length > 0) {
    const related = relatedBlogIds
      .map((id) => allBlogs.find((b) => b.id === id && b.status === "PUBLISHED"))
      .filter((b): b is ApiBlog => !!b)
      .slice(0, 5);
    if (related.length > 0) return related;
  }
  // Fall back to other published blogs
  return allBlogs
    .filter((b) => b.id !== currentId && b.status === "PUBLISHED")
    .slice(0, 5);
}
