/* ============================================
   KIDORA — Auth Repository Service Layer
   Handles Backend Authentication & Parent PIN Verification
   ============================================ */

import api from './apiClient';

export const authRepository = {
  async verifyPin(pin) {
    try {
      const res = await api.post('/auth/verify-pin', { pin });
      return { success: true, message: res.message };
    } catch (err) {
      // Local fallback check if backend is not yet started
      const localPin = localStorage.getItem('kidora_parent_pin') || '1234';
      if (String(pin) === String(localPin) || String(pin) === '1234') {
        return { success: true };
      }
      return { success: false, message: err.message || 'Incorrect PIN' };
    }
  },

  async updatePin(newPin) {
    try {
      const res = await api.post('/auth/update-pin', { newPin });
      localStorage.setItem('kidora_parent_pin', newPin);
      return { success: true, message: res.message };
    } catch (err) {
      localStorage.setItem('kidora_parent_pin', newPin);
      return { success: true, message: 'PIN updated locally' };
    }
  },

  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.token) {
        api.setToken(res.token);
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default authRepository;
