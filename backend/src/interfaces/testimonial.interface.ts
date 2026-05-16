import { TestimonialType } from "../entities/enums/TestimonialType";

export interface CreateTestimonialBody {
  createdBy: number;
  type?: TestimonialType;
  name?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  role?: string | null;
  company?: string | null;
  title?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateTestimonialBody {
  type?: TestimonialType;
  name?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  role?: string | null;
  company?: string | null;
  title?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface TestimonialIdParam {
  id: string;
}
