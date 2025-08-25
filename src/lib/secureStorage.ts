import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_PLAYER_SECURE_STORAGE_KEY!; 

export const secureStorage = {
  setItem: (key: string, value: any) => {
    const stringValue = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  },

  getItem: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
