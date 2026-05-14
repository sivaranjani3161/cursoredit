"use client";
import { useState } from "react";
import EnquiryModal from "@/app/components/Enquirymodel";

export default function EnrollCourse({ courseId }: { courseId?: string | number }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      {/* SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-0 relative z-10 -mb-[25px] md:-mb-[50px]">
        <div className="max-w-[800px] mx-auto rounded-2xl px-6 py-14 md:py-10 flex flex-col items-center justify-center text-center bg-[#00B8C6]">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontWeight: 500,
              fontSize: "32px",
              lineHeight: "100%",
            }}
          >
            Enroll Now and{" "}
            <strong style={{ fontWeight: 700 }}>Start Your Journey!</strong>
          </h2>

          {/* DESCRIPTION */}
          <p
            className="text-white mb-8 max-w-[520px]"
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "150%",
            }}
          >
            Take the first step to becoming an industry-ready developer. Our
            courses equip you with the skills, experience, and confidence to
            excel in the tech industry.
          </p>

          <button
            onClick={() => setEnquiryOpen(true)}
            className="bg-white text-[#00B8C6] font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-opacity-90 transition cursor-pointer"
            style={{ fontFamily: "Urbanist, sans-serif" }}
          >
            Register Now
          </button>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        defaultCourseId={courseId}
      />
    </>
  );
}