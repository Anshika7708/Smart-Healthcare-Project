import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Auth APIs
export const signup = (userData) => api.post("/auth/signup", userData);
export const login = (credentials) => api.post("/auth/login", credentials);

// User APIs
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const updateUserProfile = (userId, updates) =>
	api.put(`/users/update/${userId}`, updates);

// Report APIs
export const uploadReport = (formData) =>
	api.post("/reports/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
export const getUserReports = (userId) => api.get(`/reports/${userId}`);
export const deleteReport = (reportId) => api.delete(`/reports/${reportId}`);

// Vital APIs
export const addVital = (vitalData) => api.post("/vitals/add", vitalData);
export const getUserVitals = (userId) => api.get(`/vitals/${userId}`);
export const initializeSampleVitals = (userId) =>
	api.post("/vitals/initialize", { userId });

// Prescription APIs
export const createPrescription = (prescriptionData) =>
	api.post("/prescriptions", prescriptionData);
export const getAllPrescriptions = () => api.get("/prescriptions/all");
export const getUserPrescriptions = (userId) =>
	api.get(`/prescriptions/user/${userId}`);
export const getPrescriptionById = (id) => api.get(`/prescriptions/${id}`);
export const updatePrescription = (id, updates) =>
	api.put(`/prescriptions/${id}`, updates);
export const deletePrescription = (id) => api.delete(`/prescriptions/${id}`);
export const updatePrescriptionStatus = (id, status) =>
	api.patch(`/prescriptions/${id}/status`, { status });

export default api;
