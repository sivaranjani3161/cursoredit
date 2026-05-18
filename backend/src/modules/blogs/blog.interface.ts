import { BlogStatus } from "../../entities/enums/BlogStatus";

export interface CreateBlogBody {
  title: string;
  slug: string;
  createdBy: number;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  status?: BlogStatus;
  tags?: string[];
  relatedBlogIds?: number[];
}

export interface UpdateBlogBody {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  status?: BlogStatus;
  tags?: string[];
  relatedBlogIds?: number[];
}

export interface BlogIdParam {
  id: string;
}
