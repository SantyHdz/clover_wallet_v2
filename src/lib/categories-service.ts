import apiClient from '@/lib/api-client';
import { Category, CreateCategoryPayload } from '@/types';

export const categoriesService = {
  /**
   * Obtiene la lista completa de categorías (globales y del usuario)
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories/');
    return response.data;
  },

  /**
   * Crea una nueva categoría personalizada para el usuario actual
   */
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response = await apiClient.post<Category>('/categories/', payload);
    return response.data;
  },

  /**
   * Elimina una categoría personalizada del usuario
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};

export default categoriesService;
