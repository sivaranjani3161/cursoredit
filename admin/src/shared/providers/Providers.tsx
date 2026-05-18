'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ErrorProvider } from '@/shared/context/ErrorContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ErrorProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '13px',
            },
          }}
        />
      </ErrorProvider>
    </SessionProvider>
  );
}
