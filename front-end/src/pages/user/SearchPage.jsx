import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Api } from '../../Services/App/Api';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import {
  Search,
  Loader2,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showMessage } = useNotif();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedTerm, setHighlightedTerm] = useState('');

  // Get initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialSubject = searchParams.get('subject') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Controlled inputs
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [subject, setSubject] = useState(initialSubject);
  const [page, setPage] = useState(initialPage);

  const debounceTimer = useRef(null);
  const itemsPerPage = 10;

  // Subjects list (replace with dynamic fetch if needed)
  const subjectsList = ['', 'Math', 'Science', 'History', 'Literature'];

  // Fetch data function
  const fetchData = useCallback(
    async (q, t, s, p) => {
      if (!q) {
        setData([]);
        setTotalResults(0);
        setHighlightedTerm('');
        return;
      }

      setLoading(true);
      try {
        let res;
        if (s) {
          res = await Api.searchWithSubject(q, t, s, p, itemsPerPage);
        } else {
          res = await Api.search(q, t, p, itemsPerPage);
        }

        if (res?.data?.success) {
          setData(res.data.data);
          setTotalResults(res.data.total || res.data.data.length);
          setHighlightedTerm(q);

          if (res.data.data.length === 0) {
            showMessage({ message: 'No results found.', type: 'warning' });
          } else {
            showMessage({
              message: `Found ${res.data.total || res.data.data.length} results.`,
              type: 'success',
            });
          }
        } else {
          setData([]);
          setTotalResults(0);
          showMessage({ message: 'No results found.', type: 'warning' });
        }
      } catch (error) {
        setData([]);
        setTotalResults(0);
        showMessage({ message: 'Error during search', type: 'error' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [showMessage]
  );

  // Debounced search when filters change
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const params = {};
      if (queryInput) params.q = queryInput;
      if (type && type !== 'all') params.type = type;
      if (subject && subject !== '') params.subject = subject;
      if (page > 1) params.page = page;

      setSearchParams(params, { replace: true });
      fetchData(queryInput, type, subject, page);
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [queryInput, type, subject, page]);

  // Reset page when query/type/subject changes
  useEffect(() => setPage(1), [queryInput, type, subject]);

  // Highlight search term in text
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600/50 text-inherit px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Clear search
  const clearSearch = () => {
    setQueryInput('');
    setType('all');
    setSubject('');
    setPage(1);
  };

  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Search Card */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                Search Books
              </h1>
              <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                Find books, authors, or content
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search by title, author, or content..."
                className="w-full pl-10 pr-10 py-3 bg-[#F5EFE6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all"
              />
              {queryInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0856A] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type select */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-3 bg-[#F5EFE6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] cursor-pointer transition-all"
            >
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="content">Content</option>
            </select>

            {/* Subject select */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-4 py-3 bg-[#F5EFE6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] cursor-pointer transition-all"
            >
              {subjectsList.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === '' ? 'All Subjects' : subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[#DDD0B8] dark:border-[#4A3520] bg-[#F5EFE6] dark:bg-[#1A1208] flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
              Results
              {queryInput && (
                <span className="ml-2 text-sm font-normal text-[#A0856A]">
                  for "{queryInput}"
                </span>
              )}
            </h2>
            {totalResults > 0 && (
              <p className="text-sm text-[#A0856A]">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#8B5E3C] dark:text-[#C9A87C] animate-spin" />
              <p className="mt-2 text-[#A0856A] dark:text-[#8A6A4A]">
                Searching...
              </p>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-[#C9A87C] dark:text-[#6B4423] mx-auto mb-3" />
              <p className="text-[#A0856A] dark:text-[#8A6A4A]">
                {queryInput
                  ? 'No results found.'
                  : 'Enter a search term to begin.'}
              </p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]"
            >
              <AnimatePresence>
                {data.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {item.book?.formats?.['image/jpeg'] && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.book.formats['image/jpeg']}
                            alt={item.book.title}
                            className="w-24 h-32 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <Link
                          to={`/books/${item.book_id}`}
                          className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C] transition-colors"
                        >
                          {highlightText(item.book.title, highlightedTerm)}
                        </Link>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-[#8B5E3C] dark:text-[#C9A87C]">
                            {highlightText(
                              item.book.authors
                                ? Array.isArray(item.book.authors)
                                  ? item.book.authors.join(', ')
                                  : item.book.authors
                                : 'Unknown author',
                              highlightedTerm
                            )}
                          </span>
                          {item.book.languages && (
                            <span className="text-xs bg-[#EDE4D3] dark:bg-[#2C1F10] text-[#8B5E3C] dark:text-[#C9A87C] px-2 py-0.5 rounded-full">
                              {item.book.languages[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        {item.content && (
                          <p className="mt-3 text-[#2C1A0E] dark:text-[#F0E6D3] text-sm leading-relaxed">
                            {highlightText(
                              item.content.substring(0, 300),
                              highlightedTerm
                            )}
                            {item.content.length > 300 && '...'}
                          </p>
                        )}

                        {item.book.subjects && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(Array.isArray(item.book.subjects)
                              ? item.book.subjects
                              : String(item.book.subjects).split(',')
                            )
                              .slice(0, 3)
                              .map((subj, i) => (
                                <span
                                  key={i}
                                  className="text-xs text-[#A0856A] dark:text-[#8A6A4A] bg-[#F5EFE6] dark:bg-[#1A1208] px-2 py-0.5 rounded-full"
                                >
                                  {subj.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
              <p className="text-sm text-[#A0856A]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
