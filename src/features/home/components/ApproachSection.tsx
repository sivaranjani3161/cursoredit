"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  {
    title: "Train",
    desc: "Hands-on, project-based learning that builds industry-ready skills.",
  },
  {
    title: "Hire",
    desc: "Careful selection to match the right talent with CodingMart.",
  },
  {
    title: "Deploy",
    desc: "Effortless onboarding to ensure immediate productivity.",
  },
];

const circles = [
  "Train Hire Deploy",
  "Elite 60",
  "Short Term Training",
];

export default function ApproachSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#FDFDFD] py-[50px] md:py-[80px] text-center">

      {/* TITLE */}
      <h2 className="text-[26px] sm:text-[32px] md:text-[54px] font-medium text-[#2E2E2E] px-4">
        Our <span className="font-semibold">Approach</span>
      </h2>

      <p className="text-[13px] sm:text-[14px] md:text-[18px] text-[#464646] mt-[10px] max-w-[700px] mx-auto px-4">
        Our approach focuses on practical, hands-on learning designed to build confidence and real-world skills.
      </p>

      {/* ================= MOBILE ================= */}
      <div className="mt-[40px] md:hidden flex justify-center px-4">
<div className="flex items-start gap-[16px] w-full max-w-[360px]">
          {/* LEFT CIRCLES */}
          <div className="flex flex-col items-center gap-[20px] relative">
            {circles.map((text, i) => (
<div key={i} className="flex items-center gap-[10px] w-[110px]">
                {/* CIRCLE */}
                <div
                  onClick={() => setActive(i)}
                  className={`
                    w-[70px] h-[70px]
                    rounded-full flex items-center justify-center
                    text-[11px] text-center px-2 cursor-pointer
                    ${
                      active === i
                        ? "bg-[#00B8C6] text-white"
                        : "border border-black text-[#2E2E2E]"
                    }
                  `}
                >
                  {text}
                </div>

        {active === i && (
  <div className="w-[40px] flex items-center justify-center md:hidden">
<Image
  src="/arrow-step.png"
  alt="arrow"
  width={16}
  height={32}
  className="w-[16px] sm:w-[18px] md:w-[20px] h-auto"
/>
</div>
)}

              </div>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex">
<div className="
  border border-[#BABABA] rounded-[12px]
  px-[14px] py-[16px]
  bg-white text-left
  w-full

  /* 🔥 MOBILE HEIGHT FIX */
  min-h-[260px] sm:min-h-[280px]

  flex flex-col justify-center gap-[10px]
">             {steps.map((item, idx) => (
<div key={idx} className="space-y-[2px]">                  <h3 className="text-[14px] font-semibold">{item.title}</h3>
                  <p className="text-[12px] text-[#464646]">{item.desc}</p>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>

      {/* ================= TABLET + DESKTOP ================= */}
      <div className="relative mt-[80px] hidden md:flex flex-col items-center">

        {/* HORIZONTAL LINE (BEHIND CIRCLES - FIXED POSITION) */}
{/* HORIZONTAL LINE (BEHIND CIRCLES - FIXED POSITION) */}
<div className="
  absolute 
  top-[55px] lg:top-[72px]
  left-1/2 -translate-x-1/2 
  w-[85%] max-w-[1100px] 
  border-t border-[#BABABA]
" />
        {/* CIRCLES */}
        <div className="flex gap-[80px] lg:gap-[140px] justify-center relative z-10">
          {circles.map((text, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`
                  w-[110px] h-[110px] lg:w-[144px] lg:h-[144px]
                  rounded-full flex items-center justify-center
                  text-[13px] lg:text-[16px] text-center px-4 lg:px-10
                  ${
                    active === i
                      ? "bg-[#00B8C6] text-white"
                      : "bg-white border border-black text-[#2E2E2E]"
                  }
                `}
              >
                {text}
              </div>

              {/* CONNECT TO RECTANGLE */}
              {active === i && (
                <div className="mt-[10px] w-[2px] h-[65px] bg-[#BABABA]" />
              )}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="mt-[0px] w-full flex justify-center px-4">

          <div className="w-full max-w-[1100px] border border-[#BABABA] rounded-[16px] bg-white flex flex-col md:flex-row md:px-[40px] lg:px-[60px] py-[25px] md:py-[40px] gap-[20px]">

            {steps.map((item, i) => (
              <div key={i} className="flex-1 text-center md:text-left relative px-3 md:px-4">

                {/* SEPARATOR */}
                {i !== 0 && (
                  <div className="hidden md:block absolute left-[-20px] top-1/2 -translate-y-1/2 w-[1px] h-[80px] bg-[#BABABA]" />
                )}

                {/* ARROW */}
                {i !== 0 && (
                  <div className="hidden md:block absolute left-[-20px] top-1/2 -translate-y-1/2">
<Image
  src="/arrow-step.png"
  alt=""
  width={16}
  height={32}
  className="w-[16px] lg:w-[18px] h-auto"
/>               </div>
                )}

                <h3 className="text-[16px] md:text-[20px] lg:text-[24px] font-semibold text-[#2E2E2E]">
                  {item.title}
                </h3>

                <p className="mt-[6px] md:mt-[10px] text-[12px] md:text-[14px] lg:text-[18px] text-[#464646] max-w-[240px] mx-auto md:mx-0">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}