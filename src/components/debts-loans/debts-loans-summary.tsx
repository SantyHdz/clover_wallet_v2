'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn, getAmountFontSize } from '@/lib/utils';
import { AnimatedAmount } from '@/components/common/animated-amount';

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
  const currencySymbol = user?.currency === 'EUR' ? '€' : '$';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Tarjeta 1: Total General */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#3E3E3E] transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              {isDebts ? 'Total Deudas' : 'Total Préstamos'}
            </span>
            <div
              className={cn(
                'font-bold text-white mt-0.5 truncate',
                getAmountFontSize(formatMoney(totalAmount), 'xl')
              )}
              title={formatMoney(totalAmount)}
            >
              <AnimatedAmount
                value={totalAmount}
                prefix={currencySymbol}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block truncate">
              {count} {count === 1 ? (isDebts ? 'deuda registrada' : 'préstamo registrado') : (isDebts ? 'deudas registradas' : 'préstamos registrados')}
            </span>
          </div>
          <div
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center border shrink-0',
              isDebts
                ? 'bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]'
                : 'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]'
            )}
          >
            {isDebts ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 2: Monto Pagado / Recuperado */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#10B981]/40 transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[11px] text-muted-foreground font-medium">
              {isDebts ? 'Total Pagado' : 'Total Recuperado'}
            </span>
            <div
              className={cn(
                'font-bold text-[#10B981] mt-0.5 truncate',
                getAmountFontSize(formatMoney(completedAmount), 'xl')
              )}
              title={formatMoney(completedAmount)}
            >
              <AnimatedAmount
                value={completedAmount}
                prefix={currencySymbol}
              />
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-[#10B981]">{percentage}%</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 3: Saldo Pendiente */}
      <Card
        className={cn(
          'border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm transition-colors',
          isDebts ? 'hover:border-[#F97316]/40' : 'hover:border-[#3B82F6]/40'
        )}
      >
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              {isDebts ? 'Saldo por Pagar' : 'Saldo por Cobrar'}
            </span>
            <div
              className={cn(
                'font-bold mt-0.5 truncate',
                pendingAmount > 0
                  ? isDebts
                    ? 'text-[#F97316]'
                    : 'text-[#3B82F6]'
                  : 'text-white',
                getAmountFontSize(formatMoney(pendingAmount), 'xl')
              )}
              title={formatMoney(pendingAmount)}
            >
              <AnimatedAmount
                value={pendingAmount}
                prefix={currencySymbol}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block truncate">
              {pendingAmount === 0 ? '¡Al día! Todo saldado' : 'Pendiente de liquidación'}
            </span>
          </div>
          <div
            className={cn(
              'h-8 w-8 rounded-lg border flex items-center justify-center shrink-0',
              isDebts
                ? 'bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]'
                : 'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]'
            )}
          >
            <Clock className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta 4: Resumen de Obligaciones */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
        <CardContent className="p-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground font-medium">
              {isDebts ? 'Compromisos' : 'Prestamistas'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {count}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">
              {isDebts ? 'Acreedores activos' : 'Deudores activos'}
            </span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-[#121212] border border-[#2E2E2E] flex items-center justify-center text-muted-foreground">
            <Wallet className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
