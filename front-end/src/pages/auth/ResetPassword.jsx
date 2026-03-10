import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Lock } from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { Api } from '../../Services/App/Api';

const schema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export default function ResetPassword() {
  const { showMessage } = useNotif();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const token = location.state?.token;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const handelResetPassword = async (data) => {
    try {
      const res = await Api.resetPassword({ ...data, email, token });
      if (res.status == 200 || res.status == 201) {
        showMessage({
          message: res.data.message || 'Password reset successfully',
          type: 'success',
        });
        navigate('/login');
      }
    } catch (error) {
      showMessage({
        message: error?.response?.data?.message || 'Something went wrong',
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
              Reset Password
            </h1>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1 text-center">
              Enter your new password for{' '}
              <span className="font-semibold text-[#8B5E3C] dark:text-[#C9A87C]">
                {email}
              </span>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handelResetPassword)}
            className="space-y-5"
          >
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                New Password
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                Confirm Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] transition-all
                ${
                  errors.password_confirmation
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
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Back to login */}
            <p className="text-center text-sm text-[#A0856A] dark:text-[#6A5040]">
              <Link
                to="/login"
                className="text-[#8B5E3C] dark:text-[#C9A87C] font-semibold hover:text-[#6B3F22] dark:hover:text-[#F0D0A0] hover:underline transition"
              >
                ← Back to login
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
    </div>
  );
}
