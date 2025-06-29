// Funciones para autenticación: login, registro, perfil, etc.
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/users";

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const getProfile = async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};