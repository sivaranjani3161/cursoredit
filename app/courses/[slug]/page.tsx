import { API, apiFetch } from "@/lib/api";
import type { Course } from "@/app/types/course";
import { notFound } from "next/navigation";
import CourseHeroSection from "@/app/components/Courses/CourseHeroSection";
import CourseFeaturesSection from "@/app/components/Courses/CourseFeaturesSection";
import CourseStructureSection from "@/app/components/Courses/CourseStructureSection";
import CourseKeyFeaturesSection from "@/app/components/Courses/CourseKeyFeaturesSection";
import EnrollCourse from "@/app/components/Courses/CourseEnroll";

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
