import { API, apiFetch } from "@/lib/api";
import type { CourseBasic } from "@/app/types/course";
import CoursesListingClient from "./CoursesListingClient";

/** Fetch active courses for listing. Rendered server-side. */
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await apiFetch<CourseBasic[]>(API.courses.active()) ?? [];

  return <CoursesListingClient courses={courses} />;
}