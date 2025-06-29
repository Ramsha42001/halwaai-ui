import { create } from 'zustand';
import { ref, set as firebaseSet, update, onValue, off, push } from 'firebase/database';
import { database } from '@/lib/firebase';

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

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface DeliverySchedule {
  selectedDate: string;
  selectedTime: string;
  deliveryType: 'standard' | 'express';
  dateLabel?: string;
  timeLabel?: string;
}

interface CustomThali {
  imageUrl?: string;
  menuItems: MenuItem[];
  thaliPrice: number;
  thaliQuantity: number;
  name?: string;
}

interface SpecialThali extends CustomThali {
  name: string;
  _id: string;
}

interface CartItem {
  type: 'custom' | 'special';
  thali: CustomThali | SpecialThali;
  cartQuantity: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Order interfaces for Firebase
interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  includedItems?: string[];
  type: 'custom' | 'special';
  thaliPrice: number;
  cartQuantity: number;
}

interface Order {
  id?: string;
  customerId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: Address;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'approved' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliverySchedule?: DeliverySchedule;
}

interface StoreState {
  selectedItems: MenuItem[];
  orderTotal: number;
  thaliProgress: number;
  loading: boolean;
  error: string | null;
  requiredCategories: RequiredCategory[];
  selectedAddress: Address | null;
  deliverySchedule: DeliverySchedule | null;
  orderStatus: string;
  cart: Cart;

  addItem: (userId: string | null, item: MenuItem) => void;
  removeItem: (userId: string | null, item: MenuItem) => void;
  subscribe: (userId: string | null) => void;
  setRequiredCategories: (requiredCategories: RequiredCategory[]) => void;
  setSelectedAddress: (userId: string | null, address: Address) => void;
  setDeliverySchedule: (userId: string | null, schedule: DeliverySchedule) => void;
  addCustomThaliToCart: (userId: string | null, thaliName: string) => void;
  addSpecialThaliToCart: (userId: string | null, specialThali: SpecialThali) => void;
  updateCartItemQuantity: (userId: string | null, itemIndex: number, quantity: number) => void;
  changeOrderStatus: (userId: string | null, status: string) => void;
  removeFromCart: (userId: string | null, itemIndex: number) => void;
  clearSelectedItems: (userId: string | null) => void;
  placeOrder: (userId: string | null) => Promise<string | null>;
  clearCart: (userId: string | null) => void;
  clearAllUserData: (userId: string | null) => Promise<void>;
  unsubscribe: () => void;
};

let unsubscribeFn: (() => void) | null = null;

function calculateOrderTotal(price: number, quantity: number) {
  return price * quantity;
}

function updateThaliProgress(
  requiredCategories: RequiredCategory[],
  itemCategoryId: string
): { updatedCategories: RequiredCategory[]; progress: number } {
  const updatedCategories = requiredCategories.map(cat => {
    if (cat._id === itemCategoryId && !cat.selectedForThali) {
      return { ...cat, selectedForThali: true };
    }
    return cat;
  });

  const selectedCount = updatedCategories.filter(cat => cat.selectedForThali).length;
  const progress = requiredCategories.length > 0
    ? Math.round((selectedCount / requiredCategories.length) * 100)
    : 0;

  return { updatedCategories, progress };
}

