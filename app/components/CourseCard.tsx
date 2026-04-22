"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  title: string;
  desc: string;
  image: string;
  tags: string[];
}

export default function CourseCard({ title, desc, image, tags }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`
  groupgit log
  
  overflow-hidden
  w-[260px] sm:w-[300px] md:w-[384px] shrink-0
  transition-all duration-300 ease-out
  will-change-transform
  [transform:translateZ(0)]
  ${hover ? "-translate-y-[8px]" : ""}
`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* IMAGE */}
      <div className="relative w-full h-[170px] sm:h-[240px] md:h-[282px] rounded-t-[12px] overflow-hidden">

        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 384px"
className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform [transform:translateZ(0)]"        />

        {/* TAGS */}
        <div className="absolute top-[12px] left-0 flex flex-col gap-[6px] z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="
                bg-white text-[#2E2E2E]
                text-[11px]
                px-[12px] py-[4px]
                rounded-r-full
                border-b-[3px] border-[#00B8C6]
                shadow-sm
              "
            >
              {tag}
            </span>
          ))}
        </div>

<Image
  src="/badge.png"
  alt="badge"
  width={22}
  height={22}
  className="absolute top-[10px] right-[10px]"
  style={{ width: "auto", height: "auto" }}
/>
      </div>

      {/* CONTENT */}
      <div
        className={`
          w-full min-h-[220px] md:min-h-[260px]
          border border-[#E6E6E6] border-t-0
          rounded-b-[12px]
          px-[16px] py-[18px]
          flex flex-col justify-between
          transition-all duration-300

          ${hover ? "bg-[#00B8C6]" : "bg-white"}
        `}
      >

        {/* TEXT */}
        <div className="flex flex-col gap-[8px]">

          <h3
            className={`
              text-[18px] sm:text-[20px] md:text-[24px]
              font-semibold
              ${hover ? "text-white" : "text-[#2E2E2E]"}
            `}
          >
            {title}
          </h3>

          <p
            className={`
              text-[13px] sm:text-[14px] md:text-[16px]
              ${hover ? "text-white/90" : "text-[#464646]"}
            `}
          >
            {desc}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 mt-[10px]">

      <button
  className={`
    flex-1 h-[40px]
    flex items-center justify-between
    px-[16px]
    rounded-full
    text-[13px] font-semibold
    transition-all duration-300

    /* NORMAL */
    bg-[#00B8C6] text-white border border-transparent

    /* DESKTOP HOVER */
    group-hover:bg-white
    group-hover:text-[#2E2E2E]
    group-hover:border-[#BABABA]

    /* MOBILE TOUCH FIX */
    ${hover ? "!bg-white !text-[#2E2E2E] !border-[#BABABA]" : ""}
  `}
>
            <span>Enquire Now</span>

            <svg width="20" height="14" viewBox="0 0 28 18" fill="none">
              <path
                d="M2 9h18M16 5l6 4-6 4"
                strokeWidth="2"
                stroke="currentColor"
              />
            </svg>
          </button>

          {/* BOOKMARK */}
          <div
            className="
              w-[32px] h-[32px]
              flex items-center justify-center
              rounded-full
              transition-all duration-300

              /* NORMAL */
              bg-[#00B8C6]

              /* HOVER */
              group-hover:bg-white
            "
          >
            <svg
              width="14"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="
                transition-all duration-300

                /* NORMAL */
                stroke-white

                /* HOVER */
                group-hover:stroke-[#00B8C6]
              "
            >
              <path
                d="M6 3h12v18l-6-4-6 4V3z"
                strokeWidth="2"
              />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}