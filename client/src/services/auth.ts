import axios from 'axios';

// Use VITE_API_URL from environment variables, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export const signup = (data: any) => axios.post(`${API_URL}/signup`, data);

export const signin = (data: any) => {
    return axios.post(`${API_URL}/signin`, data);
};

export const forgotPassword = (data: any) => {
    return axios.post(`${API_URL}/forgot-password`, data);
};

export const resetPassword = (data: any, token: string) => {
    return axios.post(`${API_URL}/reset-password/${token}`, data);
};
