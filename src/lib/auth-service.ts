import apiClient, { setStoredToken, removeStoredToken, getStoredToken } from './api-client';
import { supabase } from './supabase-client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

export function getEmailFromJwt(token?: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.email || null;
  } catch {
    return null;
  }
}

export const authService = {
  // Iniciar sesión con email y contraseña
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    if (response.data?.access_token) {
      setStoredToken(response.data.access_token);
    }
    return response.data;
  },

  // Registro de nuevo usuario
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    if (response.data?.access_token) {
      setStoredToken(response.data.access_token);
    }
    return response.data;
  },

  // Iniciar flujo de Google OAuth vía Supabase
  async loginWithGoogle(): Promise<void> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth-callback`,
      },
    });
    if (error) {
      throw error;
    }
  },

  // Intercambiar el token de Supabase por el JWT de nuestro backend
  async exchangeSupabaseGoogleToken(supabaseToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login/google',
      {},
      {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      }
    );
    if (response.data?.access_token) {
      setStoredToken(response.data.access_token);
    }
    return response.data;
  },

  // Obtener el perfil del usuario autenticado
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    const token = getStoredToken();
    const tokenEmail = getEmailFromJwt(token);

    let email = response.data.email || tokenEmail;
    if (!email) {
      try {
        const { data } = await supabase.auth.getUser();
        email = data.user?.email || null;
      } catch {
        // Ignorar si no hay sesión de Supabase
      }
    }

    return {
      ...response.data,
      email: email || undefined,
    };
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    removeStoredToken();
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar si no había sesión de Supabase
    }
  },
};

export default authService;
