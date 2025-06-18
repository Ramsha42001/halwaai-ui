import { apiClient } from "./config";

export const orderHistoryService = {
    getOrderHistoryUser: async (customerId: string) => {
        const response = await apiClient.get(`/api/orders/user/${customerId}`);
        return response.data;
    },

    createNewOrder: async (orderData: any) => {
        const savedOrder = apiClient.post(`/api/orders`,orderData);
        return savedOrder;
    }
}