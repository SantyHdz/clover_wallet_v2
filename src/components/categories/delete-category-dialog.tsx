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
import { Category } from '@/types';
import { useDeleteCategory } from '@/hooks/use-categories';

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteMutation = useDeleteCategory();

  if (!category) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(category.id);
      onOpenChange(false);
    } catch {
      // Handled in mutation onError toast
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
            ¿Eliminar categoría "{category.name}"?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Esta acción no se puede deshacer. Las transacciones asociadas a esta categoría personalizada no se borrarán, pero perderán su etiqueta.
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
                <span>Eliminar Categoría</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
