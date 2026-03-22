import React from 'react';
import { useSelector } from 'react-redux';
import {
  X,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  AtSign,
  Globe,
  AlertCircle,
} from 'lucide-react';

export default function ViewUserDetail({ id, onClose }) {
  const { users } = useSelector((state) => state.user);
  const user = users?.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#231608] rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#2C1A0E] dark:text-[#F0E6D3] mb-2">
              User Not Found
            </h3>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mb-4">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] font-semibold rounded-xl transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#231608] rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-20">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            User Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#F5EFE6] dark:hover:bg-[#2C1F10] rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {user.name || 'N/A'}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize inline-block mx-auto sm:mx-0 ${getRoleColor(user.role)}`}
                >
                  {user.role || 'user'}
                </span>
              </div>
              <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mb-3">
                @{user.username || 'N/A'}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    user.is_auth
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {user.is_auth ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      user.is_auth
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {user.is_auth ? 'Authorized' : 'Unauthorized'}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    user.confirmed
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {user.confirmed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      user.confirmed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {user.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID Card */}
            <div className="bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl p-4 border border-[#DDD0B8] dark:border-[#4A3520]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  User ID
                </h3>
              </div>
              <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3] font-mono bg-white dark:bg-[#231608] p-2 rounded-lg border border-[#DDD0B8] dark:border-[#4A3520]">
                {user.id || 'N/A'}
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl p-4 border border-[#DDD0B8] dark:border-[#4A3520]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  Email Address
                </h3>
              </div>
              <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3] bg-white dark:bg-[#231608] p-2 rounded-lg border border-[#DDD0B8] dark:border-[#4A3520] break-all">
                {user.email || 'N/A'}
              </p>
            </div>

            {/* Username Card */}
            <div className="bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl p-4 border border-[#DDD0B8] dark:border-[#4A3520]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
                  <AtSign className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  Username
                </h3>
              </div>
              <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3] bg-white dark:bg-[#231608] p-2 rounded-lg border border-[#DDD0B8] dark:border-[#4A3520]">
                @{user.username || 'N/A'}
              </p>
            </div>

            {/* Role Card */}
            <div className="bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl p-4 border border-[#DDD0B8] dark:border-[#4A3520]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  Role
                </h3>
              </div>
              <div className="bg-white dark:bg-[#231608] p-2 rounded-lg border border-[#DDD0B8] dark:border-[#4A3520]">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize inline-block ${getRoleColor(user.role)}`}
                >
                  {user.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
              Activity Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Created At */}
              <div className="flex items-start gap-3 p-3 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                <Calendar className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                    Created At
                  </p>
                  <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                    {formatDate(user.created_at)}
                  </p>
                  <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                    {formatRelativeTime(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex items-start gap-3 p-3 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                <Clock className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                    {formatDate(user.updated_at)}
                  </p>
                  <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                    {formatRelativeTime(user.updated_at)}
                  </p>
                </div>
              </div>

              {/* Last Login */}
              {user.last_login_at && (
                <div className="flex items-start gap-3 p-3 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                  <Globe className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                      Last Login
                    </p>
                    <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {formatDate(user.last_login_at)}
                    </p>
                    <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                      {formatRelativeTime(user.last_login_at)}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Logout */}
              {user.last_logout_at && (
                <div className="flex items-start gap-3 p-3 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                  <Globe className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                      Last Logout
                    </p>
                    <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {formatDate(user.last_logout_at)}
                    </p>
                    <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                      {formatRelativeTime(user.last_logout_at)}
                    </p>
                  </div>
                </div>
              )}

              {/* Token Expires */}
              {user.token_expires_at && (
                <div className="flex items-start gap-3 p-3 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                  <Clock className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#A0856A] dark:text-[#8A6A4A] uppercase tracking-widest mb-1">
                      Token Expires
                    </p>
                    <p className="text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {formatDate(user.token_expires_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Verification */}
          {user.email_verified_at && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Email Verified
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">
                    {formatDate(user.email_verified_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Deleted At - Show if user is deleted */}
          {user.deleted_at && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                    Account Deleted
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-500">
                    {formatDate(user.deleted_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-[#231608] border-t border-[#DDD0B8] dark:border-[#4A3520] px-4 sm:px-6 py-4 flex justify-end z-20">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[#DDD0B8] dark:border-[#4A3520] bg-white dark:bg-[#231608] text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#F5EFE6] dark:hover:bg-[#2C1F10] font-semibold rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
