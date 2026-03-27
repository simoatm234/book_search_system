import { useSelector } from 'react-redux';
import { Api } from '../../Api';
import { useBook } from '../Dispatches/BookDispatch';
import { useNotif } from '../Dispatches/NotifDispatch';

const baseUrl = import.meta.env.VITE_BACK_END_URL_FILES;

export const useGlobalFunction = () => {
  const { showMessage } = useNotif();
  const { getBook } = useBook();

  const getBookInfo = async (bookId) => {
    try {
      await getBook(bookId);
      showMessage({
        message: 'book retrived ',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: '',
        type: 'error',
      });
    }
  };

  const getFileAndCober = (book) => {
    const hasFiles = !!book.files;
    const bookFile = hasFiles ? book.files : null;

    const coverUrl = bookFile?.cover_path
      ? `${baseUrl}storage/${bookFile.cover_path}`
      : book.formats?.['image/jpeg']
        ? book.formats['image/jpeg']
        : null;

    const fileUrl = bookFile?.file_path
      ? `${baseUrl}storage/${bookFile.file_path}`
      : null;

    return { coverUrl, fileUrl };
  };

  const DownloadBook = async (bookId, fileName) => {
    try {
      const response = await Api.setUserBookDownload(bookId);
      const blob = response.data;

      if (!blob || blob.size === 0) {
        throw new Error('Empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'book';
      link.click();

      showMessage({
        message: 'Download started successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showMessage({
        message: 'Download failed!',
        type: 'error',
      });
    }
  };
  const addToMyBooks = (bookId) => {
    console.log(bookId);
  };

  return {
    getFileAndCober,
    DownloadBook,
    getBookInfo,
    addToMyBooks,
  };
};
