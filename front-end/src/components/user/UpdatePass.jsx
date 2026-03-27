import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useSelector } from 'react-redux';
// import { updatePassword } from '../../Services/App/slice/AsyncThunks/AuthThunks';

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

export default function UpdatePass({ onClose }) {
  const { showMessage } = useNotif();
  const { updateUserPass } = useUser();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'onBlur',
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
      const res = await updateUserPass({ id: user.id, data });
      console.log(res);
      if (res?.payload.success) {
        showMessage({
          message: res?.payload.message,
          type: 'success',
        });
      } else {
           showMessage({
             message: res?.payload,
             type: 'error',
           });
      }
      reset();
      onClose?.();
    } catch (error) {
      showMessage({
        message: 'Failed to update password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation for error messages
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          Current Password
        </label>
        <input
          {...register('current_password')}
          type="password"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.current_password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.current_password && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.current_password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          New Password
        </label>
        <input
          {...register('new_password')}
          type="password"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.new_password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.new_password && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.new_password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          Confirm New Password
        </label>
        <input
          {...register('new_password_confirmation')}
          type="password"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.new_password_confirmation
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.new_password_confirmation && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.new_password_confirmation.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-[#A0856A] hover:text-[#8B5E3C] transition border border-[#DDD0B8] sm:border-none rounded-lg sm:rounded-none"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !isDirty}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 text-sm font-medium bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
    </form>
  );
}
