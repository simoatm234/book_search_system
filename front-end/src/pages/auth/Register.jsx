import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, AtSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../Services/App/slice/Dispatches/AuthDispatch';
import { Api } from '../../Services/App/Api';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import Notification from '../../components/Notification';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function Register() {
  const navigate = useNavigate();
  const { showMessage } = useNotif();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  // functions
  const handelRegister = async (data) => {
    try {
      const res = await Api.storeUser(data);
      if (res.status == 200 || res.status == 201) {
        navigate('/login');
        showMessage({
          message: res.data.message,
          type: 'success',
        });
      }
    } catch (error) {
      showMessage({
        message: error?.message || 'somtimse we get an errore pleas try again',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] dark:bg-[#1A1208] relative overflow-hidden px-4 transition-colors duration-300">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#B5936A 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden transition-colors duration-300">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#8B5E3C] dark:bg-[#C9A87C]" />

        <div className="px-10 py-10">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#C9A87C] dark:border-[#6B4423] flex items-center justify-center mb-4 shadow-sm">
              <BookOpen className="text-[#8B5E3C] dark:text-[#C9A87C] w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3] tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1">
              Join the library community
            </p>
          </div>

          {/* Root error */}
          {errors.root && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-2">
                <span>⚠</span> {errors.root.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(handelRegister)} className="space-y-5">
            {/* Name & Username */}
            <div className="grid grid-cols-2 gap-3">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                  Name
                </label>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                  ${
                    errors.name
                      ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus-within:ring-2 focus-within:ring-[#8B5E3C] dark:focus-within:ring-[#C9A87C] focus-within:border-transparent'
                  }`}
                >
                  <User
                    className={`w-4 h-4 flex-shrink-0 ${errors.name ? 'text-red-400' : 'text-[#8B5E3C] dark:text-[#C9A87C]'}`}
                  />
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="John"
                    className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-sm"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <span>⚠</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                  Username
                </label>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                  ${
                    errors.username
                      ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus-within:ring-2 focus-within:ring-[#8B5E3C] dark:focus-within:ring-[#C9A87C] focus-within:border-transparent'
                  }`}
                >
                  <AtSign
                    className={`w-4 h-4 flex-shrink-0 ${errors.username ? 'text-red-400' : 'text-[#8B5E3C] dark:text-[#C9A87C]'}`}
                  />
                  <input
                    type="text"
                    {...register('username')}
                    placeholder="john_99"
                    className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-sm"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <span>⚠</span> {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                Email
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                ${
                  errors.email
                    ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                    : 'border-[#DDD0B8] dark:border-[#4A3520] focus-within:ring-2 focus-within:ring-[#8B5E3C] dark:focus-within:ring-[#C9A87C] focus-within:border-transparent'
                }`}
              >
                <Mail
                  className={`w-4 h-4 flex-shrink-0 ${errors.email ? 'text-red-400' : 'text-[#8B5E3C] dark:text-[#C9A87C]'}`}
                />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@library.com"
                  className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                ${
                  errors.password
                    ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                    : 'border-[#DDD0B8] dark:border-[#4A3520] focus-within:ring-2 focus-within:ring-[#8B5E3C] dark:focus-within:ring-[#C9A87C] focus-within:border-transparent'
                }`}
              >
                <Lock
                  className={`w-4 h-4 flex-shrink-0 ${errors.password ? 'text-red-400' : 'text-[#8B5E3C] dark:text-[#C9A87C]'}`}
                />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-sm"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>
            {/* Password confirmation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                confirme Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                ${
                  errors.password
                    ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                    : 'border-[#DDD0B8] dark:border-[#4A3520] focus-within:ring-2 focus-within:ring-[#8B5E3C] dark:focus-within:ring-[#C9A87C] focus-within:border-transparent'
                }`}
              >
                <Lock
                  className={`w-4 h-4 flex-shrink-0 ${errors.password_confirmation ? 'text-red-400' : 'text-[#8B5E3C] dark:text-[#C9A87C]'}`}
                />
                <input
                  type="password"
                  {...register('password_confirmation')}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-sm"
                />
              </div>
              {errors.password_confirmation && (
                <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                  <span>⚠</span> {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-[#FDFAF4] dark:text-[#1A1208] font-bold rounded-xl tracking-wide shadow-md transition duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#DDD0B8] dark:bg-[#4A3520]" />
              <span className="text-xs text-[#C9A87C] dark:text-[#5A3F25] font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-[#DDD0B8] dark:bg-[#4A3520]" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-[#A0856A] dark:text-[#6A5040]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#8B5E3C] dark:text-[#C9A87C] font-semibold hover:text-[#6B3F22] dark:hover:text-[#F0D0A0] hover:underline transition"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-[#EDE4D3] dark:bg-[#1A1208] border-t border-[#DDD0B8] dark:border-[#4A3520] px-10 py-3 flex justify-center transition-colors duration-300">
          <p className="text-xs text-[#A0856A] dark:text-[#5A3F25] tracking-widest uppercase">
            📚 City Public Library System
          </p>
        </div>
      </div>
      <Notification />
    </div>
  );
}
