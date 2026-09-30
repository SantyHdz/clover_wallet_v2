import apiClient from '@/lib/api-client';
import {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilterParams,
} from '@/types';

export const transactionsService = {
  /**
   * Obtiene la lista de transacciones con filtros opcionales (tipo, categoría, año, mes)
   */
  async getTransactions(filters?: TransactionFilterParams): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/transactions/', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtiene el detalle de una transacción por su ID
   */
  async getTransaction(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Registra una nueva transacción (ingreso o gasto)
   */
  async createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions/', payload);
    return response.data;
  },

  /**
   * Actualiza parcialmente una transacción existente
   */
  async updateTransaction(
    id: string,
    payload: UpdateTransactionPayload
  ): Promise<Transaction> {
    const response = await apiClient.patch<Transaction>(`/transactions/${id}`, payload);
    return response.data;
  },

  /**
   * Elimina una transacción por ID
   */
  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },
};

export default transactionsService;
