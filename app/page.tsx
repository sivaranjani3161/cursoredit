import Hero from "@/app/components/Hero";
import CoursesSection from "@/app/components/CoursesSection";
import ApproachSection from "@/app/components/ApproachSection";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import VideoTestimonials from "./components/VideoTestimonials";
import BlogSection from "./components/Blogs";

export default function Home() {
  return (
  <main className="min-h-screen flex flex-col">

  <div className="flex-1">
    <Hero />
    <CoursesSection />
    <ApproachSection />
    <WhyChooseUs />
    <Testimonials />
    <VideoTestimonials />
    <BlogSection />
  </div>


</main>
  );
}