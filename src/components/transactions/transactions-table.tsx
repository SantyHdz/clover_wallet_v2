'use client';

import React from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Repeat,
  Wallet,
  Calendar,
  Tag,
  Plus,
} from 'lucide-react';
import { Transaction, Category } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryIcon } from '@/lib/category-icons';
import { cn, formatAmount } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: Transaction[];
  categories?: Category[];
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onCreateNew: () => void;
  currencySymbol?: string;
}

export function TransactionsTable({
  transactions,
  categories = [],
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
  currencySymbol = '$',
}: TransactionsTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-[#121212]">
            <TableRow className="border-[#2E2E2E]">
              <TableHead className="w-32 text-xs">Fecha</TableHead>
              <TableHead className="text-xs">Categoría</TableHead>
              <TableHead className="text-xs">Descripción</TableHead>
              <TableHead className="text-xs">Tipo</TableHead>
              <TableHead className="text-right text-xs">Monto</TableHead>
              <TableHead className="w-12 text-right text-xs"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-[#2E2E2E]">
                <TableCell><Skeleton className="h-4 w-20 bg-[#27272A]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28 bg-[#27272A]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40 bg-[#27272A]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16 bg-[#27272A]" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto bg-[#27272A]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-6 rounded-md bg-[#27272A]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-12 text-center shadow-lg">
        <Wallet className="h-12 w-12 text-[#2E2E2E] mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No se encontraron movimientos</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          No hay registros de transacciones para los filtros seleccionados.
        </p>
        <div className="mt-5">
          <Button
            onClick={onCreateNew}
            className="bg-[#10B981] text-white hover:bg-[#059669] text-xs font-semibold shadow-md shadow-[#10B981]/25 cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Registrar Primera Transacción
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#121212]">
            <TableRow className="border-[#2E2E2E] hover:bg-transparent">
              <TableHead className="w-32 text-xs font-semibold text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Categoría</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Descripción</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Tipo</TableHead>
              <TableHead className="text-right text-xs font-semibold text-muted-foreground">Monto</TableHead>
              <TableHead className="w-12 text-right text-xs font-semibold text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              // Find category either directly or via categories list fallback
              const category =
                tx.category || categories.find((c) => c.id === tx.category_id);
              const categoryColor = category?.color || '#71717A';

              return (
                <TableRow
                  key={tx.id}
                  className="border-[#2E2E2E] hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* 1. Fecha */}
                  <TableCell className="text-xs font-medium text-white whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDate(tx.transaction_date)}</span>
                    </div>
                  </TableCell>

                  {/* 2. Categoría */}
                  <TableCell className="text-xs">
                    {category ? (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#2E2E2E] bg-[#121212]">
                        <div
                          className="flex h-4 w-4 items-center justify-center rounded text-white text-[10px]"
                          style={{ backgroundColor: categoryColor }}
                        >
                          <CategoryIcon iconName={category.icon} className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-white font-medium truncate max-w-[130px]">
                          {category.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Sin categoría
                      </span>
                    )}
                  </TableCell>

                  {/* 3. Descripción & Notas */}
                  <TableCell className="max-w-[200px] sm:max-w-xs">
                    <div className="text-xs font-semibold text-white truncate">
                      {tx.description || (isIncome ? 'Ingreso Registrado' : 'Gasto Registrado')}
                    </div>
                    {tx.notes && (
                      <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {tx.notes}
                      </div>
                    )}
                  </TableCell>

                  {/* 4. Tipo & Recurrente */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-semibold py-0.5 gap-1',
                          isIncome
                            ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]'
                            : 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
                        )}
                      >
                        {isIncome ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            <span>Ingreso</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3" />
                            <span>Gasto</span>
                          </>
                        )}
                      </Badge>

                      {tx.is_recurring && (
                        <Badge
                          variant="outline"
                          className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[9px] py-0.5 px-1.5 gap-0.5"
                          title="Movimiento periódico"
                        >
                          <Repeat className="h-2.5 w-2.5" />
                          <span>Periódico</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* 5. Monto */}
                  <TableCell className="text-right whitespace-nowrap">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'
                      )}
                    >
                      {isIncome ? '+' : '-'}{currencySymbol}{formatAmount(tx.amount)}
                    </span>
                  </TableCell>

                  {/* 6. Acciones Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#27272A] hover:text-white transition-colors cursor-pointer outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Acciones</span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] p-1 text-white shadow-xl"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(tx)}
                          className="cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white focus:bg-[#27272A] focus:text-white"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-[#3B82F6]" />
                          <span>Editar</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#2E2E2E] my-1" />

                        <DropdownMenuItem
                          onClick={() => onDelete(tx)}
                          className="cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-xs text-[#EF4444] hover:bg-[#EF4444]/15 hover:text-[#EF4444] focus:bg-[#EF4444]/15 focus:text-[#EF4444]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
