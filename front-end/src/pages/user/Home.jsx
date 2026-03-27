import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapBooks from '../../components/user/MapBooks';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

export default function Home() {
  const { booksBySubject } = useSelector((state) => state.books);
  const { getBooksBySubject } = useBook();
  const { showMessage } = useNotif();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        await getBooksBySubject();
      } catch (error) {
        showMessage({
          message: error?.response?.data?.message || 'Something went wrong',
          type: 'error',
        });
      }
    };
    fetch();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Get subjects from the keys of booksBySubject
  const subjects = booksBySubject ? Object.keys(booksBySubject) : [];

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208]">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 border-b border-[#DDD0B8]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFAF4] via-[#F4F0E6] to-[#EDE4D3] dark:from-[#231608] dark:via-[#1A1208] dark:to-[#120A05]" />
        <div className="relative max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-6 leading-tight"
          >
            Discover <span className="text-[#8B5E3C]">Timeless Books</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-[#A0856A] dark:text-[#C9B38A] max-w-2xl mx-auto"
          >
            Explore thousands of free books in science, fiction, history, and
            more.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {subjects.length > 0 ? (
          subjects.map((subjectName) => {
            const booksForThisSubject = booksBySubject[subjectName];

            const isLoading = !booksForThisSubject;

            return (
              <motion.section
                key={subjectName}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-3">
                  <div>
                    <h2 className="text-3xl font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] capitalize">
                      {subjectName}
                    </h2>
                    <div className="w-12 h-1 bg-[#8B5E3C] rounded mt-2" />
                  </div>

                  <div className="flex items-center gap-4">
                    {/* See More Button */}
                    <button
                      onClick={() =>
                        navigate(`/user/books/${subjectName}/subject`)
                      }
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#8B5E3C] text-white hover:bg-[#6F4A2E] transition-colors"
                    >
                      See More →
                    </button>
                  </div>
                </div>

                {/* Books Container */}
                <div className="relative rounded-3xl border border-[#DDD0B8] bg-white/70 dark:bg-[#231608]/80 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-[#EDE4D3]/30 to-transparent opacity-0 hover:opacity-100 transition pointer-events-none" />

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-[#DDD0B8] border-t-[#8B5E3C] rounded-full animate-spin" />
                      <p className="text-[#A0856A] mt-4 text-sm">
                        Loading books...
                      </p>
                    </div>
                  ) : booksForThisSubject?.length > 0 ? (
                    <MapBooks booksData={booksForThisSubject} />
                  ) : (
                    <p className="text-center text-[#A0856A] py-12 italic">
                      No books available for {subjectName}
                    </p>
                  )}
                </div>
              </motion.section>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white/70 dark:bg-[#231608]/80 backdrop-blur-md rounded-3xl border border-[#DDD0B8]">
            <h3 className="text-2xl font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              Loading Library...
            </h3>
            <p className="text-[#A0856A] text-sm">
              Please wait while we fetch your books
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
