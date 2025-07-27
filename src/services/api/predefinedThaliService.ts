import { apiClient } from "./config";

const predefinedThaliService = {
    getPredefinedThali: async () => {
        const response = await apiClient.get('/admin/collections/predefinedThaalis');
        return response.data;
    },

    createPredefinedThali: async (formData: any) => {
        try {
            console.log(formData)
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

    uploadImage: async (id: string, image: File) => {
        const formData = new FormData();
        formData.append('image', image); // Append the image file

        try {
            const response = await apiClient.put(`/admin/collections/predefinedthaalis/${id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
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
