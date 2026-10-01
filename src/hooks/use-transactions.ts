'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatAmount } from '@/lib/utils';
import { useNotifications } from '@/contexts/notifications-context';
import transactionsService from '@/lib/transactions-service';
import {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilterParams,
} from '@/types';

export const TRANSACTIONS_QUERY_KEY = ['transactions'];

/**
 * Hook para consultar el listado de transacciones con filtros
 */
export function useTransactions(filters?: TransactionFilterParams) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => transactionsService.getTransactions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos de caché
  });
}

/**
 * Hook para consultar el detalle de una transacción
 */
export function useTransaction(id?: string) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => (id ? transactionsService.getTransaction(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook para crear una transacción (ingreso o gasto)
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionsService.createTransaction(payload),
    onSuccess: (newTx) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      const isIncome = newTx.type === 'income';
      notify({
        title: isIncome ? 'Ingreso Registrado' : 'Gasto Registrado',
        message: `${isIncome ? 'Ingreso' : 'Gasto'} de $${formatAmount(newTx.amount)}${
          newTx.description ? ` (${newTx.description})` : ''
        }`,
        type: 'transaction',
        actionType: 'create',
        link: '/dashboard/transactions',
        amount: newTx.amount,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al registrar la transacción';
      toast.error(typeof message === 'string' ? message : 'Error al registrar la transacción');
    },
  });
}

/**
 * Hook para actualizar una transacción existente
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransactionPayload;
    }) => transactionsService.updateTransaction(id, payload),
    onSuccess: (updatedTx) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Transacción Actualizada',
        message: `Movimiento de $${formatAmount(updatedTx.amount)} modificado correctamente`,
        type: 'transaction',
        actionType: 'update',
        link: '/dashboard/transactions',
        amount: updatedTx.amount,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo actualizar la transacción';
      toast.error(typeof message === 'string' ? message : 'Error al actualizar');
    },
  });
}

/**
 * Hook para eliminar una transacción
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      notify({
        title: 'Transacción Eliminada',
        message: 'El movimiento ha sido removido de tu historial',
        type: 'transaction',
        actionType: 'delete',
        link: '/dashboard/transactions',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar la transacción';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar');
    },
  });
}
