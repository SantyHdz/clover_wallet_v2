import apiClient from '@/lib/api-client';
import {
  Debt,
  CreateDebtPayload,
  UpdateDebtPayload,
  DebtStatus,
  DebtPayment,
  CreateDebtPaymentPayload,
} from '@/types';

export const debtsService = {
  /**
   * Obtiene la lista de deudas del usuario, opcionalmente filtrada por estado
   */
  async getDebts(status?: DebtStatus): Promise<Debt[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<Debt[]>('/debts/', { params });
    return response.data;
  },

  /**
   * Obtiene el detalle de una deuda específica
   */
  async getDebt(id: string): Promise<Debt> {
    const response = await apiClient.get<Debt>(`/debts/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva deuda
   */
  async createDebt(payload: CreateDebtPayload): Promise<Debt> {
    const response = await apiClient.post<Debt>('/debts/', payload);
    return response.data;
  },

  /**
   * Actualiza una deuda existente
   */
  async updateDebt(id: string, payload: UpdateDebtPayload): Promise<Debt> {
    const response = await apiClient.patch<Debt>(`/debts/${id}`, payload);
    return response.data;
  },

  /**
   * Elimina una deuda
   */
  async deleteDebt(id: string): Promise<void> {
    await apiClient.delete(`/debts/${id}`);
  },

  /**
   * Obtiene los abonos/pagos realizados a una deuda específica
   */
  async getDebtPayments(debtId: string): Promise<DebtPayment[]> {
    const response = await apiClient.get<DebtPayment[]>(`/debts/${debtId}/payments`);
    return response.data;
  },

  /**
   * Registra un nuevo abono para una deuda
   */
  async createDebtPayment(
    debtId: string,
    payload: CreateDebtPaymentPayload
  ): Promise<DebtPayment> {
    const response = await apiClient.post<DebtPayment>(`/debts/${debtId}/payments`, payload);
    return response.data;
  },

  /**
   * Elimina un abono registrado previamente
   */
  async deleteDebtPayment(debtId: string, paymentId: string): Promise<void> {
    await apiClient.delete(`/debts/${debtId}/payments/${paymentId}`);
  },
};

export default debtsService;
