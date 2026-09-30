'use client';

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { useDeleteTransaction } from '@/hooks/use-transactions';

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const deleteMutation = useDeleteTransaction();

  if (!transaction) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(transaction.id);
      onOpenChange(false);
    } catch {
      // Handled in hook toast
    }
  };

  const isIncome = transaction.type === 'income';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[#2E2E2E] bg-[#1E1E1E] text-white">
        <DialogHeader className="space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF4444]/15 text-[#EF4444] mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-white">
            ¿Eliminar esta transacción?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Se eliminará el registro de{' '}
            <strong className={isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
              {isIncome ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
            </strong>{' '}
            {transaction.description ? `("${transaction.description}")` : ''} del historial de movimientos y se actualizará tu balance global.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-[#EF4444] text-white hover:bg-[#DC2626] text-xs font-semibold gap-1.5 cursor-pointer"
          >
            {deleteMutation.isPending ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar Movimiento</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
