export interface NestedItemInput {
  title: string;
  description?: string[];
  icon?: string | null;
  phaseNumber?: number;
  sortOrder?: number;
}

export interface CreateCourseBody {
  title: string;
  slug: string;
  createdBy: number;
  description?: string | null;
  heroImage?: string | null;
  isActive?: boolean;
  categoryId?: number | null;
  courseHighlights?: NestedItemInput[];
  courseFeatures?: NestedItemInput[];
  courseStructure?: NestedItemInput[];
}

export interface UpdateCourseBody {
  title?: string;
  slug?: string;
  description?: string | null;
  heroImage?: string | null;
  isActive?: boolean;
  categoryId?: number | null;
  courseHighlights?: NestedItemInput[];
  courseFeatures?: NestedItemInput[];
  courseStructure?: NestedItemInput[];
}

export interface CourseIdParam {
  id: string;
}

export interface CourseSlugParam {
  slug: string;
}
