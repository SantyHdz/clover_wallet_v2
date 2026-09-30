'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit2,
  DollarSign,
  Calendar as CalendarIcon,
  User,
  Percent,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loan } from '@/types';
import { useCreateLoan, useUpdateLoan } from '@/hooks/use-loans';
import { cn } from '@/lib/utils';

const loanSchema = z.object({
  debtor_name: z.string().min(1, 'El nombre del deudor es obligatorio'),
  total_amount: z.number().positive('El monto total debe ser mayor a 0'),
  interest_rate: z.number().min(0, 'La tasa no puede ser negativa').optional().nullable(),
  due_date: z.string().optional().nullable(),
  description: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanSchema>;

interface LoanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanToEdit?: Loan | null;
}

export function LoanFormDialog({
  open,
  onOpenChange,
  loanToEdit,
}: LoanFormDialogProps) {
  const createMutation = useCreateLoan();
  const updateMutation = useUpdateLoan();

  const isEditing = !!loanToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      debtor_name: '',
      total_amount: 0,
      interest_rate: null,
      due_date: null,
      description: '',
    },
  });

  useEffect(() => {
    if (loanToEdit) {
      reset({
        debtor_name: loanToEdit.debtor_name,
        total_amount: Number(loanToEdit.total_amount),
        interest_rate: loanToEdit.interest_rate ? Number(loanToEdit.interest_rate) : null,
        due_date: loanToEdit.due_date || null,
        description: loanToEdit.description || '',
      });
    } else {
      reset({
        debtor_name: '',
        total_amount: 0,
        interest_rate: null,
        due_date: null,
        description: '',
      });
    }
  }, [loanToEdit, reset]);

  const onSubmit = async (data: LoanFormValues) => {
    try {
      const payload = {
        debtor_name: data.debtor_name.trim(),
        total_amount: Number(data.total_amount),
        interest_rate: data.interest_rate ? Number(data.interest_rate) : undefined,
        due_date: data.due_date || undefined,
        description: data.description?.trim() || undefined,
      };

      if (isEditing && loanToEdit) {
        await updateMutation.mutateAsync({
          id: loanToEdit.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // Manejado en los hooks con toast.error
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[#2E2E2E] bg-[#1E1E1E] text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit2 className="h-5 w-5 text-[#3B82F6]" />
                <span>Editar Préstamo</span>
              </>
            ) : (
              <>
                <div className="p-1.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                  <Plus className="h-5 w-5" />
                </div>
                <span>Nuevo Préstamo (Activo por Cobrar)</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Modifica los datos del dinero que prestaste a un tercero.'
              : 'Registra un préstamo concedido a una persona, socio o familiar.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Deudor */}
          <div className="space-y-1.5">
            <Label htmlFor="debtor_name" className="text-xs font-semibold text-white">
              Deudor / Persona que te debe <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="debtor_name"
                placeholder="Ej. Carlos Mendoza, Amigo / Colega, Empresa X..."
                {...register('debtor_name')}
                className={cn(
                  'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]',
                  errors.debtor_name && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                )}
              />
            </div>
            {errors.debtor_name && (
              <p className="text-[11px] text-[#EF4444]">{errors.debtor_name.message}</p>
            )}
          </div>

          {/* Monto Total & Tasa de Interés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monto Total */}
            <div className="space-y-1.5">
              <Label htmlFor="loan_total_amount" className="text-xs font-semibold text-white">
                Monto Prestado <span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loan_total_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('total_amount', { valueAsNumber: true })}
                  className={cn(
                    'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-sm font-bold text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]',
                    errors.total_amount && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                  )}
                />
              </div>
              {errors.total_amount && (
                <p className="text-[11px] text-[#EF4444]">{errors.total_amount.message}</p>
              )}
            </div>

            {/* Tasa de Interés */}
            <div className="space-y-1.5">
              <Label htmlFor="loan_interest_rate" className="text-xs font-semibold text-white">
                Tasa de Interés (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loan_interest_rate"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  {...register('interest_rate', {
                    setValueAs: (v) => (v === '' || v === null ? null : parseFloat(v)),
                  })}
                  className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
                />
              </div>
              {errors.interest_rate && (
                <p className="text-[11px] text-[#EF4444]">{errors.interest_rate.message}</p>
              )}
            </div>
          </div>

          {/* Fecha Límite de Recuperación */}
          <div className="space-y-1.5">
            <Label htmlFor="loan_due_date" className="text-xs font-semibold text-white">
              Fecha Estimada de Devolución (Opcional)
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="loan_due_date"
                type="date"
                {...register('due_date', {
                  setValueAs: (v) => (v === '' ? null : v),
                })}
                className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Descripción / Motivo */}
          <div className="space-y-1.5">
            <Label htmlFor="loan_description" className="text-xs font-semibold text-white">
              Motivo o Acuerdo (Opcional)
            </Label>
            <div className="relative">
              <Textarea
                id="loan_description"
                placeholder="Ej. Para compra de materiales, pago quincenal acordado..."
                rows={2}
                {...register('description')}
                className="rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-3 border-t border-[#2E2E2E] flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md shadow-[#3B82F6]/25 cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                  <span>Guardando...</span>
                </>
              ) : isEditing ? (
                <>
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  <span>Actualizar Préstamo</span>
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  <span>Guardar Préstamo</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
