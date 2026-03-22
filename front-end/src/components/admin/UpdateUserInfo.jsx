import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import {
  X,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Save,
  AlertCircle,
  AtSign,
  Key,
} from 'lucide-react';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

// Validation schema
const updateUserSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['user', 'librarian', 'admin'], 'Invalid role selected'),

  isAuth: yup.boolean(),
  confirmed: yup.boolean(),

  // Optional password fields for password change
  password: yup
    .string()
    .nullable()
    .notRequired()
    .transform((value) => (value === '' ? null : value))
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  confirmPassword: yup
    .string()
    .nullable()
    .notRequired()
    .transform((value) => (value === '' ? null : value))
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function UpdateUserInfo({ id, onClose }) {
  const { users } = useSelector((state) => state.user);
  const { UpdateUser } = useUser();
  const { showMessage } = useNotif();
  const user = users?.find((u) => u.id === id);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'user',
      isAuth: false,
      confirmed: false,
      password: '',
      confirmPassword: '',
    },
  });

  // Populate form with user data when component mounts
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('username', user.username || '');
      setValue('email', user.email || '');
      setValue('role', user.role || 'user');
      setValue('isAuth', user.is_auth || false);
      setValue('confirmed', user.confirmed || false);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Filter out empty password fields
      const updateData = {
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        confirmed: data.confirmed,
      };

      // Only include password if provided
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      // Pass the filtered updateData
      const res = await UpdateUser({ id, data: updateData });

      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User updated successfully!',
          type: 'success',
        });

        // Close and reset after success
        setTimeout(() => {
          onClose();
          reset();
        }, 1500);

        return res;
      } else {
        // Handle API error response
        showMessage({
          message: res?.payload?.message || 'Failed to update user',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update user',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#231608] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-20">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
            Update User Information
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#F5EFE6] dark:hover:bg-[#2C1F10] rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
              Basic Information
            </h3>

            {/* Name Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                    errors.name
                      ? 'border-rose-500 dark:border-rose-500'
                      : 'border-[#DDD0B8] dark:border-[#4A3520]'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                Username <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                <input
                  type="text"
                  {...register('username')}
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                    errors.username
                      ? 'border-rose-500 dark:border-rose-500'
                      : 'border-[#DDD0B8] dark:border-[#4A3520]'
                  }`}
                  placeholder="johndoe_123"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                    errors.email
                      ? 'border-rose-500 dark:border-rose-500'
                      : 'border-[#DDD0B8] dark:border-[#4A3520]'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Role & Status Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
              Role & Status
            </h3>

            {/* Role Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                User Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                <select
                  {...register('role')}
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 appearance-none ${
                    errors.role
                      ? 'border-rose-500 dark:border-rose-500'
                      : 'border-[#DDD0B8] dark:border-[#4A3520]'
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Auth Status */}

              {/* Confirmed Status */}
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    {...register('confirmed')}
                    className="peer sr-only"
                    id="confirmed"
                  />
                  <label
                    htmlFor="confirmed"
                    className="absolute inset-0 cursor-pointer rounded-full bg-[#DDD0B8] dark:bg-[#4A3520] peer-checked:bg-emerald-600 transition-colors duration-200"
                  >
                    <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-6" />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] truncate">
                    Confirmed
                  </p>
                  <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] truncate">
                    Email verified
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                Password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordFields(!showPasswordFields);
                  if (!showPasswordFields) {
                    // Reset password fields when opening
                    setValue('password', '');
                    setValue('confirmPassword', '');
                  }
                }}
                className="text-xs text-[#8B5E3C] dark:text-[#C9A87C] hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors duration-200"
              >
                <Key className="w-3 h-3" />
                {showPasswordFields ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordFields && (
              <div className="space-y-4">
                {/* Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                    <input
                      type="password"
                      {...register('password')}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                        errors.password
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-[#DDD0B8] dark:border-[#4A3520]'
                      }`}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                        errors.confirmPassword
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-[#DDD0B8] dark:border-[#4A3520]'
                      }`}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-[#231608] border-t border-[#DDD0B8] dark:border-[#4A3520] px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 z-20">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 sm:px-6 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] font-semibold rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-[#1A1208] border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  Update User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 sm:px-6 border border-[#DDD0B8] dark:border-[#4A3520] bg-white dark:bg-[#231608] text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] font-semibold rounded-xl transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
