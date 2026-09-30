'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit2,
  TrendingDown,
  TrendingUp,
  Calendar as CalendarIcon,
  Tag,
  Repeat,
  DollarSign,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction, TransactionType, RecurrenceType } from '@/types';
import { useCategories } from '@/hooks/use-categories';
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '@/hooks/use-transactions';
import { CategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

const transactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  category_id: z.string().nullable().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  transaction_date: z.string().min(1, 'La fecha es obligatoria'),
  is_recurring: z.boolean(),
  recurrence: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionToEdit?: Transaction | null;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transactionToEdit,
}: TransactionFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const isEditing = !!transactionToEdit;

  const defaultToday = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category_id: null,
      description: '',
      notes: '',
      transaction_date: defaultToday,
      is_recurring: false,
      recurrence: null,
    },
  });

  const selectedType = watch('type');
  const isRecurring = watch('is_recurring');
  const selectedCategoryId = watch('category_id');

  // Populate form when editing
  useEffect(() => {
    if (transactionToEdit) {
      reset({
        type: transactionToEdit.type,
        amount: Number(transactionToEdit.amount),
        category_id: transactionToEdit.category_id || null,
        description: transactionToEdit.description || '',
        notes: transactionToEdit.notes || '',
        transaction_date: transactionToEdit.transaction_date,
        is_recurring: transactionToEdit.is_recurring,
        recurrence: transactionToEdit.recurrence || null,
      });
    } else {
      reset({
        type: 'expense',
        amount: 0,
        category_id: null,
        description: '',
        notes: '',
        transaction_date: defaultToday,
        is_recurring: false,
        recurrence: null,
      });
    }
  }, [transactionToEdit, reset, defaultToday]);

  // Categories compatible with current type
  const availableCategories = categories.filter(
    (cat) => cat.type === selectedType || cat.type === 'both'
  );

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      const recurrenceValue: RecurrenceType | undefined =
        data.is_recurring && data.recurrence
          ? (data.recurrence as RecurrenceType)
          : undefined;

      if (isEditing && transactionToEdit) {
        await updateMutation.mutateAsync({
          id: transactionToEdit.id,
          payload: {
            type: data.type as TransactionType,
            amount: Number(data.amount),
            category_id: data.category_id || null,
            description: data.description?.trim() || undefined,
            notes: data.notes?.trim() || undefined,
            transaction_date: data.transaction_date,
            is_recurring: data.is_recurring,
            recurrence: recurrenceValue,
          },
        });
      } else {
        await createMutation.mutateAsync({
          type: data.type as TransactionType,
          amount: Number(data.amount),
          category_id: data.category_id || null,
          description: data.description?.trim() || undefined,
          notes: data.notes?.trim() || undefined,
          transaction_date: data.transaction_date,
          is_recurring: data.is_recurring,
          recurrence: recurrenceValue,
        });
      }
      onOpenChange(false);
    } catch {
      // Handled in hooks
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-[#2E2E2E] bg-[#1E1E1E] text-white p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit2 className="h-5 w-5 text-[#3B82F6]" />
                Editar Transacción
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-[#10B981]" />
                Nueva Transacción
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Modifica los datos del movimiento financiero seleccionado.'
              : 'Registra un ingreso o gasto para mantener actualizado tu balance.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* ─────────────────────────────────────────────────────────────
              1. TIPO DE TRANSACCIÓN (INGRESO / GASTO)
          ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setValue('type', 'expense');
                setValue('category_id', null);
              }}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                selectedType === 'expense'
                  ? 'border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444] shadow-md shadow-[#EF4444]/20'
                  : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
              )}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Gasto (- Egreso)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setValue('type', 'income');
                setValue('category_id', null);
              }}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                selectedType === 'income'
                  ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] shadow-md shadow-[#22C55E]/20'
                  : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Ingreso (+ Entrada)</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. MONTO & FECHA
          ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monto */}
            <div className="space-y-1.5">
              <Label htmlFor="tx-amount" className="text-xs font-semibold text-white">
                Monto <span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={cn(
                    'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-base font-bold text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]',
                    errors.amount && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                  )}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-[#EF4444]">{errors.amount.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-1.5">
              <Label htmlFor="tx-date" className="text-xs font-semibold text-white">
                Fecha <span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="tx-date"
                  type="date"
                  {...register('transaction_date')}
                  className={cn(
                    'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]',
                    errors.transaction_date && 'border-[#EF4444]'
                  )}
                />
              </div>
              {errors.transaction_date && (
                <p className="text-[11px] text-[#EF4444]">{errors.transaction_date.message}</p>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. CATEGORÍA
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Categoría</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-[#2E2E2E] rounded-xl bg-[#121212]">
              <button
                type="button"
                onClick={() => setValue('category_id', null)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer',
                  selectedCategoryId === null
                    ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981] font-semibold'
                    : 'border-[#2E2E2E] text-muted-foreground hover:bg-[#1E1E1E] hover:text-white'
                )}
              >
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Sin categoría</span>
              </button>

              {availableCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                const color = cat.color || '#10B981';

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category_id', cat.id)}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer truncate',
                      isSelected
                        ? 'border-[#10B981] bg-[#10B981]/15 text-white font-semibold'
                        : 'border-[#2E2E2E] text-muted-foreground hover:bg-[#1E1E1E] hover:text-white'
                    )}
                  >
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white text-[10px]"
                      style={{ backgroundColor: color }}
                    >
                      <CategoryIcon iconName={cat.icon} className="h-3 w-3" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. DESCRIPCIÓN & NOTAS
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-description" className="text-xs font-semibold text-white">
              Descripción Corta
            </Label>
            <Input
              id="tx-description"
              placeholder="Ej. Almuerzo de trabajo, Gasolina, Pago freelance..."
              {...register('description')}
              className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-notes" className="text-xs font-semibold text-white">
              Notas Adicionales (Opcional)
            </Label>
            <Textarea
              id="tx-notes"
              placeholder="Detalles sobre este movimiento..."
              rows={2}
              {...register('notes')}
              className="rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. MOVIMIENTO RECURRENTE (OPCIONAL)
          ───────────────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id="is-recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => {
                  setValue('is_recurring', !!checked);
                  if (!checked) setValue('recurrence', null);
                  else setValue('recurrence', 'monthly');
                }}
                className="border-[#2E2E2E] data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
              />
              <Label htmlFor="is-recurring" className="text-xs text-white cursor-pointer flex items-center gap-1.5">
                <Repeat className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Transacción recurrente / periódica</span>
              </Label>
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-[#2E2E2E] flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">Frecuencia de repetición:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((rec) => {
                    const active = watch('recurrence') === rec;
                    const labels: Record<string, string> = {
                      daily: 'Diaria',
                      weekly: 'Semanal',
                      monthly: 'Mensual',
                      yearly: 'Anual',
                    };
                    return (
                      <button
                        key={rec}
                        type="button"
                        onClick={() => setValue('recurrence', rec)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer',
                          active
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#1E1E1E] text-muted-foreground hover:text-white'
                        )}
                      >
                        {labels[rec]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              6. FOOTER CON BOTONES
          ───────────────────────────────────────────────────────────── */}
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
              className={cn(
                'text-xs font-semibold shadow-md cursor-pointer text-white',
                selectedType === 'income'
                  ? 'bg-[#22C55E] hover:bg-[#16A34A] shadow-[#22C55E]/25'
                  : 'bg-[#10B981] hover:bg-[#059669] shadow-[#10B981]/25'
              )}
            >
              {isPending ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                  <span>Guardando...</span>
                </>
              ) : isEditing ? (
                <>
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  <span>Actualizar Transacción</span>
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  <span>Guardar Transacción</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
