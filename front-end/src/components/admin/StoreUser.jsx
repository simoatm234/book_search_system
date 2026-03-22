import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { Api } from '../../Services/App/Api';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';

// Validation schema
const userSchema = yup.object({
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

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['user', 'librarian', 'admin'], 'Invalid role selected'),
  confirmed: yup.boolean(),
});

export default function StoreUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showMessage } = useNotif();
  const { StoreUserFromAdmin } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      isAuth: false,
      confirmed: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await StoreUserFromAdmin(data);

      // Check if the thunk was successful
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User created successfully!',
          type: 'success',
        });

        // Close modal and reset after success
        setTimeout(() => {
          setIsModalOpen(false);
          reset();
        }, 1500);
      } else {
        // Handle API error response
        showMessage({
          message: res?.payload?.message || 'Failed to create user',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showMessage({
        message: error?.message || 'Something went wrong, please try again',
        type: 'error',
      });
    }
  };

  return (
    <>
      {/* Add User Button - Matches AllUsers header style */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] text-sm font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#231608] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header - Matches AllUsers table header */}
            <div className="sticky top-0 bg-[#F5EFE6] dark:bg-[#1A1208] border-b border-[#DDD0B8] dark:border-[#4A3520] p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                    Create New User
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                    Add a new user to the system
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="p-2 hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 sm:p-6 space-y-6"
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
                  <input
                    type="text"
                    {...register('username')}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                      errors.username
                        ? 'border-rose-500 dark:border-rose-500'
                        : 'border-[#DDD0B8] dark:border-[#4A3520]'
                    }`}
                    placeholder="johndoe_123"
                  />
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

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                  Security
                </h3>

                {/* Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1.5 sm:mb-2">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                    <input
                      type="password"
                      {...register('password')}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                        errors.password
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-[#DDD0B8] dark:border-[#4A3520]'
                      }`}
                      placeholder="••••••••"
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
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A0856A] dark:text-[#8A6A4A]" />
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#1A1208] border rounded-xl text-sm sm:text-base text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200 ${
                        errors.confirmPassword
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-[#DDD0B8] dark:border-[#4A3520]'
                      }`}
                      placeholder="••••••••"
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
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                        Confirmed
                      </p>
                      <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                        Email verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 sm:px-6 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] text-white dark:text-[#1A1208] font-semibold rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-[#1A1208] border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Create User
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="flex-1 py-3 px-4 sm:px-6 border border-[#DDD0B8] dark:border-[#4A3520] bg-white dark:bg-[#231608] text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] font-semibold rounded-xl transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
