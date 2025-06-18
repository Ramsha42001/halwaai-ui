import { apiClient } from "./config";

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/admin/users/login', { email, password }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            // return response.data;    
            if(response.data.token){
                localStorage.setItem('authToken', response.data.token);
            }
            if(response.data.userId){
                localStorage.setItem('userId', response.data.userId);
            }
            
        } catch (error) {
            throw error;
        }
    },

    signup: async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            const response = await apiClient.post('/admin/users/register', { email, password, firstName, lastName });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    googleSignup: async () => {
        try {
            const response = await apiClient.get('api/gauth/google');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try{
            const response = await apiClient.get('/admin/users/users');
            return response.data;
        }
        catch(error) {
            throw error;
        }
    },
}

export default authService;