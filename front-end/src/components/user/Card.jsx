import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, BookOpen, Download, Bookmark, BookmarkCheck } from 'lucide-react';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';

export default function Card({ book }) {
  const navigate = useNavigate();
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const { mySaves } = useSelector((state) => state.save);
  const { AddSave, removeSave, DownloadBook, getFileAndCober } =
    useGlobalFunction();

  const isAuthenticated = !!user && !!token && isAuth;
  const { coverUrl } = getFileAndCober(book);
  const hasFile = !!book.files;

  // Check if the book is already saved by the current user
  const isSaved = useMemo(() => {
    if (!mySaves) return false;
    return mySaves.some((saved) => saved.book?.id === book.id);
  }, [mySaves, book.id]);

  // Find the saved record id for this book (to use when removing)
  const savedRecordId = useMemo(() => {
    if (!mySaves) return null;
    const saved = mySaves.find((saved) => saved.book?.id === book.id);
    return saved?.id;
  }, [mySaves, book.id]);

  const handleSaveToggleState = async () => {
    if (!isAuthenticated) return;
    if (isSaved && savedRecordId) {
      await removeSave(savedRecordId);
    } else {
      await AddSave({'book_id' : book.id});
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A110A] border border-[#DDD0B8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Cover */}
      <div className="relative h-64 bg-[#F3EFE7] overflow-hidden">
        <img
          src={coverUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
          alt={book.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#2C1A0E] dark:text-[#F0E6D3] line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-[#A0856A] mb-2">
          {book.authors?.join(', ') || 'Anonymous'}
        </p>

        {/* Stats */}
        <div className="flex gap-3 text-xs text-[#A0856A] mb-3">
          {book.download_count > 0 && (
            <span className="flex items-center gap-1">
              <Download size={12} /> {book.download_count}
            </span>
          )}
          {book.reading_count > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> {book.reading_count}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          <button
            onClick={() => navigate(`/user/books/${book.id}/show`)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-[#EDE4D3] text-[#2C1A0E] hover:bg-[#E0D5C0] transition"
          >
            <Eye size={16} /> Details
          </button>
          <div className="flex gap-2">
            <button
              disabled={!isAuthenticated}
              onClick={() => navigate(`/user/books/${book.id}/read`)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                isAuthenticated
                  ? 'bg-[#2C1A0E] text-white hover:bg-black'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <BookOpen size={14} /> Read
            </button>
            <button
              disabled={!isAuthenticated || !hasFile}
              onClick={() =>
                DownloadBook(
                  book.id,
                  `${book.title}.${book.files?.file_format || 'txt'}`
                )
              }
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                isAuthenticated && hasFile
                  ? 'bg-[#8B5E3C] text-white hover:bg-[#6F4B30]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download size={14} /> Get
            </button>
            <button
              onClick={handleSaveToggleState}
              disabled={!isAuthenticated}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                isAuthenticated
                  ? isSaved
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
