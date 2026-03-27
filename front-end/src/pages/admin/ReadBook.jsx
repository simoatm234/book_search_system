import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { BookOpen, Loader2, ArrowLeft, Download } from 'lucide-react';
import { Api } from '../../Services/App/Api';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';

export default function ReadBook() {
  const { book, loading } = useSelector((state) => state.books);
  const { getBookInfo, getFileAndCober, DownloadBook } = useGlobalFunction();
  const { showMessage } = useNotif();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [readUrl, setReadUrl] = useState(null);

  // Load book if not in store
  useEffect(() => {
    if (!book || book.id !== parseInt(bookId)) {
      getBookInfo(bookId); // async, will populate store
    }
  }, [book, bookId, getBookInfo]);

  // Compute coverUrl and fileUrl from the current book (once available)
  const { coverUrl, fileUrl } = useMemo(() => {
    if (!book) return { coverUrl: null, fileUrl: null };
    return getFileAndCober(book);
  }, [book, getFileAndCober]);

  // Track read action and obtain the read URL
  useEffect(() => {
    const trackRead = async () => {
      if (!book?.id || readUrl) return;
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
      }
    };
    trackRead();
  }, [book, readUrl, showMessage, navigate]);

  // Helper to get file extension
  const getExtension = (path) => {
    return path?.split('.').pop().toLowerCase();
  };

  const extension = getExtension(fileUrl);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] dark:bg-[#1A1208]">
        <Loader2 className="w-12 h-12 animate-spin text-[#8B5E3C]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8B5E3C]">
        Book not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      {/* HEADER */}
      <div className="bg-[#FDFAF4] dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#C9A87C]">
              <BookOpen className="text-[#8B5E3C] w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                {book.title}
              </h1>
              <p className="text-xs text-[#A0856A]">Read your book</p>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#DDD0B8] dark:border-[#4A3520] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-sm text-[#8B5E3C]">Back</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDE (INFO) */}
          <div className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-4">
            {/* Cover */}
            {coverUrl && (
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            {/* Info */}
            <h2 className="text-md font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              {book.title}
            </h2>

            <p className="text-sm text-[#A0856A] mb-2">
              {Array.isArray(book.authors)
                ? book.authors.join(', ')
                : 'Unknown Author'}
            </p>

            <p className="text-xs text-[#8B5E3C] mb-4">
              Format: {extension?.toUpperCase()}
            </p>

            {/* Download button */}
            <button
              onClick={() =>
                DownloadBook(book.id, `${book.title}.${extension}`)
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#8B5E3C] text-white hover:bg-[#6F4A2E] transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>

          {/* RIGHT SIDE (READER) */}
          <div className="lg:col-span-3 bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl overflow-hidden">
            {!readUrl ? (
              <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B5E3C]" />
              </div>
            ) : (
              <>
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
                  <div className="p-6 text-center text-[#A0856A]">
                    Unsupported file format for inline reading.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
