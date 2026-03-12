import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNotif } from '../Services/App/slice/Dispatches/NotifDispatch';

export default function Notification() {
  const { message, type } = useSelector((state) => state.notification);
  const { clearMessage } = useNotif();

  setTimeout(() => {
    clearMessage();
  }, 3000);

  if (!message) return null;

  const styles = {
    success:
      'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300',
    error:
      'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
    warning:
      'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300',
    info: 'bg-[#EDE4D3] border-[#C9A87C] text-[#8B5E3C] dark:bg-[#2C1F10] dark:border-[#6B4423] dark:text-[#C9A87C]',
  };

  return (
    <>
      {message && (
        <div
          className={`fixed top-5 right-5 z-100 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-md max-w-xs transition-all duration-300 ${styles[type] ?? styles.info}`}
        >
          {message}
        </div>
      )}
    </>
  );
}
