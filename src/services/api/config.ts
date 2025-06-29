export const API_URL = 'https://halwaai-server-410805250566.us-central1.run.app';
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