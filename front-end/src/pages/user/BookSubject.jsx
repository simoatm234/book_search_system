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
