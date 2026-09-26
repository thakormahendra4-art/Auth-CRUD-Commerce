import api from "../config/AxiosInstance";

export const getProducts = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (search && search.trim()) params.search = search.trim();

  const response = await api.get("/api/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};
