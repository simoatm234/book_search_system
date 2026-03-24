import { Loader2 } from 'lucide-react';
import React from 'react'

export default function SmullLoading({content}) {
  return (
    <div>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F4F0E6]/60 dark:bg-[#1A1208]/60 backdrop-blur-sm rounded-2xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-[#8B5E3C] dark:text-[#C9A87C] animate-spin" />
          <p className="text-[#2C1A0E] dark:text-[#F0E6D3] font-medium">
            Loading {content}...
          </p>
        </div>
      </div>
    </div>
  );
}
