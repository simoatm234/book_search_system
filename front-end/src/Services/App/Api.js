import { customAxios } from './axios';

export const Api = {
  getCsrfCookie: async () => await customAxios.get('sanctum/csrf-cookie'),
  me: async () => await customAxios.get('user/me'),
  // Users
  fetchAllUsers: async () => await customAxios.get('user/all'),
  fetchAllUsersTrashed: async () => await customAxios.get('user/all/trashed'),
  fetchAllActions: async () => await customAxios.get('user/actions'),
  showUser: async (id) => await customAxios.get(`user/show/${id}`),
  storeUser: async (data) => await customAxios.post('user/store', data),
  updateUser: async ({ id, data }) =>
    await customAxios.put(`user/update/${id}`, data),
  updateUserPass: async ({ id, data }) =>
    await customAxios.put(`user/updatePass/${id}`, data),
  forcDeleteUser: async (id) =>
    await customAxios.delete(`user/forceDelete/${id}`),
  deleteUser: async (id) => await customAxios.delete(`user/delete/${id}`),
  restorUser: async (id) => {
    const res = await customAxios.post(`user/restore/${id}`);
    console.log(res);
    return res;
  },
  confirmAccount: async (token) =>
    await customAxios.get('user/confirm-email', { params: { token } }),
  resendConfirmationEmail: async (data) =>
    await customAxios.get('user/resend-email-confirmation', { params: data }),

  // Auth
  login: async (data) => await customAxios.post('user/login', data),
  logout: async (id) => await customAxios.post(`user/logout/${id}`),

  // Password Reset
  checkEmail: async (data) => {
    const res = await customAxios.post('user/check-email', data);
    console.log(res);
    return res;
  },
  sendResetPasscode: async (data) =>
    await customAxios.post('user/send-reset-code', data),
  confirmCodeReset: async (data) =>
    await customAxios.post('user/confirme-code-reset-pass', data),
  resetPassword: async (data) =>
    await customAxios.post('user/reset-password', data),
  // books
  allBooks: async () => await customAxios.get('books/all'),
  showBook: async (bookId) => customAxios.get(`books/show/${bookId}`),
  showBookFile: async (bookFileId) =>
    await customAxios.get(`booksFiles/show/${bookFileId}`),
  getBookCover: async (filename) =>
    await customAxios.get(`booksFiles/cover/${filename}`),
};
