import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CheckAuthPage() {
  const { isAuth, user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authenticated
    if (!isAuth || !token) {
      navigate('/login', { replace: true });
      return;
    }

    // Route based on user role
    if (user?.role) {
      const role = user.role.toLowerCase();

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'user') {
        navigate('/user/home', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuth, user, token, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] flex items-center justify-center overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C9A87C]/10 dark:bg-[#C9A87C]/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#DDD0B8]/5 dark:bg-[#4A3520]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo / Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5E3C] to-[#C9A87C] rounded-2xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EDE4D3] to-[#DDD0B8] dark:from-[#2C1F10] dark:to-[#1A1208] border border-[#C9A87C] dark:border-[#4A3520] flex items-center justify-center shadow-2xl">
            <svg
              className="w-10 h-10 text-[#8B5E3C] dark:text-[#C9A87C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2.5"
              strokeDasharray="31.4 94.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5E3C" />
                <stop offset="100%" stopColor="#C9A87C" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#8B5E3C]/10 to-[#C9A87C]/10 dark:from-[#C9A87C]/5 dark:to-[#8B5E3C]/5" />
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5E3C] to-[#C9A87C] dark:from-[#C9A87C] dark:to-[#DDD0B8] bg-clip-text text-transparent">
            Verifying Access
          </h1>

          <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] font-medium tracking-wide">
            Authenticating your credentials...
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <div
              className="w-2 h-2 rounded-full bg-[#8B5E3C] dark:bg-[#C9A87C] animate-bounce"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-[#C9A87C] dark:bg-[#DDD0B8] animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-[#DDD0B8] dark:bg-[#A0856A] animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 flex gap-2">
          <div className="h-1 w-8 bg-gradient-to-r from-[#8B5E3C] to-transparent rounded-full" />
          <div className="h-1 w-12 bg-gradient-to-r from-[#C9A87C] to-transparent rounded-full opacity-50" />
        </div>
      </div>

      {/* Security badge */}
      <div className="absolute bottom-8 left-8 right-8 max-w-xs mx-auto">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/40 dark:bg-[#1A1208]/40 border border-[#C9A87C]/20 dark:border-[#4A3520]/40 backdrop-blur-sm">
          <svg
            className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 0 01-1.414 1.414L11 6.414V15a1 1 0 11-2 0V6.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium text-[#8B5E3C] dark:text-[#C9A87C]">
            Secure connection verified
          </span>
        </div>
      </div>
    </div>
  );
}
