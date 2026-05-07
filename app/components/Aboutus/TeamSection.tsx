"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import data from "@/app/data/team.json";
import { FaLinkedinIn } from "react-icons/fa";

export default function TeamShowcase() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % data.members.length);
        setVisible(true);
      }, 400);
    }, 4200);
    return () => clearInterval(interval);
  }, [started]);

  const member = data.members[active];
const isBlue = true;
  return (
    <section ref={sectionRef} className="py-[60px] md:py-[100px] bg-[#FDFDFD]">
      <div className="max-w-[900px] mx-auto px-6 text-center">

        {/* TITLE */}
        <h2 className="text-[28px] md:text-[36px] lg:text-[48px] font-medium text-[#2E2E2E]">
          {data.title.normal}{" "}
          <span className="font-bold">{data.title.highlight}</span>
        </h2>

        {/* SUBTITLE */}
        <p className="mt-[10px] md:mt-[16px] text-[14px] md:text-[18px] text-[#555] max-w-[650px] mx-auto leading-[150%]">
          {data.subtitle}
        </p>

        {/* ── MOBILE LAYOUT — untouched capsule ── */}
        <div className="sm:hidden relative mt-[50px]">
          <div className={`absolute inset-0 translate-y-[12px] rounded-[40px] ${isBlue ? "bg-[#0097A7]" : "bg-[#e0e0e0]"}`} />
          <div className={`relative z-10 flex flex-col items-center justify-center gap-[30px] px-[30px] py-[35px] rounded-[40px] transition-all duration-700 ${isBlue ? "bg-[#00B8C6] text-white" : "bg-white text-[#2E2E2E] border border-[#eee]"}`}>
            <div className="flex justify-center items-center">
              <div
                className={`w-[120px] h-[120px] rounded-full border-[5px] bg-white flex items-center justify-center transition-all duration-400 ease-in-out ${visible ? "translate-y-0 opacity-100" : "translate-y-[70px] opacity-0"}`}
                style={{ borderColor: isBlue ? "#ffffff" : "#00B8C6" }}
              >
                <div className="w-[90%] h-[90%] rounded-full overflow-hidden">
                  <Image src={member.image} alt={member.name} width={160} height={160} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
            <div className={`flex flex-col items-center text-center transition-all duration-400 ease-in-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"}`}>
              <h3 className="text-[24px] font-bold mb-[10px]">{member.name}</h3>
              <p className="text-[16px] opacity-90 mb-[16px]">{member.role}</p>
              <a
                href={member.linkedin}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`, "_blank", "noopener,noreferrer"); }}
                className="w-[36px] h-[36px] flex items-center justify-center bg-[#0077B5] text-white rounded-md hover:scale-110 transition"
              >
                <FaLinkedinIn className="w-[60%] h-[60%]" />
              </a>
            </div>
          </div>
        </div>

        {/* ── TAB & DESKTOP LAYOUT — all members side by side ── */}
<div className="hidden sm:flex flex-row items-start justify-center gap-[40px] md:gap-[70px] lg:gap-[90px] mt-[50px] md:mt-[70px]">          {data.members.map((m, i) => (
            <div
              key={i}
className="group flex flex-col items-center text-center cursor-pointer px-2 md:px-4"              style={{
                animation: `fadeSlideUp 0.6s ease forwards`,
                animationDelay: `${i * 150}ms`,
              }}
            >
              {/* Circle image */}
              <div
                className="
                  relative
                  w-[130px] h-[130px] md:w-[160px] md:h-[160px]
                  rounded-full
                  border-[3px] border-[#00B8C6]
                  overflow-hidden
                  transition-all duration-300
                  group-hover:border-[5px]
                  group-hover:shadow-[0_0_30px_rgba(0,184,198,0.5)]
                  group-hover:scale-105
                "
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className="
                  mt-4 px-4 py-3 rounded-2xl
                  transition-all duration-300
                  group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
                  group-hover:bg-white
                "
              >
                <h3 className="text-[16px] md:text-[18px] font-semibold text-[#2E2E2E] mb-1">
                  {m.name}
                </h3>
                <p className="text-[13px] md:text-[14px] text-[#888] mb-3">
                  {m.role}
                </p>
                <div className="flex justify-center">
                <a  
                    href={m.linkedin}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(m.linkedin.startsWith("http") ? m.linkedin : `https://${m.linkedin}`, "_blank", "noopener,noreferrer"); }}
                    className="w-[32px] h-[32px] flex items-center justify-center bg-[#0077B5] text-white rounded-md hover:scale-110 transition"
                  >
                    <FaLinkedinIn className="w-[55%] h-[55%]" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}