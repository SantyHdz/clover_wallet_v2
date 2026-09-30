'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import categoriesService from '@/lib/categories-service';
import { CreateCategoryPayload } from '@/types';

export const CATEGORIES_QUERY_KEY = ['categories'];

/**
 * Hook para obtener la lista de categorías (globales y del usuario)
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesService.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura en caché
  });
}

/**
 * Hook para crear una nueva categoría personalizada
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesService.createCategory(payload),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success(`Categoría "${newCategory.name}" creada con éxito`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al crear la categoría';
      toast.error(typeof message === 'string' ? message : 'Error al crear la categoría');
    },
  });
}

/**
 * Hook para eliminar una categoría personalizada
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Categoría eliminada correctamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar la categoría';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar');
    },
  });
}
