import apiClient from '@/lib/api-client';
import { User, UpdateUserPayload } from '@/types';

export const usersService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario (nombre, moneda preferida)
   */
  async updateProfile(payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.patch<User>('/users/me', payload);
    return response.data;
  },

  /**
   * Sube una nueva imagen de avatar para el perfil (Multipart Form)
   */
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<User>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default usersService;
