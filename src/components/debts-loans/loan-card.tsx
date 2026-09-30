'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Calendar,
  Percent,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  History,
  AlertTriangle,
} from 'lucide-react';
import { Loan } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { LoanStatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface LoanCardProps {
  loan: Loan;
  onPay: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}

export function LoanCard({ loan, onPay, onEdit, onDelete }: LoanCardProps) {
  const { user } = useAuth();

  const totalAmount = Number(loan.total_amount || 0);
  const recoveredAmount = Number(loan.recovered_amount || 0);
  const remainingAmount = Math.max(0, totalAmount - recoveredAmount);
  const percentage =
    totalAmount > 0 ? Math.min(100, Math.round((recoveredAmount / totalAmount) * 100)) : 0;

  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const formatMoney = (val: number) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isOverdue =
    loan.due_date &&
    loan.status !== 'recovered' &&
    new Date(loan.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <Card
      className={cn(
        'border-[#2E2E2E] bg-[#1E1E1E] transition-all duration-200 hover:border-[#3E3E3E] hover:shadow-lg relative overflow-hidden group',
        isOverdue && 'border-rose-500/40 bg-[#1E1E1E]'
      )}
    >
      {/* Indicador de barra lateral de estado */}
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 w-1',
          loan.status === 'recovered'
            ? 'bg-[#10B981]'
            : isOverdue
            ? 'bg-rose-500'
            : 'bg-[#3B82F6]'
        )}
      />

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6 space-y-4">
        {/* Encabezado: Nombre del Deudor y Menú */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#3B82F6] transition-colors">
                {loan.debtor_name}
              </h3>
              <LoanStatusBadge status={isOverdue ? 'overdue' : loan.status} />
            </div>
            {loan.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {loan.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-[#27272A] hover:text-white flex items-center justify-center outline-none"
              aria-label="Opciones de préstamo"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 border-[#2E2E2E] bg-[#1E1E1E] text-white">
              <DropdownMenuItem
                onClick={() => onPay(loan)}
                className="text-xs text-blue-400 focus:bg-[#3B82F6]/15 focus:text-blue-300 cursor-pointer"
              >
                <TrendingUp className="mr-2 h-3.5 w-3.5" />
                <span>Cobrar / Historial</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(loan)}
                className="text-xs focus:bg-[#27272A] focus:text-white cursor-pointer"
              >
                <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-400" />
                <span>Editar Préstamo</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2E2E2E]" />
              <DropdownMenuItem
                onClick={() => onDelete(loan)}
                className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Métricas Principales: Total vs Pendiente */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#121212] border border-[#2E2E2E]">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
              Total Prestado
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {formatMoney(totalAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#3B82F6] uppercase tracking-wider block">
              Por Cobrar
            </span>
            <span className="text-sm sm:text-base font-bold text-[#3B82F6]">
              {formatMoney(remainingAmount)}
            </span>
          </div>
        </div>

        {/* Barra de Progreso de Recuperación */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Recuperado: {formatMoney(recoveredAmount)}</span>
            <span className="font-semibold text-emerald-400">{percentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Metadatos (Tasa & Fecha Límite) y Botón de Acción Rápida */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E2E2E] gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            {loan.interest_rate !== null && loan.interest_rate !== undefined && (
              <div className="flex items-center gap-1">
                <Percent className="h-3 w-3 text-muted-foreground" />
                <span>{loan.interest_rate}% rendimiento</span>
              </div>
            )}
            {loan.due_date && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue ? 'text-rose-400 font-semibold' : 'text-muted-foreground'
                )}
              >
                {isOverdue ? (
                  <AlertTriangle className="h-3 w-3 text-rose-400" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                <span>Plazo: {loan.due_date}</span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onPay(loan)}
            className="h-8 px-3 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white text-xs font-semibold gap-1.5 cursor-pointer ml-auto"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Cobrar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
