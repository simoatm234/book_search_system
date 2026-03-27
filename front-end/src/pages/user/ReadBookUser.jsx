import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Download, BookOpen } from 'lucide-react';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { Api } from '../../Services/App/Api';

export default function ReadBookUser() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { book, loading: bookLoading } = useSelector((state) => state.books);
  const { getFileAndCober, getBookInfo, DownloadBook } = useGlobalFunction();
  const { showMessage } = useNotif();

  const [readUrl, setReadUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch book data if not already loaded
  useEffect(() => {
    const fetchBook = async () => {
      if (!book || book.id !== parseInt(bookId)) {
        await getBookInfo(bookId);
      }
    };
    fetchBook();
  }, []);

  // Once book is loaded, extract cover and file URLs
  useEffect(() => {
    if (book) {
      const { coverUrl: cUrl, fileUrl: fUrl } = getFileAndCober(book);
      setCoverUrl(cUrl);
      setFileUrl(fUrl);
    }
  }, [book]);

  // Track read action and obtain the read URL
  useEffect(() => {
    const trackRead = async () => {
      if (!book?.id) return;
      setIsLoading(true);
      try {
        const res = await Api.setUserBookRead(book.id);
        if (!res.data.success) {
          showMessage({
            message: res.data.message || 'Failed to open book',
            type: 'error',
          });
          navigate(-1);
          return;
        }
        setReadUrl(res.data.data.read_url);
      } catch (error) {
        showMessage({
          message: error?.response?.data?.message || 'Something went wrong',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };
    trackRead();
  }, [book]);

  // Get file extension from file URL
  const getExtension = (path) => {
    return path?.split('.').pop().toLowerCase();
  };
  const extension = getExtension(fileUrl);

  if (bookLoading || (!book && !isLoading)) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#8B5E3C]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] flex items-center justify-center">
        <p className="text-[#A0856A]">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFAF4]/90 dark:bg-[#231608]/90 backdrop-blur-sm border-b border-[#DDD0B8] dark:border-[#4A3520] px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition"
            >
              <ArrowLeft className="w-5 h-5 text-[#8B5E3C]" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-medium text-[#2C1A0E] dark:text-[#F0E6D3] line-clamp-1">
                {book.title}
              </h1>
              <p className="text-xs text-[#A0856A]">
                {book.authors?.join(', ') || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Download button */}
          {fileUrl && (
            <button
              onClick={() =>
                DownloadBook(book.id, `${book.title}.${extension}`)
              }
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Reader content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#8B5E3C] mb-4" />
            <p className="text-[#A0856A] text-sm">Loading reader...</p>
          </div>
        ) : !readUrl ? (
          <div className="text-center py-20 bg-[#FDFAF4] dark:bg-[#231608] rounded-xl border border-[#DDD0B8]">
            <BookOpen className="w-12 h-12 text-[#A0856A] mx-auto mb-3" />
            <p className="text-[#A0856A]">Unable to load book content.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#231608] rounded-xl overflow-hidden shadow-lg border border-[#DDD0B8]"
          >
            {extension === 'pdf' && (
              <iframe
                src={readUrl}
                className="w-full h-[80vh]"
                title="PDF Reader"
              />
            )}
            {extension === 'epub' && (
              <iframe
                src={readUrl}
                className="w-full h-[80vh]"
                title="EPUB Reader"
              />
            )}
            {extension === 'txt' && (
              <iframe
                src={readUrl}
                className="w-full h-[80vh]"
                title="TXT Reader"
              />
            )}
            {!['pdf', 'epub', 'txt'].includes(extension) && (
              <div className="p-8 text-center">
                <p className="text-[#A0856A] mb-4">
                  Unsupported file format for inline reading.
                </p>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition"
                  >
                    <Download size={16} />
                    Download file
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
