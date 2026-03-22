import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {/* Main Spinner */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute w-20 h-20 border-4 border-[#8B5E3C]/20 dark:border-[#C9A87C]/20 border-t-4 border-t-[#8B5E3C] dark:border-t-[#C9A87C] rounded-full animate-spin"></div>

          {/* Inner circle */}
          <div className="absolute w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] rounded-full animate-pulse shadow-lg"></div>
        </div>

        {/* Loading Text with Three Dots */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] flex items-center justify-center">
            Loading
            <span className="inline-flex ml-1">
              <span className="animate-[bounce_1s_infinite]">.</span>
              <span className="animate-[bounce_1s_infinite_0.2s]">.</span>
              <span className="animate-[bounce_1s_infinite_0.4s]">.</span>
            </span>
          </h2>
          <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    </div>
  );
}
