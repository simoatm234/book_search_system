import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, X } from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

const schema = yup.object({
  current_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  new_password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('new_password')], 'Passwords must match'),
});

export default function EditePass({ onClose, updateProfile }) {
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
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Only send new_password and new_password_confirmation  to API
      await updateProfile(data);
      reset();
      location.reload();
      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      console.error('Password change error:', error);
      showMessage({
        message: error?.message || 'Failed to change password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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
              Change Password
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
            {/* Info */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Make sure to use a strong password with a mix of letters,
                numbers, and symbols.
              </p>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="password"
                  {...register('current_password')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.current_password
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.current_password.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="password"
                  {...register('new_password')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.new_password
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] dark:text-[#C9A87C] mb-2 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
                <input
                  type="password"
                  {...register('new_password_confirmation')}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] transition-all
                  ${
                    errors.new_password_confirmation
                      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-2 focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C] focus:border-transparent'
                  }`}
                />
              </div>
              {errors.new_password_confirmation && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ {errors.new_password_confirmation.message}
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
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
