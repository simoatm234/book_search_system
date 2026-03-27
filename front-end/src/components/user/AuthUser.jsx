import React, { useEffect } from 'react';
import { useAuth } from '../../Services/App/slice/Dispatches/AuthDispatch';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AuthUser() {
  const { setOpenAuth } = useAuth();
  const { OpenAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!OpenAuth) {
      setOpenAuth(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {OpenAuth && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 🔥 BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenAuth(false)}
          />

          {/* 🔥 MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 80 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 120,
                damping: 12,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              transition: { duration: 0.2 },
            }}
            className="
              relative z-10
              bg-white dark:bg-[#1A1208]
              rounded-3xl
              shadow-2xl
              w-[90%] max-w-md
              p-8
              text-center
              border border-[#DDD0B8]
            "
          >
            {/* ❌ CLOSE */}
            <button
              onClick={() => setOpenAuth(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2C1A0E] transition"
            >
              <X size={20} />
            </button>

            {/* 🔥 TITLE */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-3"
            >
              Sign in to read books 📚
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[#A0856A] mb-6"
            >
              Join us to access thousands of free books and features.
            </motion.p>

            {/* 🔥 BUTTONS */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
              }}
              className="flex flex-col gap-3"
            >
              {/* LOGIN */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/login"
                  className="w-full py-3 rounded-xl bg-[#8B5E3C] text-white font-medium hover:bg-[#6f472d] transition block"
                >
                  Login
                </Link>
              </motion.div>

              {/* REGISTER */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl border border-[#8B5E3C] text-[#8B5E3C] font-medium hover:bg-[#8B5E3C] hover:text-white transition block"
                >
                  Register
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
