'use client';

import { useQuery } from '@tanstack/react-query';
import reportsService from '@/lib/reports-service';

export const REPORTS_SUMMARY_KEY = ['reports-summary'];
export const REPORTS_MONTHLY_KEY = ['reports-monthly'];
export const REPORTS_BREAKDOWN_KEY = ['reports-breakdown'];

/**
 * Hook para consultar el resumen financiero global (KPIs)
 */
export function useReportsSummary() {
  return useQuery({
    queryKey: REPORTS_SUMMARY_KEY,
    queryFn: () => reportsService.getSummary(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para consultar el histórico mensual de un año
 */
export function useMonthlyReports(year?: number) {
  return useQuery({
    queryKey: [...REPORTS_MONTHLY_KEY, year],
    queryFn: () => reportsService.getMonthly(year),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para consultar el desglose por categorías
 */
export function useCategoryBreakdown(params?: {
  type?: 'income' | 'expense';
  year?: number;
  month?: number;
}) {
  return useQuery({
    queryKey: [...REPORTS_BREAKDOWN_KEY, params],
    queryFn: () => reportsService.getBreakdown(params),
    staleTime: 1000 * 60 * 5,
  });
}
