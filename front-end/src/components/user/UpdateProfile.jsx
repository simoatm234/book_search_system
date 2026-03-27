import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useAuth } from '../../Services/App/slice/Dispatches/AuthDispatch';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscore'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
});

// Animation variants for error messages
const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function UpdateProfile({ onClose }) {
  const { showMessage } = useNotif();
  const { user } = useSelector((state) => state.auth);
  const { UpdateUser } = useUser();
  const { updateUserAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        name: data.name,
        username: data.username,
        email: data.email,
      };

      const res = await UpdateUser({ id: user?.id, data: updateData });

      if (res?.payload?.success) {
        updateUserAuth({ id: user?.id, data: updateData });
        showMessage({
          message: 'Profile updated successfully!',
          type: 'success',
        });
      }
      onClose?.(); // close dropdown after success
    } catch (error) {
      showMessage({
        message: error?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 space-y-5"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          Full Name
        </label>
        <input
          {...register('name')}
          type="text"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          Username
        </label>
        <input
          {...register('username')}
          type="text"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.username
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.username && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.username.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          className={`w-full px-4 py-3 sm:py-2 bg-white dark:bg-[#1A1208] border rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#DDD0B8] dark:border-[#4A3520]'
          }`}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-sm text-red-500"
            >
              {errors.email.message}
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
          className="w-full sm:w-auto px-6 py-3 sm:py-2 text-sm font-medium bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4A2E] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </motion.form>
  );
}
