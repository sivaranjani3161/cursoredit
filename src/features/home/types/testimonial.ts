export type TestimonialType = "text" | "video";

/** Shape returned by GET /api/testimonials */
export interface ApiTestimonial {
  id: number;
  type: TestimonialType;
  videoUrl: string | null;       // present when type === 'video'
  thumbnailUrl: string | null;   // video thumbnail OR text testimonial avatar
  name: string;                  // person's name
  role: string | null;          
  company: string | null;        // company name
  title: string | null;          // testimonial headline
  description: string | null;    // the testimonial body text
  isActive: boolean;
  sortOrder: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

/** Get initials from a name for fallback avatar */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
