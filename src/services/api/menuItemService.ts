import { apiClient } from "./config";

export const menuItemService = {
    getMenuItems: async () => {
        try {
            const response = await apiClient.get('/admin/collections/menuitems');
            return response.data;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw error;
        }
    },
    createMenuItem: async (menuItem: any) => {
        try {
            const response = await apiClient.post('/admin/collections/menuitems', menuItem, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getMenuItem: async (id: string) => {
        try {
            const response = await apiClient.get(`/admin/collections/menuitems/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateMenuItem: async (id: string, menuItem: any) => {
        try {
            const response = await apiClient.put(`/admin/collections/menuitems/${id}`, menuItem, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }   
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMenuItem: async (id: string) => {
        try {
            const response = await apiClient.delete(`/admin/collections/menuitems/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {   
            throw error;
        }
    }
}

export default menuItemService;
