'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DollarSign,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  History,
  CheckCircle2,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loan } from '@/types';
import {
  useLoanPayments,
  useCreateLoanPayment,
  useDeleteLoanPayment,
} from '@/hooks/use-loans';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { LoanStatusBadge } from './status-badge';

const paymentSchema = z.object({
  amount: z.number().positive('El monto cobrado debe ser mayor a 0'),
  payment_date: z.string().min(1, 'La fecha es obligatoria'),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface LoanPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan | null;
}

export function LoanPaymentDialog({
  open,
  onOpenChange,
  loan,
}: LoanPaymentDialogProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const defaultToday = new Date().toISOString().split('T')[0];

  const {
    data: payments = [],
    isLoading: isLoadingPayments,
  } = useLoanPayments(loan?.id);

  const createPaymentMutation = useCreateLoanPayment(loan?.id || '');
  const deletePaymentMutation = useDeleteLoanPayment(loan?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      payment_date: defaultToday,
      notes: '',
    },
  });

  if (!loan) return null;

  const totalAmount = Number(loan.total_amount || 0);
  const recoveredAmount = Number(loan.recovered_amount || 0);
  const remainingAmount = Math.max(0, totalAmount - recoveredAmount);
  const percentage =
    totalAmount > 0 ? Math.min(100, Math.round((recoveredAmount / totalAmount) * 100)) : 0;

  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  const formatMoney = (val: number) => {
    return `${currencySymbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      await createPaymentMutation.mutateAsync({
        amount: Number(data.amount),
        payment_date: data.payment_date,
        notes: data.notes?.trim() || undefined,
      });
      reset({
        amount: 0,
        payment_date: defaultToday,
        notes: '',
      });
      setActiveTab('history');
    } catch {
      // Manejado en hook con toast.error
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePaymentMutation.mutateAsync(paymentId);
    } catch {
      // Manejado en hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-[#2E2E2E] bg-[#1E1E1E] text-white p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span>Registrar Cobro de Préstamo</span>
            </DialogTitle>
            <LoanStatusBadge status={loan.status} />
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Deudor: <span className="text-white font-medium">{loan.debtor_name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Resumen de Recuperación */}
        <div className="mt-2 rounded-xl border border-[#2E2E2E] bg-[#121212] p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                Total Prestado
              </span>
              <span className="text-sm font-bold text-white">{formatMoney(totalAmount)}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
                Recuperado
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {formatMoney(recoveredAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-sky-400 uppercase tracking-wider block">
                Por Cobrar
              </span>
              <span className="text-sm font-bold text-[#3B82F6]">
                {formatMoney(remainingAmount)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Progreso de Recuperación</span>
              <span className="font-semibold text-emerald-400">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-[#10B981] transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Selector de Pestaña: Registrar Cobro vs Historial */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-[#121212] border border-[#2E2E2E]">
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'new'
                ? 'bg-[#3B82F6] text-white shadow-sm'
                : 'text-muted-foreground hover:text-white'
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Registrar Cobro</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'history'
                ? 'bg-[#3B82F6] text-white shadow-sm'
                : 'text-muted-foreground hover:text-white'
            )}
          >
            <History className="h-3.5 w-3.5" />
            <span>Historial ({payments.length})</span>
          </button>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {remainingAmount <= 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-emerald-400">
                  ¡Este préstamo ha sido 100% recuperado!
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Si recibiste cobros adicionales o intereses no contemplados, puedes registrarlos aquí.
                </p>
              </div>
            ) : null}

            {/* Monto & Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="loan-pay-amount" className="text-xs font-semibold text-white">
                  Monto Recibido <span className="text-[#EF4444]">*</span>
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CurrencyInput
                      id="loan-pay-amount"
                      prefix="$ "
                      placeholder={remainingAmount > 0 ? remainingAmount.toFixed(2) : '0.00'}
                      value={!value ? '' : value}
                      onValueChange={(_, __, values) => {
                        onChange(values?.float ?? 0);
                      }}
                      error={!!errors.amount}
                      className="h-10 rounded-xl border-[#2E2E2E] bg-[#121212] text-sm font-bold text-white placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-[11px] text-[#EF4444]">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="loan-pay-date" className="text-xs font-semibold text-white">
                  Fecha del Cobro <span className="text-[#EF4444]">*</span>
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="loan-pay-date"
                    type="date"
                    {...register('payment_date')}
                    className={cn(
                      'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]',
                      errors.payment_date && 'border-[#EF4444]'
                    )}
                  />
                </div>
                {errors.payment_date && (
                  <p className="text-[11px] text-[#EF4444]">{errors.payment_date.message}</p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-1.5">
              <Label htmlFor="loan-pay-notes" className="text-xs font-semibold text-white">
                Nota o Detalle (Opcional)
              </Label>
              <Textarea
                id="loan-pay-notes"
                placeholder="Ej. Transferencia Nequi/Daviplata, abono en efectivo..."
                rows={2}
                {...register('notes')}
                className="rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="submit"
                disabled={createPaymentMutation.isPending}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md shadow-[#3B82F6]/25 cursor-pointer w-full sm:w-auto"
              >
                {createPaymentMutation.isPending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                    <span>Registrando Cobro...</span>
                  </>
                ) : (
                  <>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    <span>Confirmar Cobro</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 mt-2">
            {isLoadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
              </div>
            ) : payments.length === 0 ? (
              <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-8 text-center text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Aún no se han recibido pagos para este préstamo.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] text-xs transition-colors hover:border-[#3E3E3E]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">
                          +{formatMoney(p.amount)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          • {p.payment_date}
                        </span>
                      </div>
                      {p.notes && (
                        <p className="text-[11px] text-muted-foreground italic truncate max-w-[240px]">
                          {p.notes}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePayment(p.id)}
                      disabled={deletePaymentMutation.isPending}
                      className="h-7 w-7 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Eliminar este cobro"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
