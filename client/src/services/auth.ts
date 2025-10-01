import axios from 'axios';

// Pick the correct API URL: Render backend or local dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export const signup = (data: any) => axios.post(`${API_URL}/signup`, data);
export const signin = (data: any) => axios.post(`${API_URL}/signin`, data);
export const forgotPassword = (data: any) => axios.post(`${API_URL}/forgot-password`, data);
export const resetPassword = (data: any, token: string) => axios.post(`${API_URL}/reset-password/${token}`, data);
export const adminLogin = (data: any) => axios.post(`${API_URL}/admin/login`, data);
export const getUsers = () => axios.get(`${API_URL}/users`);
