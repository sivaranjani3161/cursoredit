"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import data from "@/app/data/contact.json";
import type { ContactFormData } from "@/app/types/contact";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface Course { id: number; title: string; }

export default function ContactPage() {
  const { hero, contactInfo } = data;

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<ContactFormData>({
    name: "", email: "", phone: "", courseId: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch active courses for the dropdown
  useEffect(() => {
    fetch(`${BACKEND}/api/courses/active`, { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then((d: Course[]) => setCourses(d))
      .catch(() => setCourses([]));
  }, []);

  const validate = (): boolean => {
    const err: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.name || !/^[A-Za-z\s]+$/.test(form.name)) err.name = "Only letters allowed";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email format";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) err.phone = "Enter 10 digit number";
    if (!form.courseId) err.courseId = "Please select a course";
    if (!form.message || form.message.length < 4) err.message = "Minimum 4 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { setPopup("error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          courseId: Number(form.courseId),
          message: form.message.trim(),
        }),
      });
      if (res.ok) {
        setPopup("success");
        setForm({ name: "", email: "", phone: "", courseId: "", message: "" });
        setErrors({});
      } else {
        setPopup("error");
      }
    } catch {
      setPopup("error");
    } finally {
      setSubmitting(false);
    }
  };

  const isValidField = (key: keyof ContactFormData, value: string) => {
    if (!value) return false;
    switch (key) {
      case "name":     return /^[A-Za-z\s]+$/.test(value);
      case "email":    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "phone":    return /^\d{10}$/.test(value);
      case "message":  return value.length >= 4;
      case "courseId": return !!value;
      default:         return false;
    }
  };

  const fields: { key: keyof ContactFormData; placeholder: string; type: string }[] = [
    { key: "name",  placeholder: "Full Name*",      type: "text"  },
    { key: "email", placeholder: "Email Address*",  type: "email" },
    { key: "phone", placeholder: "Phone Number*",   type: "tel"   },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,184,198,0.5); }
          50%      { box-shadow: 0 0 0 6px rgba(0,184,198,0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-zoom img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) !important; }
        .hero-zoom:hover img { transform: scale(1.04) !important; }
        @media (max-width: 1023px) {
          .contact-card-animate  { animation: slideInLeft  0.6s ease both 0.10s; }
          .contact-form-animate  { animation: slideInRight 0.6s ease both 0.25s; }
          .hero-section-animate  { animation: fadeUp       0.55s ease both; }
          .map-animate           { animation: fadeUp       0.6s  ease both 0.35s; }
          .teal-dot              { animation: dotPulse     2s ease-in-out infinite; }
          .mobile-input:focus    { transform: translateY(-1px); transition: transform 0.2s ease, box-shadow 0.2s ease; }
          .submit-btn:active     { transform: scale(0.96); transition: transform 0.1s ease; }
          .social-icon:hover     { transform: scale(1.18); transition: transform 0.2s ease; }
        }
      `}</style>

      {/* ── PAGE WRAPPER ── */}
      <section className="w-full bg-[#FDFDFD] pt-10 md:pt-[60px] pb-0">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-8">

          {/* HERO IMAGE */}
          <div className="hero-zoom hero-section-animate relative w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[358px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,184,198,0.25)]">
            <Image src={hero.image} alt="hero" fill sizes="100vw" className="object-cover" />
          </div>

          {/* CONTENT GRID */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-[60px] items-start">

            {/* LEFT: INFO CARD */}
            <div className="
              contact-card-animate
              relative w-full min-h-[460px]
              bg-[#5A5A5A] text-white rounded-xl
              px-10 py-11 flex flex-col gap-8 overflow-hidden
              shadow-[0_20px_50px_rgba(0,0,0,0.30)]
              max-lg:min-h-0 max-lg:flex-row max-lg:items-start max-lg:gap-10
              max-md:flex-col max-md:gap-5 max-md:px-6 max-md:py-7
            ">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[260px] h-[260px] bg-white/10 rounded-full bottom-[-70px] right-[-50px]" />
                <div className="absolute w-[160px] h-[160px] bg-white/5  rounded-full bottom-[30px]  right-[90px]" />
              </div>
              <div className="relative z-10 flex flex-col gap-8 flex-1 max-md:gap-5">
                <h2 className="text-[28px] md:text-[32px] max-md:text-[22px] leading-[130%] font-medium">
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
              <div className="relative z-10 flex gap-[10px] pt-2 mt-auto max-lg:self-end max-lg:mt-0">
                {(contactInfo.socials as { icon: string; link: string }[]).map((s, i) => (
                  <a key={i} href={s.link}
                    className="social-icon w-[34px] h-[34px] flex items-center justify-center rounded-full border border-white/40 hover:bg-white/20 transition"
                  >
                    <Image src={s.icon} alt="" width={15} height={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="contact-form-animate w-full pt-0 lg:pt-[6px]">
              <div className="flex flex-col gap-[14px] max-md:gap-[10px]">

                {/* Text fields: name, email, phone */}
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
                          if (field.key === "name"  && !/^[A-Za-z\s]+$/.test(value))            error = "Only letters allowed";
                          if (field.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email";
                          if (field.key === "phone" && !/^\d{10}$/.test(value))                   error = "Enter 10 digits";
                        }
                        setErrors((prev) => ({ ...prev, [field.key]: error }));
                      }}
                      className={`
                        mobile-input
                        w-full rounded-[10px] px-4 py-[11px] text-sm outline-none transition bg-white border
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

                {/* COURSE DROPDOWN */}
                <div>
                  <div className="relative">
                    <select
                      value={form.courseId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, courseId: value });
                        setErrors((prev) => ({ ...prev, courseId: value ? "" : "Required" }));
                      }}
                      className={`
                        mobile-input
                        w-full rounded-[10px] px-4 py-[11px] pr-10 text-sm bg-white outline-none
                        appearance-none cursor-pointer border
                        ${errors.courseId
                          ? "border-red-500 focus:ring-2 focus:ring-red-400"
                          : form.courseId
                          ? "border-green-500 focus:ring-2 focus:ring-green-400"
                          : "border-[#CFCFCF] focus:ring-2 focus:ring-[#00B8C6]"
                        }
                        ${!form.courseId ? "text-[#9CA3AF]" : "text-[#111]"}
                      `}
                    >
                      <option value="" disabled>Course*</option>
                      {courses.length > 0
                        ? courses.map((c) => (
                            <option key={c.id} value={String(c.id)}>{c.title}</option>
                          ))
                        : <option disabled>Loading courses...</option>
                      }
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  {errors.courseId && (
                    <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.courseId}</p>
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
                      w-full rounded-[10px] px-4 py-[11px] text-sm h-[140px] resize-none outline-none bg-white border
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

                {/* SUBMIT */}
                <div className="pt-[6px]">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="submit-btn bg-[#00B8C6] text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition w-full lg:w-auto disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Submit Message"}
                  </button>
                </div>

              </div>
            </div>

          </div>{/* /grid */}
        </div>{/* /container */}

        {/* MAP */}
        <div className="w-full mt-[50px] relative z-10 mb-10 md:mb-[-50px] map-animate">
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

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className="bg-white rounded-xl p-6 text-center w-[90%] max-w-[280px] relative shadow-xl"
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
              {popup === "success" ? "Enquiry Submitted!" : "Submission Error"}
            </h3>
            <p className="text-xs mt-2 text-[#555]">
              {popup === "success"
                ? "We'll get back to you shortly."
                : "Please check your inputs and try again."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}