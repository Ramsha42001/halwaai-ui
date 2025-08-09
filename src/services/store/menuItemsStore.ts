import { create } from 'zustand';
import { ref, set as firebaseSet, update, onValue, off, push, get, get as firebaseGet } from 'firebase/database';
import { database } from '@/lib/firebase';
import { menuItems } from '@/data/menu-items';

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
  addCustomThaliToCart: (userId: string | null, thaliName: string, items: MenuItem[]) => void;
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
  selectedItems: MenuItem[]
): { updatedCategories: RequiredCategory[]; progress: number } {
  const updatedCategories = requiredCategories.map(cat => {
    const hasItem = selectedItems.some(item => item.category._id === cat._id && item.quantity > 0);
    return { ...cat, selectedForThali: hasItem };
  });

  const selectedCount = updatedCategories.filter(cat => cat.selectedForThali).length;
  const progress = requiredCategories.length > 0
    ? Math.round((selectedCount / requiredCategories.length) * 100)
    : 0;

  return { updatedCategories, progress };
}

async function fetchSelectedItemsFromFirebase(userId: string | null) {
  if (!userId) return [];
  const userRef = ref(database, `inventories/${userId}/menuItems`);
  const snapshot = await get(userRef);
  const data = snapshot.val();
  return data ? Object.values(data) as MenuItem[] : [];
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

      const updatedItems = [
        ...state.selectedItems.filter(i => i._id !== item._id),
        updatedItem
      ].filter(i => i.quantity > 0);

      const { updatedCategories, progress } = updateThaliProgress(
        state.requiredCategories,
        updatedItems
      );

      const thaliProgressRef = ref(database, `inventories/${userId}/thaliProgress`);
      await firebaseSet(thaliProgressRef, progress);

      const itemRef = ref(database, `inventories/${userId}/menuItems/${item._id}`);
      await firebaseSet(itemRef, updatedItem);

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
      let updatedItem: MenuItem;
      if (existing) {
        if (existing.quantity === 1) {
          updatedItem = { ...item, quantity: 0 };
        }
        else {
          updatedItem = { ...existing, quantity: existing.quantity - 1 };
        }
      }
      else {
        updatedItem = { ...item, quantity: 0 };
      }

      const updatedItems = [
        ...state.selectedItems.filter(i => i._id !== item._id),
        updatedItem
      ].filter(i => i.quantity > 0);

      const { updatedCategories, progress } = updateThaliProgress(
        state.requiredCategories,
        updatedItems
      );

      const thaliProgressRef = ref(database, `inventories/${userId}/thaliProgress`);
      await firebaseSet(thaliProgressRef, progress);

      const itemRef = ref(database, `inventories/${userId}/menuItems/${item._id}`);
      await firebaseSet(itemRef, updatedItem);

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
    }
    catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCustomThaliToCart: async (userId: string | null, thaliName: string, items: MenuItem[]) => {
    if (!userId) { set({ error: 'User ID is required to save to cart' }); return; }
    set({ loading: true });
    try {
      console.log(userId)
      console.log(items)
      const cartRef = ref(database, `inventories/${userId}/cart`);
      const cartSnap = await firebaseGet(cartRef);
      const currentCartRaw = cartSnap.val() || {};
      const cartItems = Array.isArray(currentCartRaw.items) ? currentCartRaw.items : [];
      const totalAmount = typeof currentCartRaw.totalAmount === "number" ? currentCartRaw.totalAmount : 0;
      const currentCart = { items: cartItems, totalAmount };

      const thaliPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const customThali: CustomThali = {
        name: thaliName,
        menuItems: [...items],
        thaliPrice: thaliPrice,
        thaliQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
      };
      const newCartItem: CartItem = {
        type: 'custom',
        thali: customThali,
        cartQuantity: 1
      };
      const updatedCart = {
        items: [...currentCart.items, newCartItem],
        totalAmount: currentCart.totalAmount + thaliPrice
      };

      console.log("cartRef:", cartRef.toString());
      console.log("currentCart:", currentCart);
      console.log("updatedCart:", updatedCart);

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
      console.error("Firebase write error:", error);
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

  // Updated placeOrder function for your store (menuItemsStore.ts)

  placeOrder: async (userId: string | null): Promise<string | null> => {
    if (!userId) {
      console.error('User ID is required to place order');
      set({ error: 'User ID is required to place order' });
      return null;
    }

    console.log('Starting order placement for user:', userId);

    const state = get();
    console.log('Current state:', {
      cartItems: state.cart.items.length,
      selectedAddress: !!state.selectedAddress,
      deliverySchedule: !!state.deliverySchedule,
      orderTotal: state.orderTotal
    });

    // Validate required data
    if (!state.cart.items || state.cart.items.length === 0) {
      console.error('Cart is empty');
      set({ error: 'Cart is empty' });
      return null;
    }

    if (!state.selectedAddress) {
      console.error('No delivery address selected');
      set({ error: 'No delivery address selected' });
      return null;
    }

    if (!state.deliverySchedule) {
      console.error('No delivery schedule selected');
      set({ error: 'No delivery schedule selected' });
      return null;
    }

    set({ loading: true });

    try {
      console.log('Changing order status to processing...');
      await get().changeOrderStatus(userId, 'processing');

      console.log('Transforming cart items to order items...');
      // Transform cart items to order items with proper structure
      const orderItems: OrderItem[] = state.cart.items.map((cartItem, index) => {
        console.log(`Processing cart item ${index}:`, cartItem);

        // Handle both custom and special thalis
        const itemId = cartItem.type === 'special' && (cartItem.thali as SpecialThali)._id
          ? (cartItem.thali as SpecialThali)._id
          : `custom-thali-${Date.now()}-${index}`;

        const itemName = cartItem.thali.name || 'Custom Thali';

        // Get included items properly
        let includedItems: string[] = [];
        if (cartItem.thali.menuItems && Array.isArray(cartItem.thali.menuItems)) {
          includedItems = cartItem.thali.menuItems.map(menuItem =>
            `${menuItem.name} (x${menuItem.quantity})`
          );
        }

        return {
          _id: itemId,
          name: itemName,
          quantity: cartItem.cartQuantity,
          price: cartItem.thali.thaliPrice,
          includedItems: includedItems,
          type: cartItem.type,
          thaliPrice: cartItem.thali.thaliPrice,
          cartQuantity: cartItem.cartQuantity
        };
      });

      console.log('Transformed order items:', orderItems);

      // Calculate totals
      const subtotal = state.cart.totalAmount;
      const deliveryFee = 0; // As per your original code, delivery is free
      const total = subtotal + deliveryFee;

      console.log('Order totals:', { subtotal, deliveryFee, total });

      // Create order object with proper structure
      const orderData: Omit<Order, 'id'> = {
        customerId: userId,
        customer: {
          name: `${state.selectedAddress.firstName} ${state.selectedAddress.lastName}`,
          phone: state.selectedAddress.phone,
          email: state.selectedAddress.email,
          address: {
            firstName: state.selectedAddress.firstName,
            lastName: state.selectedAddress.lastName,
            email: state.selectedAddress.email,
            phone: state.selectedAddress.phone,
            addressLine1: state.selectedAddress.addressLine1,
            addressLine2: state.selectedAddress.addressLine2,
            city: state.selectedAddress.city,
            state: state.selectedAddress.state,
            country: state.selectedAddress.country,
            zipCode: state.selectedAddress.zipCode
          }
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        status: 'pending', // Start with pending, can be updated later
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliverySchedule: {
          selectedDate: state.deliverySchedule.selectedDate,
          selectedTime: state.deliverySchedule.selectedTime,
          deliveryType: state.deliverySchedule.deliveryType,
          dateLabel: state.deliverySchedule.dateLabel,
          timeLabel: state.deliverySchedule.timeLabel
        }
      };

      console.log('Final order data to be saved:', orderData);

      // Save order to Firebase using push to auto-generate ID
      console.log('Saving order to Firebase...');
      const ordersRef = ref(database, 'orders');
      const newOrderRef = await push(ordersRef, orderData);

      const orderId = newOrderRef.key;

      if (!orderId) {
        throw new Error('Failed to generate order ID');
      }

      console.log('Order saved successfully with ID:', orderId);

      // Update order status to approved after successful save
      console.log('Updating order status to approved...');
      const orderUpdateRef = ref(database, `orders/${orderId}/status`);
      await firebaseSet(orderUpdateRef, 'approved');

      // Also update the timestamp
      const timestampRef = ref(database, `orders/${orderId}/updatedAt`);
      await firebaseSet(timestampRef, new Date().toISOString());

      console.log('Order status updated successfully');

      set({
        loading: false,
        error: null
      });

      console.log('Order placement completed successfully with ID:', orderId);
      return orderId;

    } catch (error: any) {
      console.error('Error during order placement:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Reset order status to pending if error occurs
      try {
        await get().changeOrderStatus(userId, 'pending');
      } catch (statusError) {
        console.error('Error resetting order status:', statusError);
      }

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
                const currentCartRaw = cartSnap.val() || {};
                const cartItems = Array.isArray(currentCartRaw.items) ? currentCartRaw.items : [];
                const totalAmount = typeof currentCartRaw.totalAmount === "number" ? currentCartRaw.totalAmount : 0;
                const currentCart = { items: cartItems, totalAmount };

                onValue(orderStatusRef, (statusSnap) => {
                  const orderStatusData = statusSnap.val();
                  const orderStatus = orderStatusData?.status ?? 'pending';

                  set({
                    selectedItems: items,
                    orderTotal,
                    thaliProgress,
                    selectedAddress,
                    deliverySchedule,
                    cart: currentCart,
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