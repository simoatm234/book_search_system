import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { Api } from '../../Services/App/Api';

const schema = yup.object({
  token: yup
    .string()
    .required('Code is required')
    .matches(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export default function ConfirmCode() {
  const { showMessage } = useNotif();
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const handelConfirmCode = async (data) => {
    try {
      const res = await Api.confirmCodeReset({ ...data, email });
      if (res.status == 200 || res.status == 201) {
        showMessage({
          message: res.data.message || 'Code confirmed successfully',
          type: 'success',
        });
        navigate('/reset-password', { state: { email, token: data.token } });
      }
    } catch (error) {
      showMessage({
        message: error?.response?.data?.message || 'Invalid or expired code',
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
              Confirm Code
            </h1>
            <p className="text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1 text-center">
              Enter the 6-digit code sent to{' '}
              <span className="font-semibold text-[#8B5E3C] dark:text-[#C9A87C]">
                {email}
              </span>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handelConfirmCode)}
            className="space-y-5"
          >
            {/* Code input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2C1A0E] dark:text-[#C9A87C] uppercase tracking-widest">
                Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                {...register('token')}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6);
                }}
                placeholder="000000"
                className={`w-full px-4 py-3 rounded-xl border bg-[#F4F0E6] dark:bg-[#1A1208] text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#C9A87C] dark:placeholder-[#5A3F25] text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                  ${
                    errors.token
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-[#DDD0B8] dark:border-[#4A3520] focus:ring-[#8B5E3C] dark:focus:ring-[#C9A87C]'
                  }`}
              />
              {errors.token && (
                <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                  <span>⚠</span> {errors.token.message}
                </p>
              )}
            </div>

            {/* Confirm Button */}
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
                  Confirming...
                </>
              ) : (
                'Confirm Code'
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
