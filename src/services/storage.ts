import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const memoryStorage: Record<string, string> = {};

const appStorage = {
  // GET ITEM FROM STORAGE
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    }

    try {
      return await SecureStore.getItemAsync(key);
    } catch (error: any) {
      console.warn(
        "appStorage.getItem warning: SecureStore failed, falling back to memory/local.",
        error?.message,
      );

      // Fallback if SecureStore fails
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    }
  },

  // SET ITEM IN STORAGE
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      memoryStorage[key] = value;
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error: any) {
      console.warn(
        "appStorage.setItem warning: SecureStore failed, falling back to memory/local.",
        error?.message,
      );

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    }
  },

  // REMOVE ITEM FROM STORAGE
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      delete memoryStorage[key];
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error: any) {
      console.warn(
        "appStorage.removeItem warning: SecureStore failed, falling back to memory/local.",
        error?.message,
      );

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    }
  },
};

export default appStorage;
