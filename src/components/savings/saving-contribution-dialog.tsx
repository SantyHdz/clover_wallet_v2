'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Calendar,
  DollarSign,
  FileText,
  PiggyBank,
  TrendingUp,
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
import { useCreateSavingContribution } from '@/hooks/use-savings';
import { Saving } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { formatMoney } from '@/lib/utils';
import { CategoryIcon } from '@/lib/category-icons';

const contributionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Ingresa un monto')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'El aporte debe ser mayor a 0',
    }),
  contribution_date: z.string().min(1, 'Selecciona una fecha'),
  note: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

interface SavingContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving?: Saving | null;
}

export function SavingContributionDialog({
  open,
  onOpenChange,
  saving,
}: SavingContributionDialogProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const currencySymbol = currency === 'EUR' ? '€' : '$';

  const createContributionMutation = useCreateSavingContribution();

  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: '',
      contribution_date: getTodayISO(),
      note: '',
    },
  });

  const enteredAmount = parseFloat(watch('amount') || '0');

  useEffect(() => {
    if (open) {
      reset({
        amount: '',
        contribution_date: getTodayISO(),
        note: '',
      });
    }
  }, [open, reset]);

  if (!saving) return null;

  const currentAmount = Number(saving.current_amount || 0);
  const targetAmount = saving.target_amount ? Number(saving.target_amount) : null;
  const isGoal = saving.type === 'goal' && targetAmount !== null && targetAmount > 0;

  const validAmount = !isNaN(enteredAmount) && enteredAmount > 0 ? enteredAmount : 0;
  const newTotal = currentAmount + validAmount;

  const currentPct = isGoal
    ? Math.min(100, Math.round((currentAmount / targetAmount!) * 100))
    : 100;
  const newPct = isGoal
    ? Math.min(100, Math.round((newTotal / targetAmount!) * 100))
    : 100;

  const accentColor = saving.color || '#10B981';

  const onSubmit = async (values: ContributionFormValues) => {
    try {
      await createContributionMutation.mutateAsync({
        savingId: saving.id,
        payload: {
          amount: parseFloat(values.amount),
          contribution_date: values.contribution_date,
          note: values.note?.trim() || undefined,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] bg-[#1E1E1E] border-[#2E2E2E] text-white p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-white/5"
              style={{
                backgroundColor: `${accentColor}25`,
                color: accentColor,
              }}
            >
              <CategoryIcon iconName={saving.icon || 'piggybank'} className="h-4.5 w-4.5" />
            </div>
            <span>Aportar a {saving.name}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Ingresa el monto que deseas sumar a esta meta o fondo.
          </DialogDescription>
        </DialogHeader>

        {/* Live Preview Card */}
        <div className="bg-[#121212] border border-[#2E2E2E] rounded-lg p-3.5 mt-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Actual:</span>
            <span className="font-semibold text-white">
              {formatMoney(currentAmount, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Nuevo Total Estimado:</span>
            <span className="font-bold text-[#10B981] text-sm">
              {formatMoney(newTotal, currency)}
            </span>
          </div>

          {isGoal && (
            <div className="pt-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                <span>Progreso: {currentPct}% → <strong className="text-white">{newPct}%</strong></span>
                <span>Meta: {formatMoney(targetAmount!, currency)}</span>
              </div>
              <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${newPct}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Monto del Aporte */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-semibold text-white">
              Monto a Aportar ({currencySymbol}) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                {currencySymbol}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                autoFocus
                className="bg-[#121212] border-[#2E2E2E] text-white pl-7 text-base font-semibold focus-visible:ring-[#10B981]"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-[#EF4444] font-medium">{errors.amount.message}</p>
            )}
          </div>

          {/* Fecha del Aporte */}
          <div className="space-y-1.5">
            <Label htmlFor="contribution_date" className="text-xs font-semibold text-white">
              Fecha del Depósito *
            </Label>
            <Input
              id="contribution_date"
              type="date"
              className="bg-[#121212] border-[#2E2E2E] text-white focus-visible:ring-[#10B981]"
              {...register('contribution_date')}
            />
            {errors.contribution_date && (
              <p className="text-xs text-[#EF4444] font-medium">
                {errors.contribution_date.message}
              </p>
            )}
          </div>

          {/* Nota opcional */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-xs font-semibold text-white">
              Nota o Concepto (Opcional)
            </Label>
            <Textarea
              id="note"
              rows={2}
              placeholder="Ej. Ahorro de quincena, bono de trabajo, vuelto extra..."
              className="bg-[#121212] border-[#2E2E2E] text-white resize-none text-xs focus-visible:ring-[#10B981]"
              {...register('note')}
            />
            {errors.note && (
              <p className="text-xs text-[#EF4444] font-medium">{errors.note.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-white hover:bg-[#27272A]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createContributionMutation.isPending}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-medium gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Aporte</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
