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
  DollarSign,
  AlertOctagon,
  Calendar,
} from 'lucide-react';
import { Debt } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { DebtStatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface DebtsTableProps {
  debts: Debt[];
  onPay: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

export function DebtsTable({ debts, onPay, onEdit, onDelete }: DebtsTableProps) {
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
            <TableHead className="text-xs font-semibold text-muted-foreground">Acreedor</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Total Deuda</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Pagado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">Saldo Pendiente</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground w-36">Amortización</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Vencimiento</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Estado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt) => {
            const totalAmount = Number(debt.total_amount || 0);
            const paidAmount = Number(debt.paid_amount || 0);
            const remainingAmount = Math.max(0, totalAmount - paidAmount);
            const percentage =
              totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

            const isOverdue =
              debt.due_date &&
              debt.status !== 'paid' &&
              new Date(debt.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <TableRow
                key={debt.id}
                className="border-[#2E2E2E] hover:bg-[#27272A]/50 transition-colors"
              >
                {/* Acreedor */}
                <TableCell className="py-3.5">
                  <div className="font-semibold text-xs text-white">
                    {debt.creditor_name}
                  </div>
                  {debt.description && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {debt.description}
                    </div>
                  )}
                </TableCell>

                {/* Total */}
                <TableCell className="text-right py-3.5 text-xs font-semibold text-white">
                  {formatMoney(totalAmount)}
                </TableCell>

                {/* Pagado */}
                <TableCell className="text-right py-3.5 text-xs font-semibold text-emerald-400">
                  {formatMoney(paidAmount)}
                </TableCell>

                {/* Pendiente */}
                <TableCell className="text-right py-3.5 text-xs font-bold text-[#F97316]">
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
                        className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Vencimiento */}
                <TableCell className="py-3.5 text-xs">
                  {debt.due_date ? (
                    <span
                      className={cn(
                        'flex items-center gap-1 text-[11px]',
                        isOverdue ? 'text-rose-400 font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      {isOverdue && <AlertOctagon className="h-3 w-3 text-rose-400" />}
                      {debt.due_date}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Sin fecha</span>
                  )}
                </TableCell>

                {/* Estado */}
                <TableCell className="py-3.5">
                  <DebtStatusBadge status={isOverdue ? 'overdue' : debt.status} />
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      onClick={() => onPay(debt)}
                      className="h-7 px-2 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-white text-[11px] font-medium gap-1 cursor-pointer"
                      title="Abonar a esta deuda"
                    >
                      <DollarSign className="h-3 w-3" />
                      <span className="hidden xl:inline">Abonar</span>
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
                          onClick={() => onPay(debt)}
                          className="text-xs text-emerald-400 focus:bg-[#10B981]/15 focus:text-emerald-300 cursor-pointer"
                        >
                          <DollarSign className="mr-2 h-3.5 w-3.5" />
                          <span>Historial de Abonos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(debt)}
                          className="text-xs focus:bg-[#27272A] focus:text-white cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-400" />
                          <span>Editar</span>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
