import { apiClient } from "./config";

const predefinedThaliService = {
    getPredefinedThali: async () => {
        const response = await apiClient.get('/admin/collections/predefinedThaalis');
        return response.data;
    },

    createPredefinedThali: async (formData: any) => {
        try {
            const response = await apiClient.post('/admin/collections/predefinedthaalis', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating predefined thali:', error);
            throw error;
        }
    },

    updatePredefinedThali: async (id: string, formData: FormData) => {
        try {
            const response = await apiClient.put(`/admin/collections/predefinedthaalis/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating predefined thali:', error);
            throw error;
        }
    },

    deletePredefinedThali: async (thaliId: string) => {
        const response = await apiClient.delete(`/admin/collections/predefinedthaalis/${thaliId}`);
        return response.data;
    },

    // deletePredefinedThali: async (thaliId: string) => {
    //     const response = await apiClient.delete(`/admin/collections/predefinedThaalis/${thaliId}`);
    //     return response.data;
    // }

    uploadImage: async (formData: FormData) => {
        try {
            const response = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },
}

export default predefinedThaliService;
