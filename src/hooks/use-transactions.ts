'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionsService.createTransaction(payload),
    onSuccess: (newTx) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      const typeLabel = newTx.type === 'income' ? 'Ingreso' : 'Gasto';
      toast.success(`${typeLabel} de $${Number(newTx.amount).toFixed(2)} registrado correctamente`);
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
      toast.success('Transacción actualizada con éxito');
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

  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success('Transacción eliminada correctamente');
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
