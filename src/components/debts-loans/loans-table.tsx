'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Loan } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { LoanStatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface LoansTableProps {
  loans: Loan[];
  onPay: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}

export function LoansTable({ loans, onPay, onEdit, onDelete }: LoansTableProps) {
  const { user } = useAuth();
  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const formatMoney = (val: number) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#121212]/80 border-b border-[#2E2E2E]">
          <TableRow className="hover:bg-transparent border-[#2E2E2E]">
            <TableHead className="text-xs font-semibold text-muted-foreground">Deudor</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Total Prestado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Recuperado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Por Cobrar</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground w-36">Recuperación</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Plazo</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Estado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => {
            const totalAmount = Number(loan.total_amount || 0);
            const recoveredAmount = Number(loan.recovered_amount || 0);
            const remainingAmount = Math.max(0, totalAmount - recoveredAmount);
            const percentage =
              totalAmount > 0 ? Math.min(100, Math.round((recoveredAmount / totalAmount) * 100)) : 0;

            const isOverdue =
              loan.due_date &&
              loan.status !== 'recovered' &&
              new Date(loan.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <TableRow
                key={loan.id}
                className="border-[#2E2E2E] hover:bg-[#27272A]/50 transition-colors"
              >
                {/* Deudor */}
                <TableCell className="py-3.5">
                  <div className="font-semibold text-xs text-white">
                    {loan.debtor_name}
                  </div>
                  {loan.description && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {loan.description}
                    </div>
                  )}
                </TableCell>

                {/* Total */}
                <TableCell className="text-right py-3.5 text-xs font-semibold text-white">
                  {formatMoney(totalAmount)}
                </TableCell>

                {/* Recuperado */}
                <TableCell className="text-right py-3.5 text-xs font-semibold text-emerald-400">
                  {formatMoney(recoveredAmount)}
                </TableCell>

                {/* Por Cobrar */}
                <TableCell className="text-right py-3.5 text-xs font-bold text-[#3B82F6]">
                  {formatMoney(remainingAmount)}
                </TableCell>

                {/* Progreso */}
                <TableCell className="py-3.5">
                  <div className="space-y-1 w-full max-w-[120px]">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Progreso</span>
                      <span className="font-semibold text-emerald-400">{percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#27272A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Plazo */}
                <TableCell className="py-3.5 text-xs">
                  {loan.due_date ? (
                    <span
                      className={cn(
                        'flex items-center gap-1 text-[11px]',
                        isOverdue ? 'text-rose-400 font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      {isOverdue && <AlertTriangle className="h-3 w-3 text-rose-400" />}
                      {loan.due_date}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Sin fecha</span>
                  )}
                </TableCell>

                {/* Estado */}
                <TableCell className="py-3.5">
                  <LoanStatusBadge status={isOverdue ? 'overdue' : loan.status} />
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      onClick={() => onPay(loan)}
                      className="h-7 px-2 bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white text-[11px] font-medium gap-1 cursor-pointer"
                      title="Registrar cobro de este préstamo"
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span className="hidden xl:inline">Cobrar</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-7 w-7 rounded-md p-0 text-muted-foreground hover:bg-[#27272A] hover:text-white flex items-center justify-center outline-none"
                        aria-label="Opciones"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 border-[#2E2E2E] bg-[#1E1E1E] text-white">
                        <DropdownMenuItem
                          onClick={() => onPay(loan)}
                          className="text-xs text-blue-400 focus:bg-[#3B82F6]/15 focus:text-blue-300 cursor-pointer"
                        >
                          <TrendingUp className="mr-2 h-3.5 w-3.5" />
                          <span>Historial de Cobros</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(loan)}
                          className="text-xs focus:bg-[#27272A] focus:text-white cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-400" />
                          <span>Editar</span>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
