import apiClient from '@/lib/api-client';
import { ReportSummary, MonthlyReport, CategoryBreakdown } from '@/types';

export const reportsService = {
  /**
   * Obtiene el resumen financiero global y consolidado del usuario
   */
  async getSummary(): Promise<ReportSummary> {
    const response = await apiClient.get<ReportSummary>('/reports/summary');
    return response.data;
  },

  /**
   * Obtiene el desglose mensual de ingresos, gastos y balance de un año
   */
  async getMonthly(year?: number): Promise<MonthlyReport[]> {
    const response = await apiClient.get<MonthlyReport[]>('/reports/monthly', {
      params: { year },
    });
    return response.data;
  },

  /**
   * Obtiene el desglose por categoría para un tipo, año y mes determinado
   */
  async getBreakdown(params?: {
    type?: 'income' | 'expense';
    year?: number;
    month?: number;
  }): Promise<CategoryBreakdown[]> {
    const response = await apiClient.get<CategoryBreakdown[]>('/reports/breakdown', {
      params,
    });
    return response.data;
  },
};

export default reportsService;
