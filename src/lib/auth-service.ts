import apiClient, { setStoredToken, removeStoredToken } from './api-client';
import { supabase } from './supabase-client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

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
    return response.data;
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
