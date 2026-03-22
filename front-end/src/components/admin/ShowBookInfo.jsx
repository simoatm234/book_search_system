import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  X,
  Book,
  User,
  Globe,
  Calendar,
  Download,
  FileText,
} from 'lucide-react';

export default function ShowBookInfo({ bookId, setCloseBook, handleDownloadFile }) {
  const { books } = useSelector((state) => state.books);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const foundBook = books?.find((b) => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
    }
  }, [bookId, books]);

  const handleCloseBook = () => {
    setCloseBook(false);
  };

  if (!book) {
    return null;
  }

  const hasFiles = book.files && book.files.length > 0;
  const bookFile = hasFiles ? book.files[0] : null;
  const baseUrl = import.meta.env.VITE_BACK_END_URL_IMAGE;

  const coverUrl = bookFile?.cover_path
    ? `${baseUrl}storage/${bookFile.cover_path}`
    : book.formats?.['image/jpeg'];

  const fileUrl = bookFile?.file_path
    ? `${baseUrl}storage/${bookFile.file_path}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FDFAF4] dark:bg-[#231608] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#DDD0B8] dark:border-[#4A3520]">
        {/* Header */}
        <div className="bg-[#EDE4D3] dark:bg-[#2C1F10] px-6 py-4 flex items-center justify-between border-b border-[#DDD0B8] dark:border-[#4A3520]">
          <h2 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            Book Details
          </h2>
          <button
            onClick={handleCloseBook}
            className="p-2 hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#2C1A0E] dark:text-[#F0E6D3]" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-lg overflow-hidden shadow-lg border border-[#DDD0B8] dark:border-[#4A3520] flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Book className="w-20 h-20 text-[#C9A87C] dark:text-[#6B4423]" />
                )}
              </div>

              {/* Download Button */}
              {fileUrl && (
                <button
                  onClick={() =>
                    handleDownloadFile(
                      fileUrl,
                      `${book.title}.${bookFile.file_format}`
                    )
                  }
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] font-medium rounded-lg transition"
                >
                  <Download className="w-5 h-5" />
                  Download Book
                </button>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
                  {book.title}
                </h1>
                {hasFiles && (
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                    Downloaded • {bookFile.file_format.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Authors */}
              {book.authors && book.authors.length > 0 && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] mb-1">
                      Author(s)
                    </p>
                    <p className="text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {Array.isArray(book.authors)
                        ? book.authors.join(', ')
                        : book.authors}
                    </p>
                  </div>
                </div>
              )}

              {/* Languages */}
              {book.languages && book.languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] mb-1">
                      Language(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] text-[#8B5E3C] dark:text-[#C9A87C] text-xs font-medium rounded border border-[#DDD0B8] dark:border-[#4A3520]"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Count */}
              {book.download_count !== undefined && (
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] mb-1">
                      Downloads
                    </p>
                    <p className="text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {book.download_count.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Subjects */}
              {book.subjects && book.subjects.length > 0 && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] mb-1">
                      Subjects
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#F4F0E6] dark:bg-[#1A1208] text-[#A0856A] dark:text-[#8A6A4A] text-xs rounded border border-[#DDD0B8] dark:border-[#4A3520]"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {book.summaries && (
                <div className="mt-6 pt-6 border-t border-[#DDD0B8] dark:border-[#4A3520]">
                  <p className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] mb-2">
                    Summary
                  </p>
                  <p className="text-[#2C1A0E] dark:text-[#F0E6D3] leading-relaxed text-sm">
                    {book.summaries}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#EDE4D3] dark:bg-[#2C1F10] px-6 py-4 flex justify-end gap-3 border-t border-[#DDD0B8] dark:border-[#4A3520]">
          <button
            onClick={handleCloseBook}
            className="px-4 py-2 bg-[#F4F0E6] dark:bg-[#1A1208] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] text-[#2C1A0E] dark:text-[#F0E6D3] font-medium rounded-lg transition border border-[#DDD0B8] dark:border-[#4A3520]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
