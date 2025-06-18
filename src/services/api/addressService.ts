import { apiClient } from "./config";

export const addressService = {
    getAddress: async () => {
        const response = await apiClient.get(`/api/addresses/${localStorage.getItem('userId')}`);
        return response.data;
    },
    createAddress: async (address: any) => {
        const userId = localStorage.getItem('userId');
        const payload = {
            userId: userId,
            addressData: address
        }
        const response = await apiClient.post('/api/addresses',payload);
        return response.data;
    },
    updateAddress: async (address: any) => {
        const response = await apiClient.put(`/api/addresses/${localStorage.getItem('userId')}`, address);
        return response.data;
    },
    deleteAddress: async () => {
        const response = await apiClient.delete(`/api/addresses/${localStorage.getItem('userId')}`);
        return response.data;
    }
}