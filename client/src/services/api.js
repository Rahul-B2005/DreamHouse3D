import axios from 'axios';

const api = axios.create({
  // CRA's "proxy" in package.json forwards /api to the Express server on port 5051.
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (error) => {
  const status = error.response?.status;
  if (status === 404) return error.response?.data?.message || 'The requested API endpoint or project was not found.';
  if (status === 401) return error.response?.data?.message || 'Invalid login or session expired.';
  return error.response?.data?.message || error.message || 'Something went wrong';
};

export default api;
