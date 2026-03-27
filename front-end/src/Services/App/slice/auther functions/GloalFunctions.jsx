import { useSelector } from 'react-redux';
import { Api } from '../../Api';
import { useBook } from '../Dispatches/BookDispatch';
import { useNotif } from '../Dispatches/NotifDispatch';
import { useSave } from '../Dispatches/SaveDispatch';

const baseUrl = import.meta.env.VITE_BACK_END_URL_FILES;

export const useGlobalFunction = () => {
  const { showMessage } = useNotif();
  const { getBook } = useBook();
  const { storeSave, deleteSave } = useSave();

  const getBookInfo = async (bookId) => {
    try {
      const res = await getBook(bookId);
      console.log(res);
      if (res.payload.success) {
        showMessage({
          message: 'book retrived ',
          type: 'success',
        });
      }
    } catch (error) {
      showMessage({
        message: error?.response?.data?.message || 'cannot retrive book',
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
  const AddSave = async (data) => {
    try {
      const res = await storeSave(data);
      if (res.payload.success) {
        showMessage({
          message: 'book add successfuly ',
          type: 'success',
        });
      } else {
        showMessage({
          message: res.payload,
          type: 'wrrong',
        });
      }
    } catch (error) {
      showMessage({
        message: 'save book failed!',
        type: 'error',
      });
    }
  };
  const removeSave = async (saveId) => {
    try {
      const res = await deleteSave(saveId);
      if (res.payload.success) {
        showMessage({
          message: 'book add successfuly ',
          type: 'success',
        });
      } else {
        showMessage({
          message: res.payload,
          type: 'wrrong',
        });
      }
    } catch (error) {
      showMessage({
        message: 'save book failed!',
        type: 'error',
      });
    }
  };

  return {
    getFileAndCober,
    DownloadBook,
    getBookInfo,
    addToMyBooks,
    AddSave,
    removeSave,
  };
};
