import { API, apiFetch } from "@/shared/lib/api";
import type { CourseCategory } from "@/features/courses/types/course";
import CoursesListingClient from "./CoursesListingClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  // Fetch categories that already have active courses nested inside
  const raw = await apiFetch<CourseCategory[]>(API.categories.withCourses()) ?? [];

  // Only keep categories that have at least one active course
  const categories = raw.filter((cat) => cat.courses.length > 0);

  return <CoursesListingClient categories={categories} />;
}