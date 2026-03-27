import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, BookmarkX, Eye } from 'lucide-react';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';
import { useSave } from '../../Services/App/slice/Dispatches/SaveDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function MyBooks() {
  const navigate = useNavigate();
  const { mySaves, loading } = useSelector((state) => state.save);
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const { getFileAndCober, DownloadBook } = useGlobalFunction();
  const { fetchMySaves, deleteSave } = useSave();
  const { showMessage } = useNotif();
  const [removingId, setRemovingId] = useState(null);

  const isAuthenticated = !!user && !!token && !!isAuth;

  // Redirect if not authenticated (optional – route protection may already handle)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(-1);
      showMessage({
        message: 'Please log in to view your library.',
        type: 'info',
      });
    } 
      const fetch = async () => {
        try {
          await fetchMySaves();
        } catch (error) {
          showMessage({
            message: error?.message || 'Failed to load saved books.',
            type: 'error',
          });
        }
      };
      fetch();
    
  }, []);

  const handleRemove = async (saveId, bookTitle) => {
    if (!isAuthenticated) {
      showMessage({ message: 'Please log in to remove books.', type: 'error' });
      return;
    }
    if (!window.confirm(`Remove "${bookTitle}" from your saved books?`)) return;
    setRemovingId(saveId);
    try {
     
      showMessage({
        message: 'Book removed from your library.',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: error?.message || 'Failed to remove book.',
        type: 'error',
      });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading && !mySaves.length && isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#DDD0B8] border-t-[#8B5E3C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-16 h-16 text-[#C9A87C] dark:text-[#6B4423] mb-4" />
        <h3 className="text-xl font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
          Please Log In
        </h3>
        <p className="text-[#A0856A] dark:text-[#8A6A4A] mt-2">
          You need to be logged in to view your saved books.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!mySaves || mySaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-16 h-16 text-[#C9A87C] dark:text-[#6B4423] mb-4" />
        <h3 className="text-xl font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
          Your library is empty
        </h3>
        <p className="text-[#A0856A] dark:text-[#8A6A4A] mt-2">
          Start exploring books and click "Save" to add them here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
        My Library
      </h1>
      <p className="text-[#A0856A] dark:text-[#8A6A4A] mb-8">
        Books you've saved for later
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {mySaves.map((saved) => {
            const book = saved.book;
            if (!book) return null;
            const { coverUrl, fileUrl } = getFileAndCober(book);
            const authors = Array.isArray(book.authors)
              ? book.authors.join(', ')
              : book.authors || 'Anonymous';
            const hasFile = !!fileUrl;

            return (
              <motion.div
                key={saved.id}
                variants={cardVariants}
                exit="exit"
                layout
                className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Cover */}
                <div className="relative h-48 bg-[#EDE4D3] flex-shrink-0 overflow-hidden">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-12 h-12 text-[#C9A87C]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-[#2C1A0E] dark:text-[#F0E6D3] line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#A0856A] mb-2">{authors}</p>

                  {book.download_count > 0 && (
                    <p className="text-xs text-[#8B5E3C] flex items-center gap-1 mb-3">
                      <Download size={12} /> {book.download_count} downloads
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/books/${book.id}/show`)}
                      className="flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg bg-[#EDE4D3] text-[#2C1A0E] hover:bg-[#E0D5C0] transition"
                    >
                      <Eye size={14} /> Details
                    </button>
                    <button
                      onClick={() => navigate(`/books/${book.id}/read`)}
                      disabled={!isAuthenticated}
                      className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition ${
                        hasFile && isAuthenticated
                          ? 'bg-[#2C1A0E] text-white hover:bg-black'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <BookOpen size={14} /> Read
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          showMessage({
                            message: 'Please log in to download.',
                            type: 'error',
                          });
                          return;
                        }
                        if (hasFile) {
                          DownloadBook(
                            book.id,
                            `${book.title}.${book.files?.file_format || 'txt'}`
                          );
                        } else {
                          showMessage({
                            message: 'No file available for download.',
                            type: 'error',
                          });
                        }
                      }}
                      disabled={!isAuthenticated}
                      className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition ${
                        hasFile && isAuthenticated
                          ? 'bg-[#8B5E3C] text-white hover:bg-[#6F4A2E]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Download size={14} /> Get
                    </button>
                    <button
                      onClick={() => handleRemove(saved.id, book.title)}
                      disabled={removingId === saved.id || !isAuthenticated}
                      className="flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {removingId === saved.id ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <BookmarkX size={14} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
