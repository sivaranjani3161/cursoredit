'use client';

import { ReactNode, useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

// Match the sidebar's transition duration exactly
const TRANSITION = 'margin-left 200ms ease-in-out';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Track the CSS var value so React can re-render with the right margin
  const [tabletOffset, setTabletOffset] = useState('72px'); // collapsed default

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      const val = root.style.getPropertyValue('--tablet-sidebar-offset').trim();
      if (val) setTabletOffset(val);
    };

    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['style'] });

    // Initial read
    read();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,rgba(0,184,198,0.12),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(0,184,198,0.08),transparent_28%),linear-gradient(180deg,#f8fdfe_0%,#f4fbfd_100%)] text-gray-900">
      <AdminSidebar />

      {/*
        Margin logic:
          lg+   → ml-[264px]       fixed, desktop sidebar (Tailwind class, unchanged)
          md–lg → var(--tablet-sidebar-offset)  dynamic, synced with TabletSidebar expand state
          <md   → mt-14 ml-0       mobile top bar, no left offset
      */}
<main
  className="
    mt-16 mx-2 mb-2
    md:mt-2 md:mr-2
    md:[margin-left:var(--tablet-sidebar-offset)]
    lg:mt-3 lg:ml-[264px] lg:mr-3
    lg:![margin-left:264px]
    min-h-[calc(100vh-24px)]
    overflow-x-hidden
    w-auto
  "
  style={{ transition: TRANSITION }}
>
  <div
    className="
      bg-white
      min-h-[calc(100vh-80px)]
      md:min-h-[calc(100vh-24px)]
      overflow-x-hidden
      w-full
      max-w-full
    "
  >
    {children}
  </div>
</main>
</div>
  );
}