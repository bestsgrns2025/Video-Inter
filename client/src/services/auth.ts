
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const signup = (data: any) => {
    return axios.post(`${API_URL}/signup`, data);
};

export const signin = (data: any) => {
    return axios.post(`${API_URL}/signin`, data);
};

export const forgotPassword = (data: any) => {
    return axios.post(`${API_URL}/forgot-password`, data);
};

export const resetPassword = (data: any, token: string) => {
    return axios.post(`${API_URL}/reset-password/${token}`, data);
};

export const adminLogin = (data: any) => {
    return axios.post(`${API_URL}/admin/login`, data);
};

export const getUsers = () => {
    return axios.get(`${API_URL}/users`);
};
