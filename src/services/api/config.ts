export const API_URL = 'http://localhost:3000';
import axios from 'axios';


export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });


//   apiClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });