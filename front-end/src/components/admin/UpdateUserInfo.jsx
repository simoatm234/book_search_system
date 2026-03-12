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
        isAuth: data.isAuth,
        confirmed: data.confirmed,
      };

      // Only include password if provided
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      // Simulate API call - replace with actual update logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating user:', id, updateData);

      onClose();
      reset();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  // Don't render anything if no user - but don't call onClose during render
  if (!user) {
    return null; // Return null instead of showing error modal immediately
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#231608] rounded-2xl shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] p-4 sm:p-6 flex items-center justify-between rounded-t-2xl z-10">
     
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-6"
        >
          {/* Current User Info Preview */}
          <div className="bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl p-4 border border-[#DDD0B8] dark:border-[#4A3520]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {user.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3] truncate">
                    {user.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize whitespace-nowrap ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] truncate">
                  ID: #{user.id}
                </p>
              </div>
            </div>
          </div>

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
                  <option value="librarian">Librarian</option>
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
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-xl border border-[#DDD0B8] dark:border-[#4A3520]">
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    {...register('isAuth')}
                    className="peer sr-only"
                    id="isAuth"
                  />
                  <label
                    htmlFor="isAuth"
                    className="absolute inset-0 cursor-pointer rounded-full bg-[#DDD0B8] dark:bg-[#4A3520] peer-checked:bg-emerald-600 transition-colors duration-200"
                  >
                    <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-6" />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] truncate">
                    Authorized
                  </p>
                  <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] truncate">
                    Can access system
                  </p>
                </div>
              </div>

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

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
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
