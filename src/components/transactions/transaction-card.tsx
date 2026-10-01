'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Repeat,
  Tag,
} from 'lucide-react';
import { Transaction, Category } from '@/types';
import { CategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  category?: Category | null;
  currencySymbol: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionCard({
  transaction,
  category,
  currencySymbol,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const amount = Number(transaction.amount || 0);

  // Formatear monto con separador de miles y decimales
  const formattedAmount = `${isIncome ? '+' : '-'}${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Formatear fecha
  const formattedDate = transaction.transaction_date
    ? new Date(transaction.transaction_date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';

  const cat = category || transaction.category;

  return (
    <Card className="border-[#2E2E2E] bg-[#1E1E1E] transition-all duration-200 hover:border-[#3E3E3E] hover:shadow-lg relative overflow-hidden group">
      {/* Indicador de barra lateral de tipo */}
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 w-1',
          isIncome ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
        )}
      />

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6 space-y-3.5">
        {/* Fila 1: Categoría, Badge de Tipo y Menú de Acciones */}
        <div className="flex items-center justify-between gap-2">
          {/* Categoría */}
          <div className="flex items-center gap-2 min-w-0">
            {cat ? (
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: cat.color || '#10B981' }}
              >
                <CategoryIcon iconName={cat.icon} className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="h-7 w-7 rounded-lg bg-[#27272A] flex items-center justify-center text-muted-foreground shrink-0">
                <Tag className="h-3.5 w-3.5" />
              </div>
            )}

            <span className="text-xs font-semibold text-white truncate max-w-[130px] sm:max-w-[160px]">
              {cat?.name || 'Sin categoría'}
            </span>

            {/* Badge de Tipo */}
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] px-1.5 py-0.2 border shrink-0 font-medium',
                isIncome
                  ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]'
                  : 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]'
              )}
            >
              {isIncome ? (
                <TrendingUp className="mr-1 h-2.5 w-2.5" />
              ) : (
                <TrendingDown className="mr-1 h-2.5 w-2.5" />
              )}
              {isIncome ? 'Ingreso' : 'Gasto'}
            </Badge>
          </div>

          {/* Menú de Acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:bg-[#27272A] hover:text-white flex items-center justify-center outline-none shrink-0"
              aria-label="Opciones de transacción"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 border-[#2E2E2E] bg-[#1E1E1E] text-white"
            >
              <DropdownMenuItem
                onClick={() => onEdit(transaction)}
                className="text-xs focus:bg-[#27272A] focus:text-white cursor-pointer"
              >
                <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-400" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2E2E2E]" />
              <DropdownMenuItem
                onClick={() => onDelete(transaction)}
                className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Fila 2: Descripción y Notas */}
        <div className="space-y-1 min-h-[38px]">
          <h4 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {transaction.description || (isIncome ? 'Ingreso registrado' : 'Gasto registrado')}
          </h4>
          {transaction.notes ? (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {transaction.notes}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">
              Sin notas adicionales
            </p>
          )}
        </div>

        {/* Fila 3: Monto y Metadatos (Fecha / Recurrencia) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#2E2E2E] gap-2">
          {/* Fecha y Recurrencia */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            {transaction.is_recurring && (
              <Badge
                variant="outline"
                className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[9px] px-1.5 py-0 h-4"
              >
                <Repeat className="mr-0.5 h-2.5 w-2.5" />
                <span>{transaction.recurrence || 'Recurrente'}</span>
              </Badge>
            )}
          </div>

          {/* Monto */}
          <div
            className={cn(
              'text-base sm:text-lg font-bold tracking-tight shrink-0',
              isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'
            )}
          >
            {formattedAmount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
