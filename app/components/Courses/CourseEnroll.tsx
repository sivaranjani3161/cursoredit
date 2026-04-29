"use client";

import { useState } from "react";
import data from "@/app/data/CourseEnroll.json";
import EnquiryModal from "@/app/components/Enquirymodel"; // SAME as navbar

export default function EnrollCourse() {
  const { enrollBanner } = data;

  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      {/* SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-0 relative z-10 -mb-[25px] md:-mb-[50px]">
        <div className="max-w-[800px] mx-auto rounded-2xl px-6 py-14 md:py-10 flex flex-col items-center justify-center text-center bg-[#00B8C6]">
          
          {/* TITLE */}
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontWeight: 500,
              fontSize: "32px",
              lineHeight: "100%",
            }}
          >
            {enrollBanner.normalTitle}{" "}
            <strong style={{ fontWeight: 700 }}>
              {enrollBanner.boldTitle}
            </strong>
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
            {enrollBanner.description}
          </p>

          {/* ✅ REGISTER BUTTON → OPEN SAME MODAL */}
          <button
            onClick={() => setEnquiryOpen(true)}
            className="bg-white text-[#00B8C6] font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-opacity-90 transition cursor-pointer"
            style={{ fontFamily: "Urbanist, sans-serif" }}
          >
            Register Now
          </button>
        </div>
      </section>

      {/* ✅ SAME MODAL USED IN NAVBAR */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}