import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  Download,
  Info,
  Bookmark,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';

export default function MapBooks({ booksData }) {
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const isAuthenticated = !!user && !!token && isAuth;
  const { getFileAndCober, addToMyBooks, DownloadBook } = useGlobalFunction(); // assume addToMyBooks exists

  // Normalize booksData: if it's an array, use it; if it has a 'data' property, use that; otherwise empty array.
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

  const getCoverUrl = (book) => {
    const { coverUrl } = getFileAndCober(book);
    return coverUrl;
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
            className="group min-w-[240px] max-w-[240px] flex flex-col rounded-2xl bg-white dark:bg-[#1A110A] border border-[#DDD0B8]/50 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(139,94,60,0.3)] transition-all duration-500 snap-start overflow-hidden"
          >
            {/* Cover Area */}
            <div className="relative h-72 overflow-hidden bg-[#F3EFE7]">
              <img
                src={getCoverUrl(book)}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {book.page_count && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20">
                  {book.page_count} PAGES
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1A110A] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            </div>

            {/* Details Area */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-base leading-tight line-clamp-2 text-[#2C1A0E] dark:text-[#F0E6D3] mb-1 group-hover:text-[#8B5E3C] transition-colors">
                {book.title}
              </h3>

              <p className="text-xs font-medium text-[#A0856A] mb-4">
                {book.authors?.join(', ') || 'Anonymous'}
              </p>

              {/* Action Buttons */}
              <div className="mt-auto space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-[#F3EFE7] text-[#5C3D2E] hover:bg-[#8B5E3C] hover:text-white transition-all">
                  <Info size={14} /> Details
                </button>

                <div className="flex gap-2">
                  {/* Read Button */}
                  <button
                    disabled={!isAuthenticated}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-xl transition-all ${
                      isAuthenticated
                        ? 'bg-[#2C1A0E] text-[#F0E6D3] hover:bg-black shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen size={14} /> Read
                  </button>

                  {/* Download Button */}
                  <button
                    disabled={!isAuthenticated}
                    onClick={() =>
                      DownloadBook(
                        book.id,
                        `${book.title}.${book.files?.file_format || 'txt'}`
                      )
                    }
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-xl transition-all ${
                      isAuthenticated
                        ? 'bg-[#8B5E3C] text-white hover:bg-[#6F4B30] shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Download size={14} /> Get
                  </button>

                  {/* Add to My Books Button */}
                  <button
                    onClick={() => addToMyBooks(book.id)}
                    disabled={!isAuthenticated}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-xl transition-all ${
                      isAuthenticated
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Bookmark size={14} /> Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
