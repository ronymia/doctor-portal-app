import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryStorage: Record<string, string> = {};

export const appStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // 1. Web environment direct adapter
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      }

      // 2. Native Expo SecureStore encryption (Keychain / Keystore)
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        return await SecureStore.getItemAsync(key);
      }

      // Fallback if SecureStore is not available
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch (error: any) {
      console.warn('appStorage.getItem warning: SecureStore failed, falling back to memory/local.', error?.message);
      
      // Fallback
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      }

      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.setItemAsync(key, value);
        return;
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (error: any) {
      console.warn('appStorage.setItem warning: SecureStore failed, falling back to memory/local.', error?.message);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      }

      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.deleteItemAsync(key);
        return;
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } catch (error: any) {
      console.warn('appStorage.removeItem warning: SecureStore failed, falling back to memory/local.', error?.message);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    }
  },
};

export default appStorage;
