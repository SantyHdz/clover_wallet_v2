'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatAmount } from '@/lib/utils';
import loansService from '@/lib/loans-service';
import {
  CreateLoanPayload,
  UpdateLoanPayload,
  LoanStatus,
  CreateLoanPaymentPayload,
} from '@/types';

export const LOANS_QUERY_KEY = ['loans'];

/**
 * Hook para consultar el listado de préstamos
 */
export function useLoans(status?: LoanStatus) {
  return useQuery({
    queryKey: [...LOANS_QUERY_KEY, status],
    queryFn: () => loansService.getLoans(status),
    staleTime: 1000 * 60 * 2, // 2 minutos de caché
  });
}

/**
 * Hook para consultar el detalle de un préstamo específico
 */
export function useLoan(id?: string) {
  return useQuery({
    queryKey: [...LOANS_QUERY_KEY, id],
    queryFn: () => (id ? loansService.getLoan(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook para consultar los cobros/abonos de un préstamo
 */
export function useLoanPayments(loanId?: string) {
  return useQuery({
    queryKey: [...LOANS_QUERY_KEY, loanId, 'payments'],
    queryFn: () => (loanId ? loansService.getLoanPayments(loanId) : []),
    enabled: !!loanId,
  });
}

/**
 * Hook para registrar un nuevo préstamo
 */
export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLoanPayload) => loansService.createLoan(payload),
    onSuccess: (newLoan) => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success(`Préstamo a ${newLoan.debtor_name} registrado exitosamente`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'Error al registrar el préstamo';
      toast.error(typeof message === 'string' ? message : 'Error al registrar el préstamo');
    },
  });
}

/**
 * Hook para actualizar un préstamo
 */
export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLoanPayload;
    }) => loansService.updateLoan(id, payload),
    onSuccess: (updatedLoan) => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success(`Préstamo a ${updatedLoan.debtor_name} actualizado`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo actualizar el préstamo';
      toast.error(typeof message === 'string' ? message : 'Error al actualizar');
    },
  });
}

/**
 * Hook para eliminar un préstamo
 */
export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loansService.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success('Préstamo eliminado correctamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar el préstamo';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar');
    },
  });
}

/**
 * Hook para registrar un cobro o abono recibido para un préstamo
 */
export function useCreateLoanPayment(loanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLoanPaymentPayload) =>
      loansService.createLoanPayment(loanId, payload),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LOANS_QUERY_KEY, loanId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success(`Cobro de $${formatAmount(payment.amount)} registrado con éxito`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo registrar el cobro';
      toast.error(typeof message === 'string' ? message : 'Error al cobrar');
    },
  });
}

/**
 * Hook para eliminar un cobro de un préstamo
 */
export function useDeleteLoanPayment(loanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) =>
      loansService.deleteLoanPayment(loanId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LOANS_QUERY_KEY, loanId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
      toast.success('Cobro revertido / eliminado');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        error.message ||
        'No se pudo eliminar el cobro';
      toast.error(typeof message === 'string' ? message : 'Error al eliminar cobro');
    },
  });
}
