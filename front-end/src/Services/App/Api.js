import { customAxios } from './axios';

export const Api = {
  getCsrfCookie: async () => await customAxios.get('sanctum/csrf-cookie'),
  me: async () => await customAxios.get('user/me'),
  // Users
  fetchAllUsers: async () => await customAxios.get('user/all'),
  showUser: async (id) => await customAxios.get(`user/show/${id}`),
  storeUser: async (data) => await customAxios.post('user/store', data),
  updateUser: async (id, data) =>
    await customAxios.put(`user/update/${id}`, data),
  deleteUser: async (id) => await customAxios.delete(`user/delete/${id}`),
  confirmAccount: async (token) =>
    await customAxios.get('user/confirm-email', { params: { token } }),
  resendConfirmationEmail: async (data) =>
    await customAxios.get('user/resend-email-confirmation', { params: data }),

  // Auth
  login: async (data) => await customAxios.post('user/login', data),
  logout: async (id) => await customAxios.post(`user/logout/${id}`),

  // Password Reset
  checkEmail: async (data) => await customAxios.post('user/check-email', data),
  sendResetPasscode: async (data) =>
    await customAxios.post('user/send-reset-code', data),
  confirmCodeReset: async (data) =>
    await customAxios.post('user/confirme-code-reset-pass', data),
  resetPassword: async (data) =>
    await customAxios.post('user/reset-password', data),
};
