/**
 * Storage Service — Abstraction layer cho lưu trữ dữ liệu.
 * Hiện tại dùng localStorage. Có thể thay bằng Supabase hoặc API khác.
 */

import siteConfig from '../config/siteConfig';

const STORAGE_PREFIX = 'alwfh_';

// ── Interface Methods ──

const storageService = {
  /**
   * Gửi email thông báo về hộp thư Gmail
   */
  async sendEmailNotification({ subject, type, content, extra = {} }) {
    const email = siteConfig.notificationEmail;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return;
    }

    try {
      const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(email.trim())}`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: subject || `[Website 20/10] Thông báo mới từ ${siteConfig.herName || 'Em'}`,
          _template: 'table',
          _captcha: 'false',
          'Người gửi': siteConfig.herName || 'Em',
          'Loại thông báo': type,
          'Nội dung': content,
          'Thời gian': new Date().toLocaleString('vi-VN'),
          ...extra,
        }),
      });
    } catch (error) {
      console.warn('Gửi thông báo email không thành công:', error);
    }
  },

  /**
   * Lưu dữ liệu
   * @param {string} key 
   * @param {*} value 
   */
  save(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
      return { success: true };
    } catch (error) {
      console.error('Storage save error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Đọc dữ liệu
   * @param {string} key 
   * @param {*} defaultValue 
   * @returns {*}
   */
  load(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  },

  /**
   * Xoá dữ liệu
   * @param {string} key 
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return { success: true };
    } catch (error) {
      console.error('Storage remove error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Lưu số lần nhập sai mật khẩu
   */
  getFailedAttempts() {
    return this.load('failedAttempts', 0);
  },

  setFailedAttempts(count) {
    return this.save('failedAttempts', count);
  },

  /**
   * Wishes
   */
  getWishes() {
    return this.load('wishes', [null, null, null]);
  },

  saveWishes(wishes, currentWishIndex = null) {
    const res = this.save('wishes', wishes);

    // Gửi email thông báo nếu có điều ước vừa lưu
    if (currentWishIndex !== null && wishes[currentWishIndex]) {
      this.sendEmailNotification({
        subject: `💌 [Website 20/10] ${siteConfig.herName || 'Em'} vừa gửi Điều ước số ${currentWishIndex + 1}!`,
        type: `Điều ước số ${currentWishIndex + 1}`,
        content: wishes[currentWishIndex],
        extra: {
          'Điều ước 1': wishes[0] || '(Chưa điền)',
          'Điều ước 2': wishes[1] || '(Chưa điền)',
          'Điều ước 3': wishes[2] || '(Chưa điền)',
        },
      });
    }

    return res;
  },

  /**
   * Feedback / Góp ý
   */
  getFeedback() {
    return this.load('feedback', null);
  },

  saveFeedback(text = 'Góp ý cái gièeeeeeee') {
    const res = this.save('feedback', text);

    if (text) {
      this.sendEmailNotification({
        subject: `💌 [Website 20/10] Góp ý bức thư từ ${siteConfig.herName || 'Em'}!`,
        type: 'Góp ý bức thư',
        content: text,
      });
    }

    return res;
  },

  /**
   * Trạng thái đã mở khóa
   */
  getUnlocked() {
    return this.load('unlocked', false);
  },

  setUnlocked(value) {
    return this.save('unlocked', value);
  },
};

export default storageService;
