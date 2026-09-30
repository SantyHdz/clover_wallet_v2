import apiClient from '@/lib/api-client';
import {
  Loan,
  CreateLoanPayload,
  UpdateLoanPayload,
  LoanStatus,
  LoanPayment,
  CreateLoanPaymentPayload,
} from '@/types';

export const loansService = {
  /**
   * Obtiene la lista de préstamos otorgados por el usuario, opcionalmente filtrada por estado
   */
  async getLoans(status?: LoanStatus): Promise<Loan[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<Loan[]>('/loans/', { params });
    return response.data;
  },

  /**
   * Obtiene el detalle de un préstamo específico
   */
  async getLoan(id: string): Promise<Loan> {
    const response = await apiClient.get<Loan>(`/loans/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo préstamo
   */
  async createLoan(payload: CreateLoanPayload): Promise<Loan> {
    const response = await apiClient.post<Loan>('/loans/', payload);
    return response.data;
  },

  /**
   * Actualiza un préstamo existente
   */
  async updateLoan(id: string, payload: UpdateLoanPayload): Promise<Loan> {
    const response = await apiClient.patch<Loan>(`/loans/${id}`, payload);
    return response.data;
  },

  /**
   * Elimina un préstamo
   */
  async deleteLoan(id: string): Promise<void> {
    await apiClient.delete(`/loans/${id}`);
  },

  /**
   * Obtiene los cobros/recuperaciones registradas de un préstamo específico
   */
  async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
    const response = await apiClient.get<LoanPayment[]>(`/loans/${loanId}/payments`);
    return response.data;
  },

  /**
   * Registra un nuevo cobro o abono recibido para un préstamo
   */
  async createLoanPayment(
    loanId: string,
    payload: CreateLoanPaymentPayload
  ): Promise<LoanPayment> {
    const response = await apiClient.post<LoanPayment>(`/loans/${loanId}/payments`, payload);
    return response.data;
  },

  /**
   * Elimina un cobro registrado previamente
   */
  async deleteLoanPayment(loanId: string, paymentId: string): Promise<void> {
    await apiClient.delete(`/loans/${loanId}/payments/${paymentId}`);
  },
};

export default loansService;
