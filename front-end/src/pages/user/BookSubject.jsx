import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { Search } from 'lucide-react';
import Card from '../../components/user/Card';

export default function BookSubject() {
  const { subject } = useParams();
  const { bookBySubject, loading } = useSelector((state) => state.books);
  const { showMessage } = useNotif();
  const { getbookBySubject } = useBook();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

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
      getbookBySubject({ subject, page: newPage });
      setCurrentPage(newPage);
    }
  };

  // Search handlers (client-side filtering – implement as needed)
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

        <div className="flex gap-2">
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
        {books.map((book) => (
          <Card key={book.id} book={book} />
        ))}
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
