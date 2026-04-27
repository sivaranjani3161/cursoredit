import CourseHero from "@/app/components/Courses/Coursehero";
import CourseFeatures from "@/app/components/Courses/Coursefeatures";
import CourseStructure from "@/app/components/Courses/Coursestructure";
import KeyFeatures from "@/app/components/Courses/Keyfeatures";
import EnrollCourse from "@/app/components/Courses/CourseEnroll";

export function generateStaticParams() {
  return [
    { slug: "full-stack-development" },
    { slug: "mastering-css" },
    { slug: "dev-ops-mastery" },
    { slug: "qa-automation" },
  ];
}

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main>
      <CourseHero />
      <CourseFeatures />
      <CourseStructure />
      <KeyFeatures />
      <EnrollCourse />
    </main>
  );
}
