import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../../Services/App/Api';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react';

export default function AccountConfirmation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showMessage } = useNotif();

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const hasRun = useRef(false); // ✅ prevent multiple API calls in dev strict mode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const confirmAccount = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const res = await Api.confirmAccount(token);

        if (res.status === 200 || res.status === 201) {
          setStatus('success');
          setMessage(res.data.message || 'Account confirmed successfully!');

          showMessage({
            message: res.data.message,
            type: 'success',
          });

          // countdown before redirect
          let count = 3;
          const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
              clearInterval(timer);
              navigate('/login');
            }
          }, 1000);
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (error) {
        setStatus('error');
        const errorMessage =
          error?.response?.data?.message ||
          'Failed to confirm account. Please try again.';

        setMessage(errorMessage);

        showMessage({
          message: errorMessage,
          type: 'error',
        });

        setTimeout(() => navigate('/login'), 5000);
      }
    };

    confirmAccount();
  }, [token, navigate, showMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0E6] dark:bg-[#1A1208] px-4 transition-colors duration-300">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#B5936A 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#8B5E3C] dark:bg-[#C9A87C]" />

        <div className="px-10 py-12">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#C9A87C] dark:border-[#6B4423] flex items-center justify-center mb-4 shadow-sm">
              <BookOpen className="text-[#8B5E3C] dark:text-[#C9A87C] w-8 h-8" />
            </div>
            <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] tracking-widest uppercase">
              Account Verification
            </p>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <Loader2 className="w-16 h-16 text-[#8B5E3C] dark:text-[#C9A87C] animate-spin" />
            )}

            {status === 'success' && (
              <div className="w-20 h-20 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full flex items-center justify-center border-2 border-green-500 dark:border-green-600 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
              </div>
            )}

            {status === 'error' && (
              <div className="w-20 h-20 bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full flex items-center justify-center border-2 border-red-500 dark:border-red-600 shadow-lg">
                <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-[#2C1A0E] dark:text-[#F0E6D3] tracking-tight mb-3">
            {status === 'verifying' && 'Verifying Account'}
            {status === 'success' && 'Account Confirmed!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="text-center text-[#A0856A] dark:text-[#8A6A4A] text-sm mb-6 leading-relaxed">
            {status === 'verifying'
              ? 'Please wait while we verify your email address...'
              : message}
          </p>

          {/* Success / Error Actions */}
          {(status === 'success' || status === 'error') && (
            <div className="space-y-4">
              <div
                className={`rounded-xl p-4 text-center border ${
                  status === 'success'
                    ? 'bg-[#EDE4D3] border-[#C9A87C]'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    status === 'success'
                      ? 'text-[#2C1A0E] dark:text-[#C9A87C]'
                      : 'text-red-800 dark:text-red-300'
                  }`}
                >
                  Redirecting to login in{' '}
                  {status === 'success' ? (
                    <span className="text-[#8B5E3C] dark:text-[#F0D0A0] font-bold text-lg">
                      {countdown}
                    </span>
                  ) : (
                    '5'
                  )}{' '}
                  seconds...
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#8B5E3C] dark:bg-[#C9A87C] hover:bg-[#6B3F22] dark:hover:bg-[#B08B5A] active:scale-95 text-[#FDFAF4] dark:text-[#1A1208] font-bold rounded-xl tracking-wide shadow-md transition duration-200"
              >
                Go to Login Now
              </button>
            </div>
          )}

          {/* Verifying Progress Bar */}
          {status === 'verifying' && (
            <div className="mt-6">
              <div className="w-full bg-[#EDE4D3] dark:bg-[#2C1F10] rounded-full h-2 overflow-hidden">
                <div className="bg-[#8B5E3C] dark:bg-[#C9A87C] h-full rounded-full animate-pulse w-2/3 transition-all duration-300"></div>
              </div>
            </div>
          )}
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
