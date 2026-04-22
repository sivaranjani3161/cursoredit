"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#F5F5F5] pt-[50px] md:pt-[70px] pb-0 overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4">

        {/* GRID FIX */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr] lg:grid-cols-[1.2fr_1fr_1fr] gap-[30px] md:gap-[40px] lg:gap-[60px]">

          {/* LEFT */}
          <div>
<Image
  src="/logo.png"
  alt="logo"
  width={180}   // 🔥 match navbar
  height={60}
  style={{ width: "auto", height: "auto" }}
  className="mb-[12px] md:mb-[20px] cursor-pointer"
/>
            {/* TEXT FIX */}
            <p className="text-[14px] sm:text-[15px] md:text-[15px] lg:text-[17px] leading-[1.7] text-[#2E2E2E] font-medium max-w-[420px]">
              Finest Coder provides practical, hands-on training led by industry professionals actively engaged in real client projects. This approach ensures you learn skills that are not only current but also highly applicable in the real world
            </p>

            <div className="mt-[20px] md:mt-[24px]">
             <Image
  src="/social.png"
  alt="social"
  width={180}
  height={40}
  style={{ height: "auto" }}
/>
            </div>
          </div>

          {/* COURSES */}
          <div className="mt-[10px] md:mt-[40px]">
            <h3 className="text-[16px] md:text-[16px] lg:text-[18px] font-bold text-[#2E2E2E] mb-[12px] md:mb-[16px]">
              Featured Courses
            </h3>

            <ul className="flex flex-col gap-[10px] md:gap-[14px] text-[14px] sm:text-[15px] md:text-[15px] lg:text-[17px] text-[#2E2E2E]">
              <li>Full Stack Web Development</li>
              <li>Testing Automation - CI & CD</li>
              <li>Cloud Computing & DevOps Engineering</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="mt-[10px] md:mt-[40px]">
            <h3 className="text-[16px] md:text-[16px] lg:text-[18px] font-bold text-[#2E2E2E] mb-[12px] md:mb-[16px]">
              Contact
            </h3>

            <div className="flex flex-col gap-[14px] md:gap-[16px] text-[14px] sm:text-[15px] md:text-[15px] lg:text-[17px] text-[#2E2E2E]">

              <div className="flex gap-[10px] md:gap-[12px] items-start">
                <Image
                  src="/loc1.png"
                  alt=""
                  width={16}
                  height={16}
                  className="mt-[3px]"
                />
                <p className="leading-[1.6] max-w-[220px] md:max-w-[240px] lg:max-w-[260px]">
                  No.987, 1st Floor, Raj Chambers,
                  Thadagam Main Road, R.S. Puram,
                  Coimbatore. 641002
                </p>
              </div>

              <div className="flex gap-[10px] md:gap-[12px] items-center">
                <Image src="/phone2.png" alt="" width={16} height={16} />
                <p>+91 91500 48550</p>
              </div>

              <div className="flex gap-[10px] md:gap-[12px] items-center">
                <Image src="/mail.png" alt="" width={16} height={16} />
                <p className="break-all">support@finestcoder.com</p>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
       <div className="mt-[40px] md:mt-[50px] pb-[20px] md:pb-[30px]">
  <div
    className="
      w-full
      bg-[#5A5A5A]
      text-white
      rounded-[20px] md:rounded-full
      px-[16px] sm:px-[20px] md:px-[28px]
      py-[12px]
      flex flex-col md:flex-row
      items-center md:items-center
      justify-between
      gap-[12px]
      text-[12px] sm:text-[13px] md:text-[14px]
    "
  >

 <p className="text-center md:text-left">
  Copyright © 2025 FinestCoder by Codingmart.
  <br />
  All rights reserved.
</p>

    {/* RIGHT FIXED */}
    <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end items-center gap-[10px] whitespace-nowrap">
      <span>Privacy Policy</span>
      <span className="hidden sm:inline">|</span>
      <span>Support</span>
      <span className="hidden sm:inline">|</span>
      <span>Terms & Conditions</span>
    </div>

  </div>
</div>

      </div>
    </footer>
  );
}