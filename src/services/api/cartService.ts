import { apiClient } from "./config";

export const cartService = {
    getCartItems: async () => {
        try {
            const userId = localStorage.getItem('authToken');
            const response = await apiClient.get(`/api/carts/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addToCart: async (cartItemData: any) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await apiClient.post(`/api/carts/${userId}`, cartItemData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeCartItem: async (cartItemId: string) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await apiClient.delete(`/api/carts/${userId}/${cartItemId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateTotalPrice: async (id: string, quantity: number) => {
        try {
            const userId = localStorage.getItem('userId');
            const payload = {
                id: id,
                quantity: quantity
            }
            console.log(payload)
            const response = await apiClient.post(`/api/carts/${userId}/update`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    emptyCart: async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await apiClient.delete(`/api/carts/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

}

export default cartService;
