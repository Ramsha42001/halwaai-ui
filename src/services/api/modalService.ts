import { apiClient } from "./config";

const modalService = {
    getModal: async () => {
        const response = await apiClient.get('/admin/collection/modals');
        return response.data;
    },

    createModal: async (modalData: any) => {

        const response = await apiClient.post('/admin/collection/modals', modalData);
        return response.data;
    },

    updateModal: async (updatedData: any) => {
        console.log('Updating modal with data:', updatedData);
        const response = await apiClient.put(`/admin/collection/modals/${updatedData._id}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        return response.data;
    },

    deleteModal: async (modalId: string) => {
        const response = await apiClient.delete(`/admin/modals/${modalId}`);
        return response.data;
    }

}

export default modalService;