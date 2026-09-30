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
  Building2,
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
import { Debt } from '@/types';
import { useCreateDebt, useUpdateDebt } from '@/hooks/use-debts';
import { cn } from '@/lib/utils';

const debtSchema = z.object({
  creditor_name: z.string().min(1, 'El nombre del acreedor es obligatorio'),
  total_amount: z.number().positive('El monto total debe ser mayor a 0'),
  interest_rate: z.number().min(0, 'La tasa no puede ser negativa').optional().nullable(),
  due_date: z.string().optional().nullable(),
  description: z.string().optional(),
});

type DebtFormValues = z.infer<typeof debtSchema>;

interface DebtFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtToEdit?: Debt | null;
}

export function DebtFormDialog({
  open,
  onOpenChange,
  debtToEdit,
}: DebtFormDialogProps) {
  const createMutation = useCreateDebt();
  const updateMutation = useUpdateDebt();

  const isEditing = !!debtToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      creditor_name: '',
      total_amount: 0,
      interest_rate: null,
      due_date: null,
      description: '',
    },
  });

  useEffect(() => {
    if (debtToEdit) {
      reset({
        creditor_name: debtToEdit.creditor_name,
        total_amount: Number(debtToEdit.total_amount),
        interest_rate: debtToEdit.interest_rate ? Number(debtToEdit.interest_rate) : null,
        due_date: debtToEdit.due_date || null,
        description: debtToEdit.description || '',
      });
    } else {
      reset({
        creditor_name: '',
        total_amount: 0,
        interest_rate: null,
        due_date: null,
        description: '',
      });
    }
  }, [debtToEdit, reset]);

  const onSubmit = async (data: DebtFormValues) => {
    try {
      const payload = {
        creditor_name: data.creditor_name.trim(),
        total_amount: Number(data.total_amount),
        interest_rate: data.interest_rate ? Number(data.interest_rate) : undefined,
        due_date: data.due_date || undefined,
        description: data.description?.trim() || undefined,
      };

      if (isEditing && debtToEdit) {
        await updateMutation.mutateAsync({
          id: debtToEdit.id,
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
                <span>Editar Deuda</span>
              </>
            ) : (
              <>
                <div className="p-1.5 rounded-lg bg-[#F97316]/10 text-[#F97316]">
                  <Plus className="h-5 w-5" />
                </div>
                <span>Nueva Deuda (Pasivo)</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Actualiza los términos o detalles de tu obligación de pago.'
              : 'Registra un dinero que debes a un banco, persona o institución.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Acreedor */}
          <div className="space-y-1.5">
            <Label htmlFor="creditor_name" className="text-xs font-semibold text-white">
              Acreedor / Prestamista <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="creditor_name"
                placeholder="Ej. Banco Santander, Tarjeta Visa, Juan Pérez..."
                {...register('creditor_name')}
                className={cn(
                  'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#F97316]',
                  errors.creditor_name && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                )}
              />
            </div>
            {errors.creditor_name && (
              <p className="text-[11px] text-[#EF4444]">{errors.creditor_name.message}</p>
            )}
          </div>

          {/* Monto Total & Tasa de Interés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monto Total */}
            <div className="space-y-1.5">
              <Label htmlFor="total_amount" className="text-xs font-semibold text-white">
                Monto Total <span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('total_amount', { valueAsNumber: true })}
                  className={cn(
                    'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-sm font-bold text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#F97316]',
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
              <Label htmlFor="interest_rate" className="text-xs font-semibold text-white">
                Tasa de Interés (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="interest_rate"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  {...register('interest_rate', {
                    setValueAs: (v) => (v === '' || v === null ? null : parseFloat(v)),
                  })}
                  className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#F97316]"
                />
              </div>
              {errors.interest_rate && (
                <p className="text-[11px] text-[#EF4444]">{errors.interest_rate.message}</p>
              )}
            </div>
          </div>

          {/* Fecha Límite de Vencimiento */}
          <div className="space-y-1.5">
            <Label htmlFor="due_date" className="text-xs font-semibold text-white">
              Fecha Límite de Pago (Opcional)
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="due_date"
                type="date"
                {...register('due_date', {
                  setValueAs: (v) => (v === '' ? null : v),
                })}
                className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#F97316]"
              />
            </div>
          </div>

          {/* Descripción / Notas */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-white">
              Descripción / Motivo (Opcional)
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Ej. Crédito vehicular, préstamo para laptop, cuota mensual fija..."
                rows={2}
                {...register('description')}
                className="rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#F97316]"
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
              className="bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-md shadow-[#F97316]/25 cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                  <span>Guardando...</span>
                </>
              ) : isEditing ? (
                <>
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  <span>Actualizar Deuda</span>
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  <span>Guardar Deuda</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
