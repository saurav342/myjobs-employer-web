import axios from 'axios';

// Determine if we're in production (HTTPS) or development
const isProduction = window.location.protocol === 'https:';
const isNetlify = window.location.hostname.includes('netlify.app');

// Use proxy for production deployments, direct backend for development
const getDefaultApiUrl = () => {
  if (isProduction || isNetlify) {
    // Use Netlify proxy to avoid mixed content issues
    return '/api';
  }
  // Use direct backend for development
  return 'http://ec2-16-176-22-21.ap-southeast-2.compute.amazonaws.com:3000/api';
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

