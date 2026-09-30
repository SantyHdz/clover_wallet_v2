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
import { Debt } from '@/types';
import { useDeleteDebt } from '@/hooks/use-debts';
import { useAuth } from '@/contexts/auth-context';

interface DeleteDebtDialogProps {
  debt: Debt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDebtDialog({
  debt,
  open,
  onOpenChange,
}: DeleteDebtDialogProps) {
  const { user } = useAuth();
  const deleteMutation = useDeleteDebt();

  if (!debt) return null;

  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(debt.id);
      onOpenChange(false);
    } catch {
      // Manejado en hook con toast.error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[#2E2E2E] bg-[#1E1E1E] text-white">
        <DialogHeader className="space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF4444]/15 text-[#EF4444] mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-white">
            ¿Eliminar esta deuda?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Se eliminará permanentemente la obligación con{' '}
            <strong className="text-white">{debt.creditor_name}</strong> por un monto de{' '}
            <strong className="text-[#F97316]">
              {currencySymbol}{Number(debt.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </strong>{' '}
            junto con todos sus abonos registrados. Esta acción no se puede deshacer.
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
                <span>Eliminar Deuda</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
