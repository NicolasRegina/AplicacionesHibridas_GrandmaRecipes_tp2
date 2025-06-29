// Funciones CRUD para grupos
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/groups";

export const getGroups = async (token) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getGroupById = async (id, token) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createGroup = async (data, token) => {
    const response = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateGroup = async (id, data, token) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteGroup = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};