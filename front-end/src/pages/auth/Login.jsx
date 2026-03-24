import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Services/App/slice/AsyncThunks/AuthThunks'; // Update path
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import Notification from '../../components/Notification';
import { useAuth } from './../../Services/App/slice/Dispatches/AuthDispatch';

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { showMessage } = useNotif();
  const { login, showUser } = useAuth();
  const { isAuth, token, loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuth && token && userId) {
        await showUser(userId);
        if (user) {
          navigate('/SheckAuthPage', { replace: true });
        }
        localStorage.removeItem('token');
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (data) => {
    try {
      const result = await login(data);
      if (result.payload.success ) {
        showMessage({
          message: 'Login successful',
          type: 'success',
        });
        // Navigate to auth check page which routes based on user role
        navigate('/SheckAuthPage', { replace: true });
      } else {
        showMessage({
          message: result.payload || 'Login failed',
          type: 'warning',
        });
      }
    } catch (error) {
      showMessage({
        message: error.message || 'An error occurred',
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
              Library Portal
            </h1>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1">
              Sign in to access your shelf
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[#8B5E3C] dark:text-[#C9A87C] hover:text-[#6B3F22] dark:hover:text-[#F0D0A0] hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-[#FDFAF4] dark:text-[#1A1208] font-bold rounded-xl tracking-wide shadow-md transition duration-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#DDD0B8] dark:bg-[#4A3520]" />
              <span className="text-xs text-[#C9A87C] dark:text-[#5A3F25] font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-[#DDD0B8] dark:bg-[#4A3520]" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-[#A0856A] dark:text-[#6A5040]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#8B5E3C] dark:text-[#C9A87C] font-semibold hover:text-[#6B3F22] dark:hover:text-[#F0D0A0] hover:underline transition"
              >
                Register here
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
