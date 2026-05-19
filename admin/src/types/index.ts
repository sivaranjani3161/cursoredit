// ─────────────────────────────────────────────────────────────
// Shared admin types — import from this file instead of using `any`
// ─────────────────────────────────────────────────────────────

// ── Session / Auth ────────────────────────────────────────────

export interface AdminUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  roleId?: number;
  roleName?: string;
  dbUserId?: number;
  permissions?: Record<string, Record<string, boolean>>;
}

// ── Blog ─────────────────────────────────────────────────────

export type BlogStatus = "draft" | "published";

export interface ApiTag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: string | null;
  status: BlogStatus;
  createdBy: number;
  createdAt: string;
  tags?: string[];
  relatedBlogIds?: number[];
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: BlogStatus;
  tags: string[];
  relatedBlogIds: number[];
}

// ── Course ────────────────────────────────────────────────────

export interface NestedItem {
  id?: number;
  title: string;
  description?: string | string[] | null;
  sortOrder?: number;
  icon?: string | null;
  label?: string | null;
  phaseNumber?: number;
}

export interface ApiCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  isActive: boolean;
  categoryId: number | null;
  createdBy: number;
  createdAt: string;
  courseHighlights: NestedItem[];
  courseStructure: NestedItem[];
  courseFeatures: NestedItem[];
}

export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  isActive: boolean;
  categoryId: number | null;
  courseHighlights: NestedItem[];
  courseStructure: NestedItem[];
  courseFeatures: NestedItem[];
}

// ── CourseCategory ────────────────────────────────────────────

export interface ApiCourseCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
}

// ── Testimonial ───────────────────────────────────────────────

export type TestimonialType = "text" | "video";

export interface ApiTestimonial {
  id: number;
  type: TestimonialType;
  name: string;
  role: string | null;
  company: string | null;
  title: string | null;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdBy: number;
  createdAt: string;
}

export interface TestimonialFormData {
  type: TestimonialType;
  name: string;
  role: string | null;
  company: string | null;
  title: string | null;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
}

// ── Gallery ───────────────────────────────────────────────────

export type GalleryType = "internal" | "external";

export interface GalleryImage {
  id?: number;
  imageUrl: string;
  altText: string | null;
}

export interface ApiGalleryEvent {
  id: number;
  type: GalleryType;
  title: string | null;
  slug: string | null;
  location: string | null;
  coverImage: string | null;
  description: string | null;
  eventDate: string | null;
  createdBy: number | null;
  createdAt: string;
  galleryImages: GalleryImage[];
}

export interface GalleryFormData {
  title: string;
  slug: string;
  location: string | null;
  coverImage: string | null;
  description: string | null;
  eventDate: string | null;
  galleryImages: GalleryImage[];
}

// ── Enquiry ───────────────────────────────────────────────────

export type EnquiryStatus = "new" | "contacted" | "converted" | "closed";

export interface ApiEnquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  courseId: number | null;
  status: EnquiryStatus;
  createdAt: string;
  course?: { id: number; title: string } | null;
}

// ── User / Role ───────────────────────────────────────────────

export interface ApiRole {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  status: string;
  roleId: number;
  authProvider: string;
  createdAt: string;
  role?: ApiRole;
}

// ── Permission ────────────────────────────────────────────────

export type PermissionsMap = Record<string, Record<string, boolean>>;
