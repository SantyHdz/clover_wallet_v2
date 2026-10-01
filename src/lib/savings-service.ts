import apiClient from '@/lib/api-client';
import {
  Saving,
  CreateSavingPayload,
  UpdateSavingPayload,
  SavingContribution,
  CreateSavingContributionPayload,
  SavingSummary,
  SavingProjection,
  MonthlyContribution,
  SavingStatus,
} from '@/types';

export const savingsService = {
  /**
   * Obtiene la lista de ahorros y metas financieras, opcionalmente filtrada por status
   */
  async getSavings(status?: SavingStatus | string): Promise<Saving[]> {
    const params = status && status !== 'all' ? { status } : {};
    const response = await apiClient.get<Saving[]>('/savings/', { params });
    return response.data;
  },

  /**
   * Obtiene el resumen global de ahorros (total guardado, total meta, contadores)
   */
  async getSummary(): Promise<SavingSummary> {
    const response = await apiClient.get<SavingSummary>('/savings/summary');
    return response.data;
  },

  /**
   * Obtiene las proyecciones inteligentes de ahorro basadas en el promedio de los últimos 90 días
   */
  async getProjections(): Promise<SavingProjection[]> {
    const response = await apiClient.get<SavingProjection[]>('/savings/projections');
    return response.data;
  },

  /**
   * Obtiene el detalle de un ahorro específico por ID
   */
  async getSaving(id: string): Promise<Saving> {
    const response = await apiClient.get<Saving>(`/savings/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva meta de ahorro o fondo libre
   */
  async createSaving(payload: CreateSavingPayload): Promise<Saving> {
    const response = await apiClient.post<Saving>('/savings/', payload);
    return response.data;
  },

  /**
   * Actualiza los datos de un ahorro existente
   */
  async updateSaving(id: string, payload: UpdateSavingPayload): Promise<Saving> {
    const response = await apiClient.patch<Saving>(`/savings/${id}`, payload);
    return response.data;
  },

  /**
   * Elimina una meta de ahorro
   */
  async deleteSaving(id: string): Promise<void> {
    await apiClient.delete(`/savings/${id}`);
  },

  /**
   * Obtiene el historial de aportes de un ahorro específico
   */
  async getContributions(savingId: string): Promise<SavingContribution[]> {
    const response = await apiClient.get<SavingContribution[]>(
      `/savings/${savingId}/contributions`
    );
    return response.data;
  },

  /**
   * Registra un nuevo aporte en una meta de ahorro
   */
  async createContribution(
    savingId: string,
    payload: CreateSavingContributionPayload
  ): Promise<SavingContribution> {
    const response = await apiClient.post<SavingContribution>(
      `/savings/${savingId}/contributions`,
      payload
    );
    return response.data;
  },

  /**
   * Elimina un aporte individual
   */
  async deleteContribution(savingId: string, contributionId: string): Promise<void> {
    await apiClient.delete(`/savings/${savingId}/contributions/${contributionId}`);
  },

  /**
   * Obtiene el desglose de aportes mensuales para un año determinado
   */
  async getMonthlyContributions(
    savingId: string,
    year: number
  ): Promise<MonthlyContribution[]> {
    const response = await apiClient.get<MonthlyContribution[]>(
      `/savings/${savingId}/monthly`,
      { params: { year } }
    );
    return response.data;
  },
};

export default savingsService;
