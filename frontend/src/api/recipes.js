// Funciones CRUD para recetas
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/recipes";

export const getRecipes = async (token, params = {}) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

export const getRecipeById = async (id, token) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createRecipe = async (data, token) => {
    const response = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateRecipe = async (id, data, token) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteRecipe = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};