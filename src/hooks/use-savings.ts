'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatAmount } from '@/lib/utils';
import { useNotifications } from '@/contexts/notifications-context';
import savingsService from '@/lib/savings-service';
import {
  CreateSavingPayload,
  UpdateSavingPayload,
  CreateSavingContributionPayload,
  SavingStatus,
} from '@/types';

export const SAVINGS_QUERY_KEY = ['savings'];
export const SAVINGS_SUMMARY_QUERY_KEY = ['savings-summary'];
export const SAVINGS_PROJECTIONS_QUERY_KEY = ['savings-projections'];

/**
 * Hook para listar los ahorros del usuario
 */
export function useSavings(status?: SavingStatus | string) {
  return useQuery({
    queryKey: [...SAVINGS_QUERY_KEY, { status }],
    queryFn: () => savingsService.getSavings(status),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para obtener el resumen global de ahorros (total guardado, total meta, contadores)
 */
export function useSavingSummary() {
  return useQuery({
    queryKey: SAVINGS_SUMMARY_QUERY_KEY,
    queryFn: () => savingsService.getSummary(),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para obtener las proyecciones inteligentes de ahorro
 */
export function useSavingProjections() {
  return useQuery({
    queryKey: SAVINGS_PROJECTIONS_QUERY_KEY,
    queryFn: () => savingsService.getProjections(),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para obtener el detalle de un ahorro específico
 */
export function useSaving(id?: string) {
  return useQuery({
    queryKey: [...SAVINGS_QUERY_KEY, id],
    queryFn: () => (id ? savingsService.getSaving(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook para crear una nueva meta de ahorro o alcancía
 */
export function useCreateSaving() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (payload: CreateSavingPayload) => savingsService.createSaving(payload),
    onSuccess: (newSaving) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_PROJECTIONS_QUERY_KEY });
      notify({
        title: 'Meta de Ahorro Creada',
        message: `Meta "${newSaving.name}" creada exitosamente`,
        type: 'saving',
        actionType: 'create',
        link: '/dashboard/savings',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al crear la meta de ahorro';
      toast.error(typeof message === 'string' ? message : 'Error al crear la meta de ahorro');
    },
  });
}

/**
 * Hook para actualizar una meta de ahorro
 */
export function useUpdateSaving() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSavingPayload }) =>
      savingsService.updateSaving(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_PROJECTIONS_QUERY_KEY });
      notify({
        title: 'Meta Actualizada',
        message: `Meta "${updated.name}" modificada correctamente`,
        type: 'saving',
        actionType: 'update',
        link: '/dashboard/savings',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al actualizar el ahorro';
      toast.error(typeof message === 'string' ? message : 'Error al actualizar el ahorro');
    },
  });
}

/**
 * Hook para eliminar una meta de ahorro
 */
export function useDeleteSaving() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => savingsService.deleteSaving(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_PROJECTIONS_QUERY_KEY });
      notify({
        title: 'Meta Eliminada',
        message: 'La meta de ahorro fue removida',
        type: 'saving',
        actionType: 'delete',
        link: '/dashboard/savings',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al eliminar el ahorro';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar el ahorro');
    },
  });
}

/**
 * Hook para consultar el historial de aportes de un ahorro
 */
export function useSavingContributions(savingId?: string) {
  return useQuery({
    queryKey: ['saving-contributions', savingId],
    queryFn: () => (savingId ? savingsService.getContributions(savingId) : []),
    enabled: !!savingId,
  });
}

/**
 * Hook para registrar un nuevo aporte en una meta de ahorro
 */
export function useCreateSavingContribution() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: ({
      savingId,
      payload,
    }: {
      savingId: string;
      payload: CreateSavingContributionPayload;
    }) => savingsService.createContribution(savingId, payload),
    onSuccess: (newContribution, variables) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_PROJECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ['saving-contributions', variables.savingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['saving-monthly', variables.savingId],
      });
      notify({
        title: 'Aporte Registrado',
        message: `Se aportaron $${formatAmount(newContribution.amount)} a la meta`,
        type: 'saving',
        actionType: 'contribution',
        link: '/dashboard/savings',
        amount: newContribution.amount,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al registrar el aporte';
      toast.error(typeof message === 'string' ? message : 'Error al registrar el aporte');
    },
  });
}

/**
 * Hook para eliminar un aporte
 */
export function useDeleteSavingContribution() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: ({
      savingId,
      contributionId,
    }: {
      savingId: string;
      contributionId: string;
    }) => savingsService.deleteContribution(savingId, contributionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SAVINGS_PROJECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ['saving-contributions', variables.savingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['saving-monthly', variables.savingId],
      });
      notify({
        title: 'Aporte Revertido',
        message: 'El aporte ha sido eliminado',
        type: 'saving',
        actionType: 'delete',
        link: '/dashboard/savings',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al eliminar el aporte';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar el aporte');
    },
  });
}

/**
 * Hook para obtener la analítica de aportes mensuales de un ahorro
 */
export function useMonthlyContributions(savingId?: string, year?: number) {
  const currentYear = year || new Date().getFullYear();

  return useQuery({
    queryKey: ['saving-monthly', savingId, currentYear],
    queryFn: () =>
      savingId
        ? savingsService.getMonthlyContributions(savingId, currentYear)
        : [],
    enabled: !!savingId,
  });
}
