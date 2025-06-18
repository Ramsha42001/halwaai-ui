import { create } from 'zustand';

interface MenuItem {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: {
    _id: string
    name: string
  }
  hasButter?: boolean
  quantity: number
}

interface RequiredCategory {
  _id: string;
  selectedForThali: boolean;
}

interface Category {
  _id: string
}

interface StoreState {
  selectedItems: Map<string, number>;
  orderTotal: number;
  thaliProgress: number;

  addItem: (id: string, category: string) => void;
  removeItem: (id: string, category: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  setOrderTotal: (total: number) => void;
  resetThaliProgress: () => void;
}

const loadSelectedItems = (): Map<string, number> => {
  const storedItems = localStorage.getItem('selectedItems');
  if (storedItems) {
    const parsedItems: [string, number][] = JSON.parse(storedItems);
    return new Map<string, number>(parsedItems);
  }
  return new Map<string, number>();
};

export const useStore = create<StoreState>((set) => ({
  selectedItems: loadSelectedItems(),
  orderTotal: 0,
  thaliProgress: 0,

  addItem: (id: string, categoryId: string) => set((state) => {
    const newQuantity = (state.selectedItems.get(id) || 0) + 1;
    const updatedItems = new Map(state.selectedItems);
    updatedItems.set(id, newQuantity);

    const storedRequiredCategories = JSON.parse(localStorage.getItem('requiredCategoryItems') || '[]');
    const updatedRequiredCategories = storedRequiredCategories.map((cat: RequiredCategory) => {
      return cat._id === categoryId ? { ...cat, selectedForThali: true } : cat;
    });

    localStorage.setItem('requiredCategoryItems', JSON.stringify(updatedRequiredCategories));
    localStorage.setItem('selectedItems', JSON.stringify(Array.from(updatedItems.entries())));

    // Correctly calculate progress
    const progress = (updatedRequiredCategories.filter((item: RequiredCategory) => {
      return item.selectedForThali === true; // Ensure to return the boolean value
    }).length / updatedRequiredCategories.length) * 100;

    localStorage.setItem('thaliProgress', JSON.stringify(progress)); // Store progress in localStorage

    return { selectedItems: updatedItems, thaliProgress: progress }; // Return the updated state
  }),

  removeItem: (id: string, category: string) => set((state) => {
    const updatedItems = new Map(state.selectedItems);
    const currentQuantity = updatedItems.get(id);
    if (currentQuantity) {
      if (currentQuantity === 1) {
        updatedItems.delete(id);
      } else {
        updatedItems.set(id, currentQuantity - 1);
      }
    }
    localStorage.setItem('selectedItems', JSON.stringify(Array.from(updatedItems.entries())));

    // Update required categories to recalculate thaliProgress
    const storedRequiredCategories = JSON.parse(localStorage.getItem('requiredCategoryItems') || '[]');
    const updatedRequiredCategories = storedRequiredCategories.map((cat: RequiredCategory) => {
      return cat._id === category ? { ...cat, selectedForThali: false } : cat; // Set selectedForThali to false for the removed category
    });

    localStorage.setItem('requiredCategoryItems', JSON.stringify(updatedRequiredCategories));

    // Calculate thaliProgress based on updated required categories
    const trueRequiredCategoriesCount = updatedRequiredCategories.filter((item: RequiredCategory) => {
      return item.selectedForThali === true; // Count only those selected for Thali
    }).length;

    // Check if the category has no items left
    const categoryHasItems = Array.from(updatedItems.keys()).some(itemId => {
      const item = menuItems.find(menuItem => menuItem._id === itemId);
      return item && item.category._id === category; // Check if any item belongs to the category
    });

    // Update progress only if the category has no items left
    const progress = categoryHasItems ? (trueRequiredCategoriesCount / updatedRequiredCategories.length) * 100 : (trueRequiredCategoriesCount / (updatedRequiredCategories.length - 1)) * 100;

    localStorage.setItem('thaliProgress', JSON.stringify(progress)); // Store progress in localStorage

    return { selectedItems: updatedItems, thaliProgress: progress }; // Return the updated state
  }),
  updateItemQuantity: (id: string, quantity: number) => set((state) => {
    const updatedItems = new Map(state.selectedItems);
    if (quantity === 0) {
      updatedItems.delete(id);
    } else {
      updatedItems.set(id, quantity);
    }
    localStorage.setItem('selectedItems', JSON.stringify(Array.from(updatedItems.entries())));
    return { selectedItems: updatedItems };
  }),
  setOrderTotal: (total: number) => set({ orderTotal: total }),

  resetThaliProgress: () => set({ thaliProgress: 0 }),
}));