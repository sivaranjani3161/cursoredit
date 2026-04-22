import CourseHero from "@/app/components/Courses/Coursehero";
import CourseFeatures from "@/app/components/Courses/Coursefeatures";
import CourseStructure from "../components/Courses/Coursestructure";
import KeyFeatures from "../components/Courses/Keyfeatures";
import EnrollCourse from "../components/Courses/CourseEnroll";

export default function CoursesPage() {
  return (
    <main>
      <CourseHero />
      <CourseFeatures />
      <CourseStructure/>
      <KeyFeatures/>
      <EnrollCourse/>
    </main>
  );
}