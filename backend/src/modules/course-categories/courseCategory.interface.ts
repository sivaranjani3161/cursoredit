export interface CreateCourseCategoryBody {
  name: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
}

export interface UpdateCourseCategoryBody {
  name?: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
}

export interface CourseCategoryIdParam {
  id: string;
}
