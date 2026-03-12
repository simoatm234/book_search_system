import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, User, AtSign, X } from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
});

export default function EditeProfile({ onClose, updateProfile }) {
  const { user } = useSelector((state) => state.auth);
  const { showMessage } = useNotif();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await updateProfile(data);
      reset();
      location.reload();
      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage({
        message: error?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300">
          {/* Header */}
          <div className="bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition-colors"
            >
              <X className="w-6 h-6 text-[#8B5E3C] dark:text-[#C9A87C]" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Avatar */}
            <div className="flex justify-center pb-6 border-b border-[#DDD0B8] dark:border-[#4A3520]">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {avatarLetter}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.name
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.name.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="text"
                  {...register('username')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.username
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.email
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[#DDD0B8] dark:border-[#4A3520]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-[#DDD0B8] dark:border-[#4A3520] bg-white dark:bg-[#231608] text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] font-semibold rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-[#1A1208] font-semibold rounded-xl transition-colors duration-200 shadow-md"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
