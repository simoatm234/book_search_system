import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Mail,
  Shield,
  BookOpen,
  User,
  Edit,
  Lock,
  Calendar,
  CheckCircle,
  XCircle,
  LogIn,
  Activity,
} from 'lucide-react';
import EditeProfile from '../../components/admin/EditeProfile';
import EditePass from '../../components/admin/EditePass';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { UpdateUser, updateUserPass } = useUser();
  const [isEditeProfile, setIsEditeProfile] = useState(false);
  const [isEditePass, setIsEditePass] = useState(false);
  const { showMessage } = useNotif();

  // Compute stats from user_books data
  const stats = useMemo(() => {
    const booksRead =
      user?.user_books?.filter((ub) => ub.action === 'read').length || 0;
    const currentlyReading =
      user?.user_books?.filter((ub) => ub.action === 'downloaded').length || 0;
    // Wishlist could be a separate field, but for now we'll use a placeholder
    // If you have a 'wishlist' action or separate array, adjust accordingly.
    const wishlist = 0;
    return { booksRead, currentlyReading, wishlist };
  }, [user]);

  // Get recent activities (last 3 actions sorted by action_at)
  const recentActivities = useMemo(() => {
    if (!user?.user_books) return [];
    return [...user.user_books]
      .sort((a, b) => new Date(b.action_at) - new Date(a.action_at))
      .slice(0, 3);
  }, [user]);

  // Map user fields (handle both camelCase and snake_case from API)
  const profileData = {
    name: user?.name || 'User Name',
    username: user?.username || 'username',
    email: user?.email || 'user@example.com',
    role: user?.role || 'user',
    id: user?.id || 'N/A',
    confirmed: user?.confirmed === 1 || user?.confirmed === true || false,
    isAuth: user?.is_auth === 1 || user?.isAuth === true || false,
    createdAt: user?.created_at || user?.createdAt || new Date().toISOString(),
    lastLoginAt: user?.last_login_at || user?.lastLoginAt || null,
  };

  const avatarLetter = profileData.name?.charAt(0).toUpperCase() || '?';
  

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'librarian':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      const id = user.id;
      const res = await UpdateUser({ id, data });
      if (res?.payload.success) {
        showMessage({
          message: res?.payload.message || 'Profile updated successfully!',
          type: 'success',
        });
        return res;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update profile!',
        type: 'error',
      });
      throw error;
    }
  };

  const handleUpdatePassword = async (data) => {
    try {
      const id = user.id;
      const res = await updateUserPass({ id, data });
      if (res?.payload.success) {
        showMessage({
          message: res?.payload.message,
          type: 'success',
        });
        return res;
      }
    } catch (error) {
      console.error('Update password error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to change password!',
        type: 'error',
      });
      throw error;
    }
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Card - Responsive */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar - Responsive size */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white shadow-lg flex-shrink-0">
                {avatarLetter}
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] break-words">
                    {profileData.name}
                  </h1>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border capitalize inline-block mx-auto sm:mx-0 ${getRoleColor(profileData.role)}`}
                  >
                    {profileData.role}
                  </span>
                </div>

                <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mb-3">
                  @{profileData.username}
                </p>

                {/* Meta Info - Stack on mobile, row on tablet */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Shield className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                    <span className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3]">
                      ID: #{profileData.id.toString().slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                    <span className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3]">
                      Joined: {formatDate(profileData.createdAt)}
                    </span>
                  </div>
                  {profileData.lastLoginAt && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <LogIn className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                      <span className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3]">
                        Last login: {formatDate(profileData.lastLoginAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badges - Responsive wrap */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end mt-2 lg:mt-0">
              {profileData.isAuth ? (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Authorized
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Unauthorized
                  </span>
                </div>
              )}
              {profileData.confirmed ? (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Confirmed
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Dynamic based on user_books */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-4 sm:p-6 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-2 sm:mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
              {stats.booksRead}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
              Books Read
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-4 sm:p-6 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-2 sm:mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
              {stats.currentlyReading}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
              Currently Reading
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-4 sm:p-6 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-2 sm:mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
              {stats.wishlist}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
              Wishlist
            </p>
          </div>
        </div>

        {/* Profile Details Card - Responsive */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6 transition-colors duration-300">
          <div className="p-4 sm:p-6 border-b border-[#DDD0B8] dark:border-[#4A3520] bg-[#F5EFE6] dark:bg-[#1A1208]">
            <h2 className="text-base sm:text-lg font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
              Profile Information
            </h2>
          </div>

          <div className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
            {/* Name Row */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                  Full Name
                </p>
                <p className="text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] break-words">
                  {profileData.name}
                </p>
              </div>
            </div>

            {/* Email Row */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                  Email Address
                </p>
                <p className="text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] break-words">
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* Role Row */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                  Role
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getRoleColor(profileData.role)}`}
                  >
                    {profileData.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        {recentActivities.length > 0 && (
          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6 transition-colors duration-300">
            <div className="p-4 sm:p-6 border-b border-[#DDD0B8] dark:border-[#4A3520] bg-[#F5EFE6] dark:bg-[#1A1208]">
              <h2 className="text-base sm:text-lg font-semibold text-[#2C1A0E] dark:text-[#F0E6D3] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                    <div>
                      <p className="text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] capitalize">
                        {activity.action} a book
                      </p>
                      <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                        Book ID: {activity.book_id}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                    {formatDate(activity.action_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setIsEditeProfile(true)}
            className="flex-1 py-3 px-4 sm:px-6 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] font-semibold rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            Edit Profile
          </button>
          <button
            onClick={() => setIsEditePass(true)}
            className="flex-1 py-3 px-4 sm:px-6 border border-[#DDD0B8] dark:border-[#4A3520] bg-white dark:bg-[#231608] text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            Change Password
          </button>
        </div>

        {/* Modals */}
        {isEditeProfile && (
          <EditeProfile
            onClose={() => setIsEditeProfile(false)}
            updateProfile={handleUpdateProfile}
          />
        )}
        {isEditePass && (
          <EditePass
            onClose={() => setIsEditePass(false)}
            updateProfile={handleUpdatePassword}
          />
        )}
      </div>
    </div>
  );
}
