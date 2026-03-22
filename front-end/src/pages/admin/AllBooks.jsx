import React, { useEffect, useState } from 'react';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useSelector } from 'react-redux';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import {
  Book,
  Search,
  Filter,
  Eye,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCheck,
  FileX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShowBookInfo from '../../components/admin/ShowBookInfo';
import { Api } from '../../Services/App/Api';

export default function AllBooks() {
  const { allBooks } = useBook();
  const { showMessage } = useNotif();
  const { books, loading } = useSelector((state) => state.books);
  const [bookId, setBookId] = useState(null);
  const [showBook, setShowBook] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await allBooks();
        console.log(res);
        showMessage({
          message: res?.payload?.message || 'Books loaded successfully!',
          type: 'success',
        });
      } catch (error) {
        showMessage({
          message: 'Failed to load books!',
          type: 'error',
        });
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search, language, and download status
  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors?.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      book.subjects?.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLanguage =
      filterLanguage === 'all' || book.languages?.includes(filterLanguage);

    const hasFiles = book.files && book.files.length > 0;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'downloaded' && hasFiles) ||
      (filterStatus === 'not-downloaded' && !hasFiles);

    return matchesSearch && matchesLanguage && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil((filteredBooks?.length || 0) / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks?.slice(startIndex, endIndex);

  // Get unique languages
  const languages = [
    ...new Set(books?.flatMap((book) => book.languages || [])),
  ];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLanguage, filterStatus]);

  // Get download stats
  const totalBooks = books?.length || 0;
  const downloadedBooks =
    books?.filter((b) => b.files && b.files.length > 0).length || 0;
  const notDownloadedBooks = totalBooks - downloadedBooks;

  // Handle download file
  const handleDownloadFile = async (bookId, fileName) => {
    try {
      const response = await Api.setUserBookDownload(bookId);

      const blob = response.data; // ✅ correct now

      if (!blob || blob.size === 0) {
        throw new Error('Empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'book';
      link.click();

      showMessage({
        message: 'Download started successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showMessage({
        message: 'Download failed!',
        type: 'error',
      });
    }
  };

  // Handle show book
  const handleShowBook = (id) => {
    setBookId(id);
    setShowBook(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      {/* Header */}
      <div className="bg-[#FDFAF4] dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#C9A87C] dark:border-[#6B4423] flex items-center justify-center">
                <BookOpen className="text-[#8B5E3C] dark:text-[#C9A87C] w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  All Books
                </h1>
                <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                  {filteredBooks?.length || 0} books in library
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8B5E3C] dark:text-[#C9A87C]">
                  {downloadedBooks}
                </p>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                  Downloaded
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#A0856A] dark:text-[#8A6A4A]">
                  {notDownloadedBooks}
                </p>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                  Pending
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="text"
                  placeholder="Search by title, author, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F4F0E6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] transition"
                />
              </div>
            </div>

            {/* Download Status Filter */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F0E6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] transition appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="downloaded">Downloaded</option>
                <option value="not-downloaded">Not Downloaded</option>
              </select>
            </div>

            {/* Language Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F4F0E6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] transition appearance-none cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F4F0E6]/60 dark:bg-[#1A1208]/60 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-[#8B5E3C] dark:text-[#C9A87C] animate-spin" />
              <p className="text-[#2C1A0E] dark:text-[#F0E6D3] font-medium">
                Loading books...
              </p>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className={loading ? 'blur-sm' : ''}>
          {currentBooks?.length === 0 ? (
            <div className="text-center py-16 bg-[#FDFAF4] dark:bg-[#231608] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
              <Book className="w-16 h-16 text-[#C9A87C] dark:text-[#6B4423] mx-auto mb-4" />
              <p className="text-[#A0856A] dark:text-[#8A6A4A]">
                No books found
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#EDE4D3] dark:bg-[#2C1F10] border-b border-[#DDD0B8] dark:border-[#4A3520]">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          Author(s)
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          Languages
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
                      {currentBooks?.map((book) => {
                        const hasFiles = book.files && book.files.length > 0;
                        const bookFile = hasFiles ? book.files[0] : null;
                        const baseUrl = import.meta.env.VITE_BACK_END_URL_IMAGE;

                        const coverUrl = bookFile?.cover_path
                          ? `${baseUrl}storage/${bookFile.cover_path}`
                          : null;

                        const fileUrl = bookFile?.file_path
                          ? `${baseUrl}storage/${bookFile.file_path}`
                          : null;

                        return (
                          <tr
                            key={book.id}
                            className="hover:bg-[#F4F0E6] dark:hover:bg-[#1A1208] transition-colors"
                          >
                            {/* ID */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-[#8B5E3C] dark:text-[#C9A87C]">
                                #{book.id}
                              </span>
                            </td>

                            {/* Title with Cover */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-14 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {coverUrl ? (
                                    <img
                                      src={coverUrl}
                                      alt={book.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : book.formats?.['image/jpeg'] ? (
                                    <img
                                      src={book.formats['image/jpeg']}
                                      alt={book.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Book className="w-5 h-5 text-[#C9A87C] dark:text-[#6B4423]" />
                                  )}
                                </div>

                                <div className="max-w-md">
                                  <p className="text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] line-clamp-2">
                                    {book.title}
                                  </p>

                                  {hasFiles && (
                                    <p className="text-xs text-[#8B5E3C] dark:text-[#C9A87C] mt-1">
                                      {bookFile.file_format.toUpperCase()} •{' '}
                                      {new Date(
                                        bookFile.downloaded_at
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Authors */}
                            <td className="px-6 py-4">
                              <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] line-clamp-1 max-w-xs">
                                {Array.isArray(book.authors)
                                  ? book.authors.join(', ')
                                  : book.authors || 'Unknown'}
                              </p>
                            </td>

                            {/* Languages */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(book.languages) ? (
                                  book.languages.map((lang) => (
                                    <span
                                      key={lang}
                                      className="px-2 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] text-[#8B5E3C] dark:text-[#C9A87C] text-xs font-medium rounded"
                                    >
                                      {lang.toUpperCase()}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 text-center">
                              {hasFiles ? (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                                  <FileCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
                                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                    Downloaded
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#DDD0B8] dark:border-[#4A3520] rounded-full">
                                  <FileX className="w-3 h-3 text-[#A0856A] dark:text-[#8A6A4A]" />
                                  <span className="text-xs font-medium text-[#A0856A] dark:text-[#8A6A4A]">
                                    Pending
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleShowBook(book.id)}
                                  className="p-2 hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] rounded-lg transition group"
                                >
                                  <Eye className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                                </button>

                                {fileUrl && (
                                  <button
                                    onClick={() =>
                                      handleDownloadFile(
                                        book.id,
                                        `${book.title}.${bookFile.file_format}`
                                      )
                                    }
                                    className="p-2 hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] rounded-lg transition group"
                                  >
                                    <Download className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(endIndex, filteredBooks?.length || 0)} of{' '}
                    {filteredBooks?.length || 0} results
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                    </button>

                    <span className="px-4 py-2 bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition"
                    >
                      <ChevronRight className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showBook && bookId && (
          <ShowBookInfo
            bookId={bookId}
            setCloseBook={setShowBook}
            handleDownloadFile={handleDownloadFile}
          />
        )}
      </div>
    </div>
  );
}
