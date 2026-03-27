import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Activity,
  Download,
  BookOpen,
  Clock,
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const activityItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  hover: {
    scale: 1.02,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
};

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const totalDownloads = useMemo(() => {
    return (
      user?.user_books?.filter((ub) => ub.action === 'downloaded').length || 0
    );
  }, [user]);

  const totalReads = useMemo(() => {
    return user?.user_books?.filter((ub) => ub.action === 'read').length || 0;
  }, [user]);

  const recentActivities = useMemo(() => {
    if (!user?.user_books) return [];
    return [...user.user_books]
      .sort((a, b) => new Date(b.action_at) - new Date(a.action_at))
      .slice(0, 10);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] flex items-center justify-center">
        <div className="text-center text-[#A0856A]">Loading profile...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208] p-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            My Profile
          </h1>
          <p className="text-[#A0856A] dark:text-[#8A6A4A]">
            View your account details and activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column – User Info Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-sm overflow-hidden">
              {/* Avatar / Header */}
              <div className="bg-gradient-to-r from-[#8B5E3C] to-[#C9A87C] px-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center"
                >
                  <User className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-xl font-bold text-white"
                >
                  {user.name}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80"
                >
                  @{user.username}
                </motion.p>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 text-[#2C1A0E] dark:text-[#F0E6D3]"
                >
                  <Mail className="w-5 h-5 text-[#8B5E3C]" />
                  <span>{user.email}</span>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 text-[#2C1A0E] dark:text-[#F0E6D3]"
                >
                  <Calendar className="w-5 h-5 text-[#8B5E3C]" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </motion.div>
                {user.last_login_at && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-3 text-[#2C1A0E] dark:text-[#F0E6D3]"
                  >
                    <Clock className="w-5 h-5 text-[#8B5E3C]" />
                    <span>
                      Last active {formatDateTime(user.last_login_at)}
                    </span>
                  </motion.div>
                )}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4 border-t border-[#DDD0B8] dark:border-[#4A3520]"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0856A]">Role</span>
                    <span className="capitalize font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#A0856A]">Status</span>
                    <span
                      className={`font-medium ${user.is_auth ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {user.is_auth ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#A0856A]">Email verified</span>
                    <span
                      className={`font-medium ${user.email_verified_at ? 'text-green-600' : 'text-yellow-600'}`}
                    >
                      {user.email_verified_at ? 'Yes' : 'No'}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-2 gap-px bg-[#DDD0B8] dark:bg-[#4A3520]"
              >
                <div className="bg-[#FDFAF4] dark:bg-[#231608] p-4 text-center">
                  <Download className="w-5 h-5 text-[#8B5E3C] mx-auto mb-1" />
                  <p className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                    {totalDownloads}
                  </p>
                  <p className="text-xs text-[#A0856A]">Downloads</p>
                </div>
                <div className="bg-[#FDFAF4] dark:bg-[#231608] p-4 text-center">
                  <BookOpen className="w-5 h-5 text-[#8B5E3C] mx-auto mb-1" />
                  <p className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                    {totalReads}
                  </p>
                  <p className="text-xs text-[#A0856A]">Reads</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column – Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-[#8B5E3C]" />
                <h2 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  Recent Activity
                </h2>
              </div>

              {recentActivities.length === 0 ? (
                <p className="text-center text-[#A0856A] py-8">
                  No activity yet. Start exploring books!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      custom={index}
                      variants={activityItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="flex items-center justify-between p-4 rounded-xl bg-[#F9F4ED] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] transition hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${activity.action === 'downloaded' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}
                        >
                          {activity.action === 'downloaded' ? (
                            <Download size={16} />
                          ) : (
                            <BookOpen size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                            {activity.action === 'downloaded'
                              ? 'Downloaded'
                              : 'Read'}
                          </p>
                          <p className="text-sm text-[#A0856A]">
                            Book #{activity.book_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-[#A0856A]">
                        {formatDateTime(activity.action_at)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Optional: Show all activities link */}
              {user.user_books?.length > 10 && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-[#8B5E3C] hover:underline">
                    View all activities →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
