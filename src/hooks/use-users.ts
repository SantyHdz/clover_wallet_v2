'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import usersService from '@/lib/users-service';
import { UpdateUserPayload } from '@/types';
import { useAuth } from '@/contexts/auth-context';

export const USER_PROFILE_QUERY_KEY = ['user-profile'];

/**
 * Hook para consultar los datos del perfil del usuario
 */
export function useUserProfile() {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => usersService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para actualizar los datos del perfil (nombre, moneda)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedUser);
      refetchUser();
      toast.success('Perfil actualizado correctamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al actualizar el perfil';
      toast.error(typeof message === 'string' ? message : 'Error al actualizar el perfil');
    },
  });
}

/**
 * Hook para subir la foto de perfil (avatar)
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedUser);
      refetchUser();
      toast.success('Foto de perfil actualizada con éxito');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al subir la imagen';
      toast.error(typeof message === 'string' ? message : 'Error al subir la foto de perfil');
    },
  });
}
