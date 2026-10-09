// API Configuration for local & production (Vercel + Render)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}` ).replace(/\/$/, '');
