import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function LoadingUser() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-white/80 dark:bg-[#0F0A05]/90 backdrop-blur-md transition-colors"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="p-5 rounded-2xl 
            bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] 
            shadow-lg dark:shadow-[0_0_25px_rgba(201,168,124,0.25)]"
        >
          <BookOpen className="w-10 h-10 text-white" />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-lg font-medium 
            text-[#2C1A0E] dark:text-[#F5E9D8] tracking-wide"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your books...
        </motion.p>

        {/* Progress Bar */}
        <div
          className="w-52 h-2 rounded-full overflow-hidden
          bg-[#EDE4D3] dark:bg-[#2A1B10]"
        >
          <motion.div
            className="h-full bg-gradient-to-r 
              from-[#8B5E3C] to-[#C9A87C]"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
