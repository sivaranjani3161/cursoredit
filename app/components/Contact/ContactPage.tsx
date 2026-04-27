"use client";

import Image from "next/image";
import { useState } from "react";
import data from "@/app/data/contact.json";
import type { ContactFormData } from "@/app/types/contact";

export default function ContactPage() {
  const { hero, contactInfo } = data;

  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [popup, setPopup] = useState<"success" | "error" | null>(null);

  const validate = (): boolean => {
    const err: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.name || !/^[A-Za-z\s]+$/.test(form.name)) err.name = "Only letters allowed";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email format";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) err.phone = "Enter 10 digit number";
    if (!form.subject) err.subject = "Select a subject";
    if (!form.message || form.message.length < 4) err.message = "Minimum 4 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setPopup("error"); return; }
    setPopup("success");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const isValidField = (key: keyof ContactFormData, value: string) => {
    if (!value) return false;
    switch (key) {
      case "name": return /^[A-Za-z\s]+$/.test(value);
      case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "phone": return /^\d{10}$/.test(value);
      case "message": return value.length >= 4;
      case "subject": return !!value;
      default: return false;
    }
  };

  const fields: { key: keyof ContactFormData; placeholder: string; type: string }[] = [
    { key: "name", placeholder: "Full Name*", type: "text" },
    { key: "email", placeholder: "Email Address*", type: "email" },
    { key: "phone", placeholder: "Phone Number*", type: "tel" },
  ];

  return (
    <>
      {/* ── ANIMATIONS (injected once, CSS-only, zero JS overhead) ── */}
      <style>{`
        /* Fade-up for section entry */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Subtle pulse ring on the teal dots */
        @keyframes dotPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,184,198,0.5); }
          50%      { box-shadow: 0 0 0 6px rgba(0,184,198,0); }
        }
        /* Shimmer sweep on the card (mobile only) */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        /* Slide-in from left for card (mobile) */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Slide-in from right for form (mobile) */
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Hero zoom on hover — desktop only */
        .hero-zoom img {
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) !important;
        }
        .hero-zoom:hover img {
          transform: scale(1.04) !important;
        }

        /* ── MOBILE / TABLET ANIMATIONS ── */
        @media (max-width: 1023px) {
          .contact-card-animate {
            animation: slideInLeft 0.6s ease both;
            animation-delay: 0.1s;
          }
          .contact-form-animate {
            animation: slideInRight 0.6s ease both;
            animation-delay: 0.25s;
          }
          .hero-section-animate {
            animation: fadeUp 0.55s ease both;
          }
          .map-animate {
            animation: fadeUp 0.6s ease both;
            animation-delay: 0.35s;
          }
          /* Teal dot pulse on mobile */
          .teal-dot {
            animation: dotPulse 2s ease-in-out infinite;
          }
          /* Input focus lift on mobile */
          .mobile-input:focus {
            transform: translateY(-1px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          /* Button tap bounce */
          .submit-btn:active {
            transform: scale(0.96);
            transition: transform 0.1s ease;
          }
          /* Social icon hover pop */
          .social-icon:hover {
            transform: scale(1.18);
            transition: transform 0.2s ease;
          }
        }

        /* Tab (md 768-1023) — stack card above form, full width each */
        @media (min-width: 768px) and (max-width: 1023px) {
          .contact-grid-tab {
            display: flex !important;
            flex-direction: column !important;
            gap: 32px !important;
          }
          .contact-card-tab {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 280px !important;
            /* Horizontal layout on tablet */
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 40px !important;
            padding: 36px 40px !important;
          }
          .card-info-tab {
            flex: 1;
          }
          .card-socials-tab {
            margin-top: 0 !important;
            align-self: flex-end !important;
          }
          .contact-form-tab {
            width: 100% !important;
          }
        }

        /* Mobile (<768px) — card becomes compact info strip */
        @media (max-width: 767px) {
          .contact-grid-mobile {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .contact-card-mobile {
            width: 100% !important;
            min-height: unset !important;
            padding: 28px 24px !important;
            gap: 20px !important;
          }
          .contact-card-mobile h2 {
            font-size: 22px !important;
            line-height: 130% !important;
          }
          .contact-form-mobile {
            width: 100% !important;
          }
          /* Tighter spacing for mobile inputs */
          .mobile-field-gap {
            gap: 10px !important;
          }
        }
      `}</style>

      <section className="w-full bg-[#FDFDFD] pt-[40px] md:pt-[60px] pb-0">

        <div className="max-w-[1180px] mx-auto px-6 lg:px-8">

          <div className="
            hero-zoom hero-section-animate
            relative w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[358px]
            rounded-[12px] overflow-hidden
          ">
            <Image src={hero.image} alt="hero" fill sizes="100vw" className="object-cover" />
          </div>

          <div className="
            mt-[40px]
            grid grid-cols-1 lg:grid-cols-2 gap-[40px] xl:gap-[60px] items-start
            contact-grid-tab contact-grid-mobile
          ">

            <div className="
              contact-card-animate contact-card-tab contact-card-mobile
              relative w-full
              min-h-[460px]
              bg-[#5A5A5A] text-white rounded-[12px]
              px-[40px] py-[44px]
              flex flex-col gap-[32px]
              overflow-hidden
              shadow-[0_20px_50px_rgba(0,0,0,0.30)]
            ">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[260px] h-[260px] bg-white/10 rounded-full bottom-[-70px] right-[-50px]" />
                <div className="absolute w-[160px] h-[160px] bg-white/5 rounded-full bottom-[30px] right-[90px]" />
              </div>

              <div className="card-info-tab relative z-10 flex flex-col gap-[32px]">
                <h2 className="text-[28px] md:text-[32px] leading-[130%] font-medium">
                  Feel Free To <span className="font-bold">Contact</span>
                  <br />And <span className="font-bold">Reach Us !</span>
                </h2>

                <div className="space-y-[22px] text-[14px] md:text-[15px] text-white/80">
                  <div className="flex items-start gap-3">
                    <span className="teal-dot mt-[5px] w-[10px] h-[10px] bg-[#00B8C6] rounded-full shrink-0" />
                    <p>{contactInfo.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="teal-dot w-[10px] h-[10px] bg-[#00B8C6] rounded-full shrink-0" />
                    <p>{contactInfo.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="teal-dot w-[10px] h-[10px] bg-[#00B8C6] rounded-full shrink-0" />
                    <p>{contactInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="card-socials-tab relative z-10 flex gap-[10px] pt-2 mt-auto">
                {(contactInfo.socials as { icon: string; link: string }[]).map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    className="social-icon w-[34px] h-[34px] flex items-center justify-center rounded-full border border-white/40 hover:bg-white/20 transition"
                  >
                    <Image src={s.icon} alt="" width={15} height={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: form */}
            <div className="contact-form-animate contact-form-tab contact-form-mobile w-full pt-0 lg:pt-[6px]">
              <div className="space-y-[14px] mobile-field-gap">

                {fields.map((field) => (
                  <div key={field.key}>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, [field.key]: value });
                        let error = "";
                        if (!value) { error = "Required"; }
                        else {
                          if (field.key === "name" && !/^[A-Za-z\s]+$/.test(value)) error = "Only letters allowed";
                          if (field.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email";
                          if (field.key === "phone" && !/^\d{10}$/.test(value)) error = "Enter 10 digits";
                        }
                        setErrors((prev) => ({ ...prev, [field.key]: error }));
                      }}
                      className={`
                        mobile-input
                        w-full border rounded-[10px] px-4 py-[11px] text-[14px] outline-none transition bg-white
                        ${errors[field.key]
                          ? "border-red-500 focus:ring-2 focus:ring-red-400"
                          : isValidField(field.key, form[field.key])
                          ? "border-green-500 focus:ring-2 focus:ring-green-400"
                          : "border-[#CFCFCF] focus:ring-2 focus:ring-[#00B8C6]"
                        }
                      `}
                    />
                    {errors[field.key] && (
                      <p className="text-red-500 text-[11px] mt-1 ml-2">{errors[field.key]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <div className="relative">
                    <select
                      value={form.subject}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, subject: value });
                        setErrors((prev) => ({ ...prev, subject: value ? "" : "Required" }));
                      }}
                      className={`
                        mobile-input
                        w-full border rounded-[10px] px-4 py-[11px] pr-10 text-[14px] bg-white outline-none
                        appearance-none cursor-pointer
                        ${errors.subject
                          ? "border-red-500 focus:ring-2 focus:ring-red-400"
                          : form.subject
                          ? "border-green-500 focus:ring-2 focus:ring-green-400"
                          : "border-[#CFCFCF] focus:ring-2 focus:ring-[#00B8C6]"
                        }
                        ${!form.subject ? "text-[#9CA3AF]" : "text-[#111]"}
                      `}
                    >
                      <option value="" disabled>Subject*</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Course">Course</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  {errors.subject && (
                    <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.subject}</p>
                  )}
                </div>

                {/* TEXTAREA */}
                <div>
                  <textarea
                    placeholder="Message*"
                    value={form.message}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, message: value });
                      setErrors((prev) => ({
                        ...prev,
                        message: value.length >= 4 ? "" : value ? "Minimum 4 characters" : "Required",
                      }));
                    }}
                    className={`
                      mobile-input
                      w-full border rounded-[10px] px-4 py-[11px] text-[14px] h-[140px] resize-none outline-none bg-white
                      ${errors.message
                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                        : isValidField("message", form.message)
                        ? "border-green-500 focus:ring-2 focus:ring-green-400"
                        : "border-[#CFCFCF] focus:ring-2 focus:ring-[#00B8C6]"
                      }
                    `}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.message}</p>
                  )}
                </div>

                <div className="pt-[6px]">
                  <button
                    onClick={handleSubmit}
                    className="submit-btn bg-[#00B8C6] text-white px-8 py-[12px] rounded-full text-[14px] font-medium hover:opacity-90 transition w-full lg:w-auto"
                  >
                    Submit Message
                  </button>
                </div>

              </div>
            </div>

          </div>{/* /grid */}
        </div>{/* /container */}

<div className="w-full mt-[50px] relative z-10 mb-[40px] md:mb-[-50px]">        
    <div className="max-w-[1180px] mx-auto px-6 lg:px-8">
            <div className="w-full h-[220px] sm:h-[260px] md:h-[330px] lg:h-[300px] rounded-[14px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.448904904782!2d76.9458066!3d11.0049071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6fc7c10d73613283%3A0x6ace2fa2c7965662!2sFinest%20Coder!5e0!3m2!1sen!2sin!4v1776966689940!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

      </section>

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className="bg-white rounded-[12px] p-6 text-center w-[90%] max-w-[280px] relative shadow-xl"
            style={{ animation: "fadeUp 0.3s ease both" }}
          >
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-lg"
              onClick={() => setPopup(null)}
            >✕</button>
            <Image
              src={popup === "success" ? "/success.png" : "/error.png"}
              alt=""
              width={80}
              height={80}
              className="mx-auto mb-3"
            />
            <h3 className="text-base font-semibold">
              {popup === "success" ? "Form Submitted" : "Submission Error"}
            </h3>
            <p className="text-xs mt-2 text-[#555]">
              {popup === "success" ? "We'll get back to you shortly." : "Please check your inputs."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}