'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import {
  TrendingDown,
  TrendingUp,
  CreditCard,
  Banknote,
  PiggyBank,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface DebtsLoansSummaryProps {
  type: 'debts' | 'loans';
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  count: number;
}

export function DebtsLoansSummary({
  type,
  totalAmount,
  completedAmount,
  pendingAmount,
  count,
}: DebtsLoansSummaryProps) {
  const { user } = useAuth();
  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const formatMoney = (val: number) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const percentage =
    totalAmount > 0 ? Math.min(100, Math.round((completedAmount / totalAmount) * 100)) : 0;

  const isDebts = type === 'debts';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tarjeta 1: Total General */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E]/80 backdrop-blur-sm relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isDebts ? 'bg-[#F97316]' : 'bg-[#3B82F6]'
          }`}
        />
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {isDebts ? 'Total Deudas' : 'Total Préstamos'}
            </span>
            <div
              className={`p-2 rounded-lg ${
                isDebts ? 'bg-[#F97316]/10 text-[#F97316]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
              }`}
            >
              {isDebts ? (
                <CreditCard className="h-4 w-4" />
              ) : (
                <Banknote className="h-4 w-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {formatMoney(totalAmount)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {count} {count === 1 ? (isDebts ? 'deuda registrada' : 'préstamo registrado') : (isDebts ? 'deudas registradas' : 'préstamos registrados')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 2: Monto Pagado / Recuperado */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E]/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {isDebts ? 'Total Pagado' : 'Total Recuperado'}
            </span>
            <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#10B981] tracking-tight">
              {formatMoney(completedAmount)}
            </h3>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-semibold text-emerald-400">{percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 3: Saldo Pendiente */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E]/80 backdrop-blur-sm relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isDebts ? 'bg-amber-500' : 'bg-sky-500'
          }`}
        />
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {isDebts ? 'Saldo por Pagar' : 'Saldo por Cobrar'}
            </span>
            <div
              className={`p-2 rounded-lg ${
                isDebts ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'
              }`}
            >
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-2xl font-bold tracking-tight ${
                pendingAmount > 0 ? (isDebts ? 'text-[#F97316]' : 'text-[#3B82F6]') : 'text-white'
              }`}
            >
              {formatMoney(pendingAmount)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingAmount === 0 ? '¡Al día! Todo saldado' : 'Pendiente de liquidación'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
