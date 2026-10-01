'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteSaving } from '@/hooks/use-savings';
import { Saving } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { formatMoney } from '@/lib/utils';

interface DeleteSavingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving?: Saving | null;
}

export function DeleteSavingDialog({
  open,
  onOpenChange,
  saving,
}: DeleteSavingDialogProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const deleteMutation = useDeleteSaving();

  if (!saving) return null;

  const currentAmount = Number(saving.current_amount || 0);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(saving.id);
      onOpenChange(false);
    } catch (e) {
      // Handled by toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full bg-[#1E1E1E] border-[#2E2E2E] text-white p-5 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                ¿Eliminar meta de ahorro?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Esta acción no se puede deshacer y borrará todo su historial de aportes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-[#121212] border border-[#2E2E2E] rounded-lg p-3.5 my-2 space-y-1 text-xs">
          <p className="text-muted-foreground">
            Meta a eliminar: <strong className="text-white">{saving.name}</strong>
          </p>
          <p className="text-muted-foreground">
            Saldo acumulado registrado:{' '}
            <strong className="text-[#10B981]">{formatMoney(currentAmount, currency)}</strong>
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-white hover:bg-[#27272A]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleteMutation.isPending ? 'Eliminando...' : 'Sí, Eliminar'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
