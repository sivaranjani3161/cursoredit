'use client';

import { signIn } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_15%,rgba(0,184,198,0.24),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,184,198,0.2),transparent_30%),#f7fdff] px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-[24px] sm:rounded-[32px] border border-cyan-100 shadow-[0_30px_80px_rgba(0,184,198,0.18)] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#00B8C6] via-cyan-400 to-teal-400" />

        <div className="p-6 sm:p-8 md:p-10">
          <div className="text-center">
            {/* Logo mark */}
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-50 border border-cyan-100">
              <span className="text-[#00B8C6] font-bold text-base sm:text-lg">F</span>
            </div>

            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
              Finest Coder Admin
            </h1>
            
          </div>

          {/* Google sign-in */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2.5 sm:gap-3 bg-[#00B8C6] hover:bg-[#009eaa] active:bg-[#009eaa] text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base"
          >
            {/* Google icon */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full p-0.5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" />
            </svg>
            Continue with Google
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}