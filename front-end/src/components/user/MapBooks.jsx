import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Card from './Card';

export default function MapBooks({ booksData }) {
  const books = Array.isArray(booksData) ? booksData : booksData?.data || [];
  const isLoading =
    !booksData || (booksData && !booksData.data && !Array.isArray(booksData));

  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { y: -10, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-[#8B5E3C]" size={40} />
        <p className="text-[#8B5E3C] font-medium animate-pulse">
          Curating your library...
        </p>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="text-center py-20 bg-[#FDFBF7] rounded-3xl border-2 border-dashed border-[#DDD0B8]">
        <p className="text-[#A0856A] font-medium">
          No books found in this collection.
        </p>
      </div>
    );
  }

  return (
    <div className="relative group/container">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            Featured Reads
          </h2>
          <div className="h-1 w-12 bg-[#8B5E3C] mt-1 rounded-full" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white dark:bg-[#2C1A0E] border border-[#DDD0B8] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white dark:bg-[#2C1A0E] border border-[#DDD0B8] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Book List */}
      <motion.div
        ref={scrollContainer}
        className="flex gap-8 overflow-x-auto pb-12 pt-2 px-2 scrollbar-hide snap-x snap-mandatory"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            variants={cardVariants}
            whileHover="hover"
            className="min-w-[240px] max-w-[240px] snap-start"
          >
            <Card book={book} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
