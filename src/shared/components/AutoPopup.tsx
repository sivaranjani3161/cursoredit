"use client";

import { useEffect, useState } from "react";
import EnquiryModal from "@/shared/components/EnquiryModal";

const STORAGE_KEY = "finestapp_popup_shown_date";
const DELAY_MS    = 30_000; // 30 seconds

export default function AutoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already shown today
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === today) return; // already shown today — do nothing
    } catch (_) { /* localStorage unavailable (SSR guard) */ return; }

    // Schedule popup after 30 s
    const timer = setTimeout(() => {
      try {
        const today2 = new Date().toISOString().slice(0, 10);
        const stored  = localStorage.getItem(STORAGE_KEY);
        if (stored === today2) return; // double-check (tab might have been re-focused)
      } catch (_) {}
      setShow(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEY, today);
    } catch (_) {}
  };

  return (
    <EnquiryModal
      isOpen={show}
      onClose={handleClose}
    />
  );
}
