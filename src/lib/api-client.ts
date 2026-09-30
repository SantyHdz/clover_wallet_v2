import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const TOKEN_STORAGE_KEY = 'clover_access_token';

// Cliente principal de Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Helper para obtener el token actual
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Helper para guardar el token
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Helper para remover el token (logout)
export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Interceptor de Petición: Inyección automática de Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo de errores globales y sesión expirada (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // Si recibimos 401 y estamos en el navegador, limpiamos token
      if (typeof window !== 'undefined') {
        const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
        if (!isAuthRoute && !window.location.pathname.startsWith('/api')) {
          removeStoredToken();
          // Solo redirigir si no estamos en una ruta pública
          if (window.location.pathname.startsWith('/dashboard')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper para extraer mensajes legibles de errores FastAPI
export function getApiErrorMessage(error: unknown, defaultMessage = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg).join(', ');
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

export default apiClient;
