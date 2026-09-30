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
  Building2,
  Calendar,
  Percent,
  MoreVertical,
  Edit2,
  Trash2,
  DollarSign,
  History,
  AlertOctagon,
} from 'lucide-react';
import { Debt } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { DebtStatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface DebtCardProps {
  debt: Debt;
  onPay: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

export function DebtCard({ debt, onPay, onEdit, onDelete }: DebtCardProps) {
  const { user } = useAuth();

  const totalAmount = Number(debt.total_amount || 0);
  const paidAmount = Number(debt.paid_amount || 0);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const percentage =
    totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const formatMoney = (val: number) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isOverdue =
    debt.due_date &&
    debt.status !== 'paid' &&
    new Date(debt.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

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
          debt.status === 'paid'
            ? 'bg-[#10B981]'
            : isOverdue
            ? 'bg-rose-500'
            : 'bg-[#F97316]'
        )}
      />

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6 space-y-4">
        {/* Encabezado: Nombre del Acreedor y Menú */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#F97316] transition-colors">
                {debt.creditor_name}
              </h3>
              <DebtStatusBadge status={isOverdue ? 'overdue' : debt.status} />
            </div>
            {debt.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {debt.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-[#27272A] hover:text-white flex items-center justify-center outline-none"
              aria-label="Opciones de deuda"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 border-[#2E2E2E] bg-[#1E1E1E] text-white">
              <DropdownMenuItem
                onClick={() => onPay(debt)}
                className="text-xs text-emerald-400 focus:bg-[#10B981]/15 focus:text-emerald-300 cursor-pointer"
              >
                <DollarSign className="mr-2 h-3.5 w-3.5" />
                <span>Abonar / Historial</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(debt)}
                className="text-xs focus:bg-[#27272A] focus:text-white cursor-pointer"
              >
                <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-400" />
                <span>Editar Deuda</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2E2E2E]" />
              <DropdownMenuItem
                onClick={() => onDelete(debt)}
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
              Total Deuda
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {formatMoney(totalAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#F97316] uppercase tracking-wider block">
              Pendiente
            </span>
            <span className="text-sm sm:text-base font-bold text-[#F97316]">
              {formatMoney(remainingAmount)}
            </span>
          </div>
        </div>

        {/* Barra de Progreso de Amortización */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Amortizado: {formatMoney(paidAmount)}</span>
            <span className="font-semibold text-emerald-400">{percentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Metadatos (Tasa & Fecha Límite) y Botón de Acción Rápida */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E2E2E] gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            {debt.interest_rate !== null && debt.interest_rate !== undefined && (
              <div className="flex items-center gap-1">
                <Percent className="h-3 w-3 text-muted-foreground" />
                <span>{debt.interest_rate}% interés</span>
              </div>
            )}
            {debt.due_date && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue ? 'text-rose-400 font-semibold' : 'text-muted-foreground'
                )}
              >
                {isOverdue ? (
                  <AlertOctagon className="h-3 w-3 text-rose-400" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                <span>Vence: {debt.due_date}</span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onPay(debt)}
            className="h-8 px-3 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-white text-xs font-semibold gap-1.5 cursor-pointer ml-auto"
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Abonar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
