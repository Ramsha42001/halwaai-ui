export const STORAGE_KEYS = {
  SELECTED_MENU_ITEMS: 'selectedMenuItems',
};

export const storageService = {
  saveSelectedItems: (items: Record<string, { quantity: number; butter: boolean }>) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MENU_ITEMS, JSON.stringify(items));
  },

  getSelectedItems: (): Record<string, { quantity: number; butter: boolean }> => {
    const items = localStorage.getItem(STORAGE_KEYS.SELECTED_MENU_ITEMS);
    return items ? JSON.parse(items) : {};
  },

  clearSelectedItems: () => {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_MENU_ITEMS);
  },
}; 