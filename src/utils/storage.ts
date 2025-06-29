export const STORAGE_KEYS = {
  SELECTED_MENU_ITEMS: 'selectedMenuItems',
  AUTH_TOKEN: 'authToken',
  USER_ID: 'userId',
  USERNAME: 'username',
  SELECTED_THALI: 'selectedThali',
  SELECTED_ITEM: 'selectedItem',
  TOKEN: 'token',
};

// Safe localStorage access that works during SSR
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

export const storageService = {
  saveSelectedItems: (items: Record<string, { quantity: number; butter: boolean }>) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.SELECTED_MENU_ITEMS, JSON.stringify(items));
    }
  },

  getSelectedItems: (): Record<string, { quantity: number; butter: boolean }> => {
    const storage = getLocalStorage();
    if (storage) {
      const items = storage.getItem(STORAGE_KEYS.SELECTED_MENU_ITEMS);
      return items ? JSON.parse(items) : {};
    }
    return {};
  },

  clearSelectedItems: () => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.SELECTED_MENU_ITEMS);
    }
  },

  // Auth-related storage methods
  getAuthToken: (): string | null => {
    const storage = getLocalStorage();
    return storage ? storage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
  },

  setAuthToken: (token: string) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  removeAuthToken: () => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  getUserId: (): string | null => {
    const storage = getLocalStorage();
    return storage ? storage.getItem(STORAGE_KEYS.USER_ID) : null;
  },

  setUserId: (userId: string) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
  },

  removeUserId: () => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.USER_ID);
    }
  },

  getUsername: (): string | null => {
    const storage = getLocalStorage();
    return storage ? storage.getItem(STORAGE_KEYS.USERNAME) : null;
  },

  setUsername: (username: string) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.USERNAME, username);
    }
  },

  removeUsername: () => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.USERNAME);
    }
  },

  // Clear all auth data
  clearAuthData: () => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER_ID);
      storage.removeItem(STORAGE_KEYS.USERNAME);
    }
  },

  // Generic localStorage methods
  getItem: (key: string): string | null => {
    const storage = getLocalStorage();
    return storage ? storage.getItem(key) : null;
  },

  setItem: (key: string, value: string) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(key, value);
    }
  },

  removeItem: (key: string) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(key);
    }
  },
}; 