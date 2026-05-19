import { API, apiFetch } from "@/shared/lib/api";
import type { Course } from "@/features/courses/types/course";
import { notFound } from "next/navigation";
import CourseHeroSection from "@/features/courses/components/CourseHeroSection";
import CourseFeaturesSection from "@/features/courses/components/CourseFeaturesSection";
import CourseStructureSection from "@/features/courses/components/CourseStructureSection";
import CourseKeyFeaturesSection from "@/features/courses/components/CourseKeyFeaturesSection";
import EnrollCourse from "@/features/courses/components/CourseEnroll";

// force-dynamic: page is always server-rendered on request.
// generateStaticParams must NOT coexist with force-dynamic (causes
// Turbopack "negative timestamp" performance.measure error).
export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await apiFetch<Course>(API.courses.bySlug(slug));

  if (!course) notFound();

  return (
    <main>
      <CourseHeroSection course={course} />
      <CourseFeaturesSection course={course} />
      <CourseStructureSection course={course} />
      <CourseKeyFeaturesSection course={course} />
      <EnrollCourse courseId={course.id} />
    </main>
  );
}
