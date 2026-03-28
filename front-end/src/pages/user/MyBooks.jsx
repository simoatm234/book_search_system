import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useSave } from '../../Services/App/slice/Dispatches/SaveDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import Card from '../../components/user/Card';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function MyBooks() {
  const navigate = useNavigate();
  const { mySaves, loading } = useSelector((state) => state.save);
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const { fetchMySaves } = useSave();
  const { showMessage } = useNotif();

  

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchMySaves();
      } catch (error) {
        showMessage({
          message: error?.message || 'Failed to load saved books.',
          type: 'error',
        });
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    if (!user && !token && !isAuth) {
      navigate(-1);
      showMessage({
        message: 'Please log in to view your library.',
        type: 'info',
      });
    }
  }, [user, token, isAuth]);
  if (loading && !mySaves.length ) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#DDD0B8] border-t-[#8B5E3C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !token && !isAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-16 h-16 text-[#C9A87C] dark:text-[#6B4423] mb-4" />
        <h3 className="text-xl font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
          Please Log In
        </h3>
        <p className="text-[#A0856A] dark:text-[#8A6A4A] mt-2">
          You need to be logged in to view your saved books.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!mySaves || mySaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-16 h-16 text-[#C9A87C] dark:text-[#6B4423] mb-4" />
        <h3 className="text-xl font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
          Your library is empty
        </h3>
        <p className="text-[#A0856A] dark:text-[#8A6A4A] mt-2">
          Start exploring books and click "Save" to add them here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
        My Library
      </h1>
      <p className="text-[#A0856A] dark:text-[#8A6A4A] mb-8">
        Books you've saved for later
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {mySaves.map((saved) => (
            <motion.div
              key={saved.id}
              variants={cardVariants}
              exit="exit"
              layout
            >
              <Card book={saved.book} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
