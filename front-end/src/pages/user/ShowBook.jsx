import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Download,
  Bookmark,
  User,
  Languages,
  Tag,
  Archive,
  Eye,
  ChevronLeft,
  Loader2,
  Info,
  FileText,
  Calendar,
  BookmarkCheck,
} from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function ShowBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { book, loading } = useSelector((state) => state.books);
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const { showMessage } = useNotif();
  const { addToMyBooks, DownloadBook, getFileAndCober, getBookInfo } =
    useGlobalFunction();

  const [activeTab, setActiveTab] = useState('summary');
  const [isAdded, setIsAdded] = useState(false);

  const isAuthenticated = !!user && !!token && isAuth;

  useEffect(() => {
    getBookInfo(bookId);
  }, []);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      showMessage({
        message: 'Please log in to download books.',
        type: 'error',
      });
      return;
    }
    const { fileUrl } = getFileAndCober(book);
    if (!fileUrl) {
      showMessage({
        message: 'No file available for download.',
        type: 'error',
      });
      return;
    }
    await DownloadBook(
      book.id,
      `${book.title}.${book.files?.file_format || 'txt'}`
    );
  };

  const handleAddToMyBooks = async () => {
    if (!isAuthenticated) {
      showMessage({
        message: 'Please log in to save books.',
        type: 'error',
      });
      return;
    }
    try {
      await addToMyBooks(book.id);
      setIsAdded(true);
      showMessage({
        message: 'Book added to your library!',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: error?.message || 'Failed to add book.',
        type: 'error',
      });
    }
  };

  const handleRead = () => {
    if (!isAuthenticated) {
      showMessage({
        message: 'Please log in to read books.',
        type: 'error',
      });
      return;
    }
    navigate(`/user/books/${book.id}/read`);
  };

  if (loading && !book) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#8B5E3C]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] flex items-center justify-center">
        <div className="text-center text-[#A0856A]">Book not found.</div>
      </div>
    );
  }

  const { coverUrl, fileUrl } = getFileAndCober(book);
  const hasFile = !!fileUrl;
  const authors = Array.isArray(book.authors) ? book.authors : [book.authors];
  const translators = Array.isArray(book.translators)
    ? book.translators
    : [book.translators];
  const subjects = Array.isArray(book.subjects)
    ? book.subjects
    : [book.subjects];
  const languages = Array.isArray(book.languages)
    ? book.languages
    : [book.languages];
  const bookshelves = Array.isArray(book.bookshelves)
    ? book.bookshelves
    : [book.bookshelves];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300"
    >
      {/* Back button */}
      <motion.button
        variants={itemVariants}
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#231608]/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition"
      >
        <ChevronLeft size={18} />
        <span className="text-sm">Back</span>
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <motion.div
            variants={imageVariants}
            className="lg:col-span-1 flex justify-center"
          >
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-[#EDE4D3]">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#A0856A]" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Title & basic info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-3">
              {book.title}
            </h1>
            <p className="text-lg text-[#8B5E3C] dark:text-[#C9A87C] mb-4">
              by {authors.join(', ') || 'Unknown'}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full text-xs text-[#8B5E3C]"
                >
                  {lang.toUpperCase()}
                </span>
              ))}
              <span className="px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full text-xs text-[#8B5E3C]">
                📥 {book.download_count || 0} downloads
              </span>
              <span className="px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full text-xs text-[#8B5E3C]">
                👁️ {book.reading_count || 0} reads
              </span>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRead}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isAuthenticated
                    ? 'bg-[#2C1A0E] text-white hover:bg-black shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <BookOpen size={18} /> Read
              </button>
              <button
                onClick={handleDownload}
                disabled={!isAuthenticated || !hasFile}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isAuthenticated && hasFile
                    ? 'bg-[#8B5E3C] text-white hover:bg-[#6F4A2E] shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download size={18} /> Download
              </button>
              <button
                onClick={handleAddToMyBooks}
                disabled={!isAuthenticated || isAdded}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isAuthenticated && !isAdded
                    ? 'bg-[#EDE4D3] text-[#2C1A0E] hover:bg-[#E0D5C0] shadow-sm'
                    : isAdded
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAdded ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {isAdded ? 'Added' : 'Add to My Books'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex border-b border-[#DDD0B8] dark:border-[#4A3520]">
            {['summary', 'details', 'formats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-[#8B5E3C] border-b-2 border-[#8B5E3C]'
                    : 'text-[#A0856A] hover:text-[#8B5E3C]'
                }`}
              >
                {tab === 'summary' && (
                  <Info size={16} className="inline mr-1" />
                )}
                {tab === 'details' && (
                  <Archive size={16} className="inline mr-1" />
                )}
                {tab === 'formats' && (
                  <FileText size={16} className="inline mr-1" />
                )}
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] mb-3">
                Summary
              </h2>
              <p className="text-[#2C1A0E] dark:text-[#F0E6D3] leading-relaxed whitespace-pre-line">
                {book.summaries || 'No summary available.'}
              </p>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={18} className="text-[#8B5E3C]" />
                    <h3 className="font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                      Author(s)
                    </h3>
                  </div>
                  <p className="text-[#A0856A] mb-4">
                    {authors.join(', ') || 'Unknown'}
                  </p>

                  {translators.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Languages size={18} className="text-[#8B5E3C]" />
                        <h3 className="font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                          Translator(s)
                        </h3>
                      </div>
                      <p className="text-[#A0856A] mb-4">
                        {translators.join(', ')}
                      </p>
                    </>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-[#8B5E3C]" />
                    <h3 className="font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                      Subjects
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full text-xs text-[#8B5E3C]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Archive size={18} className="text-[#8B5E3C]" />
                    <h3 className="font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                      Bookshelves
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookshelves.map((shelf) => (
                      <span
                        key={shelf}
                        className="px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full text-xs text-[#8B5E3C]"
                      >
                        {shelf}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-[#8B5E3C]" />
                    <h3 className="font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                      Published (Gutendex ID)
                    </h3>
                  </div>
                  <p className="text-[#A0856A]">{book.gutendex_id || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'formats' && (
            <motion.div
              key="formats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] mb-3">
                Available Formats
              </h2>
              {book.formats && Object.keys(book.formats).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(book.formats).map(([type, url]) => (
                    <li
                      key={type}
                      className="flex justify-between items-center border-b border-[#DDD0B8] dark:border-[#4A3520] py-2"
                    >
                      <span className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                        {type}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8B5E3C] hover:underline"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A0856A]">No formats listed.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
