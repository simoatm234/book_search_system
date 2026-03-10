import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, BookOpen } from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { Api } from '../../Services/App/Api';
import  Notification  from '../../components/Notification';

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const { showMessage } = useNotif();
  const handelCheckEmail = async (data) => {
    try {
      const res = await Api.checkEmail(data);
      if (res.status == 200 || res.status == 201) {
        setIsValid(true);
        return;
      }
      showMessage({
        message: res.data.message,
        type: 'error',
      });
    } catch (error) {
      const status = error.response?.status;
      showMessage({
        message:
          status === 422
            ? 'No account found with this email address'
            : error?.response?.data?.message || 'Account not found',
        type: 'error',
      });
    }
  };

  const handelForgotPassword = async (data) => {
    try {
      const res = await Api.sendResetPasscode(data);
      if (res.status == 200 || res.status == 201) {
        showMessage({
          message: res.data.message,
          type: 'success',
        });
        navigate('/Confirme-code', { state: { email: data.email } });
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
              Forgot Password
            </h1>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1 text-center">
              {isValid
                ? 'Your email is verified — send the reset code'
                : "Enter your email and we'll verify your account"}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#8B5E3C] dark:bg-[#C9A87C] text-white dark:text-[#1A1208]">
                1
              </div>
              <span className="text-xs font-medium text-[#8B5E3C] dark:text-[#C9A87C]">
                Verify Email
              </span>
            </div>
            <div
              className={`flex-1 h-px ${isValid ? 'bg-[#8B5E3C] dark:bg-[#C9A87C]' : 'bg-[#DDD0B8] dark:bg-[#4A3520]'} transition-colors duration-500`}
            />
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span
                className={`text-xs font-medium ${isValid ? 'text-[#8B5E3C] dark:text-[#C9A87C]' : 'text-[#A0856A] dark:text-[#6A5040]'} transition-colors duration-300`}
              >
                Send Code
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300
                ${
                  isValid
                    ? 'bg-[#8B5E3C] dark:bg-[#C9A87C] text-white dark:text-[#1A1208]'
                    : 'bg-[#EDE4D3] dark:bg-[#2C1F10] text-[#A0856A] dark:text-[#6A5040] border border-[#DDD0B8] dark:border-[#4A3520]'
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* ── Step 1: Check Email ── */}
          {!isValid && (
            <form
              onSubmit={handleSubmit(handelCheckEmail)}
              className="space-y-5"
            >
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
                    Checking...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              <p className="text-center text-sm text-[#A0856A] dark:text-[#6A5040]">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-[#8B5E3C] dark:text-[#C9A87C] font-semibold hover:text-[#6B3F22] dark:hover:text-[#F0D0A0] hover:underline transition"
                >
                  Back to login
                </Link>
              </p>
            </form>
          )}

          {/* ── Step 2: Send Reset Code ── */}
          {isValid && (
            <form
              onSubmit={handleSubmit(handelForgotPassword)}
              className="space-y-5"
            >
              {/* Email readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#DDD0B8] dark:border-[#4A3520] bg-[#EDE4D3] dark:bg-[#2C1F10] opacity-70 cursor-not-allowed">
                  <Mail className="w-4 h-4 flex-shrink-0 text-[#8B5E3C] dark:text-[#C9A87C]" />
                  <input
                    type="email"
                    {...register('email')}
                    readOnly
                    className="w-full bg-transparent outline-none text-[#2C1A0E] dark:text-[#F0E6D3] text-sm cursor-not-allowed"
                  />
                </div>
              </div>

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
                    Sending...
                  </>
                ) : (
                  'Send Code'
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsValid(false)}
                className="w-full py-2.5 rounded-xl border border-[#DDD0B8] dark:border-[#4A3520] text-sm font-medium text-[#8B5E3C] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition duration-200"
              >
                ← Use different email
              </button>
            </form>
          )}
        </div>
        <Notification />
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
