'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatAmount } from '@/lib/utils';
import { useNotifications } from '@/contexts/notifications-context';
import debtsService from '@/lib/debts-service';
import {
  CreateDebtPayload,
  UpdateDebtPayload,
  DebtStatus,
  CreateDebtPaymentPayload,
} from '@/types';

export const DEBTS_QUERY_KEY = ['debts'];

/**
 * Hook para consultar el listado de deudas
 */
export function useDebts(status?: DebtStatus) {
  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, status],
    queryFn: () => debtsService.getDebts(status),
    staleTime: 1000 * 60 * 2, // 2 minutos de caché
  });
}

/**
 * Hook para consultar el detalle de una deuda específica
 */
export function useDebt(id?: string) {
  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, id],
    queryFn: () => (id ? debtsService.getDebt(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook para consultar los abonos de una deuda
 */
export function useDebtPayments(debtId?: string) {
  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, debtId, 'payments'],
    queryFn: () => (debtId ? debtsService.getDebtPayments(debtId) : []),
    enabled: !!debtId,
  });
}

/**
 * Hook para registrar una nueva deuda
 */
export function useCreateDebt() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (payload: CreateDebtPayload) => debtsService.createDebt(payload),
    onSuccess: (newDebt) => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Deuda Registrada',
        message: `Deuda con ${newDebt.creditor_name} por $${formatAmount(newDebt.total_amount)} registrada`,
        type: 'debt',
        actionType: 'create',
        link: '/dashboard/debts-loans',
        amount: newDebt.total_amount,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al registrar la deuda';
      toast.error(typeof message === 'string' ? message : 'Error al registrar la deuda');
    },
  });
}

/**
 * Hook para actualizar una deuda
 */
export function useUpdateDebt() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDebtPayload;
    }) => debtsService.updateDebt(id, payload),
    onSuccess: (updatedDebt) => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Deuda Actualizada',
        message: `Deuda con ${updatedDebt.creditor_name} actualizada`,
        type: 'debt',
        actionType: 'update',
        link: '/dashboard/debts-loans',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo actualizar la deuda';
      toast.error(typeof message === 'string' ? message : 'Error al actualizar');
    },
  });
}

/**
 * Hook para eliminar una deuda
 */
export function useDeleteDebt() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => debtsService.deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Deuda Eliminada',
        message: 'La deuda ha sido removida del registro',
        type: 'debt',
        actionType: 'delete',
        link: '/dashboard/debts-loans',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar la deuda';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar');
    },
  });
}

/**
 * Hook para registrar un abono a una deuda
 */
export function useCreateDebtPayment(debtId: string) {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (payload: CreateDebtPaymentPayload) =>
      debtsService.createDebtPayment(debtId, payload),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEBTS_QUERY_KEY, debtId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Abono a Deuda Registrado',
        message: `Se registró un abono de $${formatAmount(payment.amount)}`,
        type: 'debt',
        actionType: 'payment',
        link: '/dashboard/debts-loans',
        amount: payment.amount,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo registrar el abono';
      toast.error(typeof message === 'string' ? message : 'Error al abonar');
    },
  });
}

/**
 * Hook para eliminar un abono de una deuda
 */
export function useDeleteDebtPayment(debtId: string) {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (paymentId: string) =>
      debtsService.deleteDebtPayment(debtId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEBTS_QUERY_KEY, debtId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Abono Eliminado',
        message: 'El abono ha sido revertido',
        type: 'debt',
        actionType: 'delete',
        link: '/dashboard/debts-loans',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar el abono';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar abono');
    },
  });
}
