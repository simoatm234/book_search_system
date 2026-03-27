import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useGlobalFunction } from '../../Services/App/slice/auther functions/GloalFunctions';
import { Eye, BookOpen, Download, Bookmark, Search } from 'lucide-react';

export default function BookSubject() {
  const { subject } = useParams();
  const { bookBySubject, loading } = useSelector((state) => state.books);
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const { showMessage } = useNotif();
  const { getbookBySubject } = useBook();
  const { getFileAndCober, DownloadBook, addToMyBooks } = useGlobalFunction();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all'); // 'all', 'title', 'author', 'subject'

  const isAuthenticated = !!user && !!token && isAuth;

  useEffect(() => {
    const fetch = async () => {
      try {
        await getbookBySubject({ subject, page: currentPage });
      } catch (error) {
        showMessage({
          message: error?.response?.data?.message || 'Something went wrong',
          type: 'error',
        });
      }
    };
    fetch();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (bookBySubject?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  // No filtering logic – search and select do nothing
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // TODO: add search logic here
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    // TODO: add search logic here
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    // TODO: add search logic here
  };

  if (loading && !bookBySubject) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#DDD0B8] border-t-[#8B5E3C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!bookBySubject || !bookBySubject.data?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-[#A0856A]">No books found for "{subject}".</p>
      </div>
    );
  }

  const books = bookBySubject.data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with title and search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold capitalize">{subject}</h1>

        {/* Search section */}
        <div className="flex gap-2">
          {/* Search field dropdown */}
          <select
            value={searchField}
            onChange={handleSearchFieldChange}
            className="px-3 py-2 bg-white dark:bg-[#1A110A] border border-[#DDD0B8] rounded-lg text-sm text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          >
            <option value="all">All Fields</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
          </select>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A]" />
            <input
              type="text"
              placeholder={`Search by ${searchField === 'all' ? 'title, author, or subject' : searchField}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-[#1A110A] border border-[#DDD0B8] rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] placeholder:text-[#A0856A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="px-3 py-2 text-sm text-[#A0856A] hover:text-[#8B5E3C] transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => {
          const { coverUrl, fileUrl } = getFileAndCober(book);
          const hasFile = !!book.files;
          return (
            <div
              key={book.id}
              className="bg-white dark:bg-[#1A110A] border border-[#DDD0B8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Cover */}
              <div className="relative h-64 bg-[#F3EFE7] overflow-hidden">
                <img
                  src={
                    coverUrl ||
                    'https://via.placeholder.com/150x200?text=No+Cover'
                  }
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
                    onClick={() => {
                      /* navigate to details */
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-[#EDE4D3] text-[#2C1A0E] hover:bg-[#E0D5C0] transition"
                  >
                    <Eye size={16} /> Details
                  </button>
                  <div className="flex gap-2">
                    <button
                      disabled={!isAuthenticated}
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
                      disabled={!isAuthenticated}
                      onClick={() => addToMyBooks(book.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                        isAuthenticated
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Bookmark size={14} /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {bookBySubject.last_page > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-[#EDE4D3] text-[#2C1A0E] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E0D5C0] transition"
          >
            Previous
          </button>
          <span className="text-[#A0856A] self-center">
            Page {currentPage} of {bookBySubject.last_page}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === bookBySubject.last_page}
            className="px-4 py-2 rounded-lg bg-[#EDE4D3] text-[#2C1A0E] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E0D5C0] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