export const useStore = create<StoreState>((set, get) => ({
  selectedItems: [],
  orderTotal: 0,
  thaliProgress: 0,
  loading: false,
  error: null,
  requiredCategories: [],
  selectedAddress: null,
  deliverySchedule: null,
  orderStatus: 'pending',
  cart: {
    items: [],
    totalAmount: 0
  },

  changeOrderStatus: async (userId: string | null, status: string) => {
    if (!userId) {
      set({ error: 'User ID is required to change order status' });
      return;
    }

    try {
      const statusRef = ref(database, `inventories/${userId}/orderStatus`);
      await firebaseSet(statusRef, {
        status: status,
        lastUpdated: new Date().toISOString()
      });

      set({ orderStatus: status });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update order status' });
    }
  },

  setRequiredCategories: (requiredCategories) => set({ requiredCategories }),

  setSelectedAddress: async (userId: string | null, address: Address) => {
    if (!userId) {
      set({ error: 'User ID is required to save address' });
      return;
    }

    set({ loading: true });
    try {
      const addressRef = ref(database, `inventories/${userId}/selectedAddress`);
      await firebaseSet(addressRef, address);

      set({
        selectedAddress: address,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to save address',
        loading: false
      });
    }
  },

  setDeliverySchedule: async (userId: string | null, schedule: DeliverySchedule) => {
    if (!userId) {
      set({ error: 'User ID is required to save delivery schedule' });
      return;
    }

    set({ loading: true });
    try {
      const scheduleRef = ref(database, `inventories/${userId}/deliverySchedule`);
      await firebaseSet(scheduleRef, schedule);

      set({
        deliverySchedule: schedule,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to save delivery schedule',
        loading: false
      });
    }
  },

  addItem: async (userId: string | null, item: MenuItem) => {
    set({ loading: true });
    try {
      const state = get();
      const existing = state.selectedItems.find(i => i._id === item._id);
      let updatedItem: MenuItem;
      if (existing) {
        updatedItem = { ...existing, quantity: existing.quantity + 1 };
      } else {
        updatedItem = { ...item, quantity: 1 };
      }

      const { updatedCategories, progress } = updateThaliProgress(
        state.requiredCategories,
        item.category._id
      );

      const thaliProgressRef = ref(database, `inventories/${userId}/thaliProgress`);
      await firebaseSet(thaliProgressRef, progress);

      const itemRef = ref(database, `inventories/${userId}/menuItems/${item._id}`);
      await firebaseSet(itemRef, updatedItem);

      const updatedItems = state.selectedItems.filter(i => i._id !== item._id);
      updatedItems.push(updatedItem);

      const orderTotal = updatedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, orderTotal);

      set({
        selectedItems: updatedItems,
        requiredCategories: updatedCategories,
        thaliProgress: progress,
        loading: false,
        orderTotal: orderTotal,
        error: null
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeItem: async (userId: string | null, item: MenuItem) => {
    set({ loading: true });
    try {
      const state = get();
      const existing = state.selectedItems.find(i => i._id === item._id);
      if (!existing) {
        set({ loading: false });
        return;
      }
      const itemRef = ref(database, `inventories/${userId}/menuItems/${item._id}`);
      let updatedItems: MenuItem[];

      if (existing.quantity > 1) {
        const updatedItem = { ...existing, quantity: existing.quantity - 1 };
        await firebaseSet(itemRef, updatedItem);
        updatedItems = state.selectedItems.map(i => i._id === item._id ? updatedItem : i);
      } else {
        await firebaseSet(itemRef, null);
        updatedItems = state.selectedItems.filter(i => i._id !== item._id);
      }

      const orderTotal = updatedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, orderTotal);

      set({
        selectedItems: updatedItems,
        orderTotal: orderTotal,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCustomThaliToCart: async (userId: string | null, thaliName: string) => {
    if (!userId) {
      set({ error: 'User ID is required to save to cart' });
      return;
    }

    set({ loading: true });
    try {
      const state = get();

      const thaliPrice = state.selectedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const customThali: CustomThali = {
        name: thaliName,
        menuItems: [...state.selectedItems],
        thaliPrice: thaliPrice,
        thaliQuantity: state.selectedItems.reduce((sum, item) => sum + item.quantity, 0)
      };

      const newCartItem: CartItem = {
        type: 'custom',
        thali: customThali,
        cartQuantity: 1
      };

      const updatedCart = {
        items: [...state.cart.items, newCartItem],
        totalAmount: state.cart.totalAmount + thaliPrice
      };

      const cartRef = ref(database, `inventories/${userId}/cart`);
      await firebaseSet(cartRef, updatedCart);

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, updatedCart.totalAmount);

      set({
        cart: updatedCart,
        orderTotal: updatedCart.totalAmount,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add to cart',
        loading: false
      });
    }
  },

  addSpecialThaliToCart: async (userId: string | null, specialThali: SpecialThali) => {
    if (!userId) {
      set({ error: 'User ID is required to save to cart' });
      return;
    }

    set({ loading: true });
    try {
      const state = get();

      const existingIndex = state.cart.items.findIndex(
        item => item.type === 'special' && (item.thali as SpecialThali)._id === specialThali._id
      );

      let updatedCart;
      if (existingIndex !== -1) {
        const updatedItems = [...state.cart.items];
        updatedItems[existingIndex].cartQuantity += 1;
        updatedCart = {
          items: updatedItems,
          totalAmount: state.cart.totalAmount + specialThali.thaliPrice
        };
      } else {
        const newCartItem: CartItem = {
          type: 'special',
          thali: specialThali,
          cartQuantity: 1
        };

        updatedCart = {
          items: [...state.cart.items, newCartItem],
          totalAmount: state.cart.totalAmount + specialThali.thaliPrice
        };
      }

      const cartRef = ref(database, `inventories/${userId}/cart`);
      await firebaseSet(cartRef, updatedCart);

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, updatedCart.totalAmount);

      set({
        cart: updatedCart,
        orderTotal: updatedCart.totalAmount,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add to cart',
        loading: false
      });
    }
  },

  updateCartItemQuantity: async (userId: string | null, itemIndex: number, quantity: number) => {
    if (!userId) {
      set({ error: 'User ID is required' });
      return;
    }

    set({ loading: true });
    try {
      const state = get();
      const updatedItems = [...state.cart.items];

      if (quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        updatedItems[itemIndex].cartQuantity = quantity;
      }

      const totalAmount = updatedItems.reduce((sum, item) => {
        return sum + (item.thali.thaliPrice * item.cartQuantity);
      }, 0);

      const updatedCart = {
        items: updatedItems,
        totalAmount
      };

      const cartRef = ref(database, `inventories/${userId}/cart`);
      await firebaseSet(cartRef, updatedCart);

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, totalAmount);

      set({
        cart: updatedCart,
        orderTotal: totalAmount,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update cart',
        loading: false
      });
    }
  },

  removeFromCart: async (userId: string | null, itemIndex: number) => {
    if (!userId) {
      set({ error: 'User ID is required' });
      return;
    }

    await get().updateCartItemQuantity(userId, itemIndex, 0);
  },

  clearSelectedItems: async (userId: string | null) => {
    if (!userId) return;

    try {
      const menuItemsRef = ref(database, `inventories/${userId}/menuItems`);
      await firebaseSet(menuItemsRef, null);

      const thaliProgressRef = ref(database, `inventories/${userId}/thaliProgress`);
      await firebaseSet(thaliProgressRef, 0);

      set({
        selectedItems: [],
        thaliProgress: 0
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear items' });
    }
  },

  clearCart: async (userId: string | null) => {
    if (!userId) return;

    try {
      const cartRef = ref(database, `inventories/${userId}/cart`);
      await firebaseSet(cartRef, { items: [], totalAmount: 0 });

      const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
      await firebaseSet(orderTotalRef, 0);

      set({
        cart: { items: [], totalAmount: 0 },
        orderTotal: 0
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear cart' });
    }
  },

  clearAllUserData: async (userId: string | null) => {
    if (!userId) {
      set({ error: 'User ID is required to clear data' });
      return;
    }

    set({ loading: true });
    try {
      // Clear all data from Firebase for this user
      const updates: { [key: string]: null } = {
        [`inventories/${userId}/menuItems`]: null,
        [`inventories/${userId}/thaliProgress`]: null,
        [`inventories/${userId}/selectedAddress`]: null,
        [`inventories/${userId}/orderTotal`]: null,
        [`inventories/${userId}/deliverySchedule`]: null,
        [`inventories/${userId}/cart`]: null,
        [`inventories/${userId}/orderStatus`]: null
      };

      // Use update to clear multiple paths at once
      await update(ref(database), updates);

      // Reset local state
      set({
        selectedItems: [],
        orderTotal: 0,
        thaliProgress: 0,
        selectedAddress: null,
        deliverySchedule: null,
        orderStatus: 'pending',
        cart: { items: [], totalAmount: 0 },
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to clear user data',
        loading: false
      });
    }
  },

  placeOrder: async (userId: string | null): Promise<string | null> => {
    if (!userId) {
      set({ error: 'User ID is required to place order' });
      return null;
    }

    const state = get();
    if (!state.cart.items.length || !state.selectedAddress || !state.deliverySchedule) {
      set({ error: 'Cart, address, and delivery schedule are required' });
      return null;
    }

    set({ loading: true });
    try {
      // Change status to processing
      await get().changeOrderStatus(userId, 'processing');

      // Transform cart items to order items
      const orderItems: OrderItem[] = state.cart.items.map(cartItem => ({
        _id: cartItem.type === 'special' ? (cartItem.thali as SpecialThali)._id : `custom-${Date.now()}`,
        name: cartItem.thali.name || 'Custom Thali',
        quantity: cartItem.cartQuantity,
        price: cartItem.thali.thaliPrice,
        includedItems: cartItem.thali.menuItems.map(item => `${item.name} (x${item.quantity})`),
        type: cartItem.type,
        thaliPrice: cartItem.thali.thaliPrice,
        cartQuantity: cartItem.cartQuantity
      }));

      // Calculate fees
      const subtotal = state.cart.totalAmount;
      const deliveryFee = state.deliverySchedule.deliveryType === 'express' ? 50 : 0;
      const total = subtotal + deliveryFee;

      // Create order object
      const order: Order = {
        customerId: userId,
        customer: {
          name: `${state.selectedAddress.firstName} ${state.selectedAddress.lastName}`,
          phone: state.selectedAddress.phone,
          email: state.selectedAddress.email,
          address: state.selectedAddress
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        status: 'approved', // Set to approved after successful payment
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliverySchedule: state.deliverySchedule
      };

      // Save order to Firebase
      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      await firebaseSet(newOrderRef, order);

      const orderId = newOrderRef.key;

      // Update order status to completed
      await get().changeOrderStatus(userId, 'completed');

      set({
        loading: false,
        error: null
      });

      return orderId;
    } catch (error: any) {
      // Reset to pending if error occurs
      await get().changeOrderStatus(userId, 'pending');

      set({
        error: error.message || 'Failed to place order',
        loading: false
      });
      return null;
    }
  },

  subscribe: (userId) => {
    if (unsubscribeFn) unsubscribeFn();
    const userRef = ref(database, `inventories/${userId}/menuItems`);
    const thaliProgressRef = ref(database, `inventories/${userId}/thaliProgress`);
    const addressRef = ref(database, `inventories/${userId}/selectedAddress`);
    const orderTotalRef = ref(database, `inventories/${userId}/orderTotal`);
    const deliveryScheduleRef = ref(database, `inventories/${userId}/deliverySchedule`);
    const cartRef = ref(database, `inventories/${userId}/cart`);
    const orderStatusRef = ref(database, `inventories/${userId}/orderStatus`);

    const listener = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const items: MenuItem[] = data ? Object.values(data) as MenuItem[] : [];

      onValue(thaliProgressRef, (progressSnap) => {
        const thaliProgress = progressSnap.val() ?? 0;

        onValue(addressRef, (addressSnap) => {
          const selectedAddress = addressSnap.val() as Address | null;

          onValue(orderTotalRef, (totalSnap) => {
            const orderTotal = totalSnap.val() ?? 0;

            onValue(deliveryScheduleRef, (scheduleSnap) => {
              const deliverySchedule = scheduleSnap.val() as DeliverySchedule | null;

              onValue(cartRef, (cartSnap) => {
                const cart = cartSnap.val() as Cart ?? { items: [], totalAmount: 0 };

                onValue(orderStatusRef, (statusSnap) => {
                  const orderStatusData = statusSnap.val();
                  const orderStatus = orderStatusData?.status ?? 'pending';

                  set({
                    selectedItems: items,
                    orderTotal,
                    thaliProgress,
                    selectedAddress,
                    deliverySchedule,
                    cart,
                    orderStatus,
                    loading: false,
                    error: null
                  });
                });
              });
            });
          });
        });
      });
    });

    unsubscribeFn = () => {
      off(userRef, 'value', listener);
      off(thaliProgressRef, 'value');
      off(addressRef, 'value');
      off(orderTotalRef, 'value');
      off(deliveryScheduleRef, 'value');
      off(cartRef, 'value');
      off(orderStatusRef, 'value');
    };
  },

  unsubscribe: () => {
    if (unsubscribeFn) unsubscribeFn();
    unsubscribeFn = null;
  }
}));