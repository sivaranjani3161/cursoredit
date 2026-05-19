// Types matching backend entities exactly

export interface CourseHighlight {
  id: number;
  courseId: number;
  title: string;
  description: string[] | null;
  icon: string | null;
  sortOrder: number;
}

export interface CourseStructure {
  id: number;
  courseId: number;
  phaseNumber: number;
  title: string;
  description: string[] | null;
  icon: string | null;
  sortOrder: number;
}

export interface CourseFeature {
  id: number;
  courseId: number;
  title: string;
  description: string[] | null;
  sortOrder: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courseHighlights: CourseHighlight[];
  courseStructure: CourseStructure[];
  courseFeatures: CourseFeature[];
}

/** Lightweight shape returned by /api/courses/active */
export interface CourseBasic {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
}

/** Category with its active courses — returned by /api/course-categories/with-courses */
export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  courses: CourseBasic[];
}
