export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/** Shape returned by GET /blogs and GET /blogs/:id */
export interface ApiBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;           // HTML from rich-text editor
  coverImage: string | null;
  publishedAt: string | null;
  status: BlogStatus;
  createdBy: number;
  tags: string[];            // already flattened by formatBlog()
  relatedBlogIds: number[];  // already flattened by formatBlog()
  createdAt: string;
  updatedAt: string;
}

/** Utility: pick the best display date */
export function blogDisplayDate(blog: Pick<ApiBlog, "publishedAt" | "createdAt">): string {
  const raw = blog.publishedAt ?? blog.createdAt;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
