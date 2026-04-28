"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { ContactFormData } from "@/app/types/contact";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [popup, setPopup] = useState<"success" | "error" | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    if (!validate()) {
      setPopup("error");
      return;
    }
    setPopup("success");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation
    setTimeout(() => {
      setPopup(null);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    }, 300);
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

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .enquiry-overlay {
          animation: modalFadeIn 0.25s ease both;
        }
        .enquiry-modal {
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
      `}</style>

      {/* OVERLAY */}
      <div
        className="enquiry-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        {/* MODAL BOX */}
        <div className="enquiry-modal relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

          {/* HEADER */}
          <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <h2 className="text-[22px] font-semibold text-[#1A1A1A] text-center">
              Make an <span className="text-[#00B8C6]">enquiry</span>
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Fill in the form and we'll get back to you.
            </p>
          </div>

          {/* FORM BODY */}
          <div className="px-6 py-5 flex flex-col gap-[12px]">

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
                      if (field.key === "name"  && !/^[A-Za-z\s]+$/.test(value))             error = "Only letters allowed";
                      if (field.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email";
                      if (field.key === "phone" && !/^\d{10}$/.test(value))                   error = "Enter 10 digits";
                    }
                    setErrors((prev) => ({ ...prev, [field.key]: error }));
                  }}
                  className={`
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

            {/* SUBJECT SELECT */}
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
                    w-full rounded-[10px] px-4 py-[11px] pr-10 text-sm bg-white outline-none
                    appearance-none cursor-pointer border
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
                    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                  w-full rounded-[10px] px-4 py-[11px] text-sm h-[120px] resize-none outline-none bg-white border
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
            <button
              onClick={handleSubmit}
              className="w-full bg-[#00B8C6] text-white py-[12px] rounded-full text-sm font-medium hover:opacity-90 active:scale-[0.98] transition mt-1"
            >
              Submit
            </button>

          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR POPUP (on top of modal) */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[110]">
          <div
            className="bg-white rounded-xl p-6 text-center w-[90%] max-w-[280px] relative shadow-xl"
            style={{ animation: "fadeUp 0.3s ease both" }}
          >
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-lg"
              onClick={() => {
                setPopup(null);
                if (popup === "success") handleClose();
              }}
            >
              ✕
            </button>
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
            <button
              onClick={() => {
                setPopup(null);
                if (popup === "success") handleClose();
              }}
              className="mt-4 bg-[#00B8C6] text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              {popup === "success" ? "Done" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}