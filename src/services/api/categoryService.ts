import { apiClient } from "./config";

export const categoryService = {
    getCategories: async () => {
        try {
            const response = await apiClient.get('/admin/collections/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createCategory: async (category: string, requiredThali: string) => {
        try {
            const payload = {
                name: category,
                requiredThali: requiredThali
            }

            console.log(payload)
            const response = await apiClient.post('/admin/collections/categories', payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            });
            console.log('response', response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default categoryService;
