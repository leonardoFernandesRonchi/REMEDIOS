import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// =========================
// TYPES
// =========================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface MedicationData {
  name: string;
  quantity: number;
  posicionamentoMotor?: string;
}

export interface UpdateMedicationData {
  name?: string;
  quantity?: number;
  posicionamentoMotor?: string;
}

// =========================
// TOKEN
// =========================

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// Interceptor para enviar JWT automaticamente
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// AUTH SERVICES
// =========================

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);

  // salva token automaticamente
  if (response.data.token) {
    setToken(response.data.token);
  }

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  removeToken();

  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");

  if (response.data.token) {
    setToken(response.data.token);
  }

  return response.data;
};

// =========================
// MEDICATION SERVICES
// =========================

// INDEX
export const getMedications = async () => {
  const response = await api.get("/medications");
  return response.data;
};

// SHOW
export const getMedicationById = async (id: number | string) => {
  const response = await api.get(`/medications/${id}`);
  return response.data;
};

// CREATE
export const createMedication = async (data: MedicationData) => {
  const response = await api.post("/medications", data);
  return response.data;
};

// UPDATE
export const updateMedication = async (
  id: number | string,
  data: UpdateMedicationData
) => {
  const response = await api.put(`/medications/${id}`, data);
  return response.data;
};

// DELETE
export const deleteMedication = async (id: number | string) => {
  const response = await api.delete(`/medications/${id}`);
  return response.data;
};

export default api;