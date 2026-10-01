'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Target,
  PiggyBank,
  Check,
  Search,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Sparkles,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AVAILABLE_ICONS,
  CATEGORY_COLORS,
  CategoryIcon,
} from '@/lib/category-icons';
import { useCreateSaving, useUpdateSaving } from '@/hooks/use-savings';
import { Saving, SavingStatus, SavingType } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const savingSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre no puede superar los 80 caracteres'),
    type: z.enum(['goal', 'free']),
    target_amount: z.string().optional(),
    target_date: z.string().optional(),
    description: z.string().max(250, 'Máximo 250 caracteres').optional(),
    icon: z.string(),
    color: z.string(),
    status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'goal') {
        const val = parseFloat(data.target_amount || '0');
        return !isNaN(val) && val > 0;
      }
      return true;
    },
    {
      message: 'Debes especificar un monto objetivo mayor a 0 para una meta',
      path: ['target_amount'],
    }
  );

type SavingFormValues = z.infer<typeof savingSchema>;

interface SavingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingToEdit?: Saving | null;
}

export function SavingFormDialog({
  open,
  onOpenChange,
  savingToEdit,
}: SavingFormDialogProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const currencySymbol = currency === 'EUR' ? '€' : '$';

  const [iconSearch, setIconSearch] = useState('');
  const createMutation = useCreateSaving();
  const updateMutation = useUpdateSaving();

  const isEditing = !!savingToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SavingFormValues>({
    resolver: zodResolver(savingSchema),
    defaultValues: {
      name: '',
      type: 'goal',
      target_amount: '',
      target_date: '',
      description: '',
      icon: 'piggybank',
      color: '#10B981',
      status: 'active',
    },
  });

  const selectedType = watch('type');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const selectedStatus = watch('status');

  // Reset form when opening or changing savingToEdit
  useEffect(() => {
    if (open) {
      if (savingToEdit) {
        reset({
          name: savingToEdit.name,
          type: savingToEdit.type || 'goal',
          target_amount: savingToEdit.target_amount
            ? String(savingToEdit.target_amount)
            : '',
          target_date: savingToEdit.target_date || '',
          description: savingToEdit.description || '',
          icon: savingToEdit.icon || 'piggybank',
          color: savingToEdit.color || '#10B981',
          status: savingToEdit.status || 'active',
        });
      } else {
        reset({
          name: '',
          type: 'goal',
          target_amount: '',
          target_date: '',
          description: '',
          icon: 'piggybank',
          color: '#10B981',
          status: 'active',
        });
      }
      setIconSearch('');
    }
  }, [open, savingToEdit, reset]);

  const filteredIcons = AVAILABLE_ICONS.filter((item) =>
    item.label.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const onSubmit = async (values: SavingFormValues) => {
    try {
      const payload: any = {
        name: values.name.trim(),
        type: values.type,
        description: values.description?.trim() || undefined,
        icon: values.icon,
        color: values.color,
      };

      if (values.type === 'goal' && values.target_amount) {
        payload.target_amount = parseFloat(values.target_amount);
        payload.target_date = values.target_date || undefined;
      } else {
        payload.target_amount = undefined;
        payload.target_date = undefined;
      }

      if (isEditing && savingToEdit) {
        if (values.status) {
          payload.status = values.status;
        }
        await updateMutation.mutateAsync({
          id: savingToEdit.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch (error) {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95vw] bg-[#1E1E1E] border-[#2E2E2E] text-white p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-white/5"
              style={{
                backgroundColor: `${selectedColor}25`,
                color: selectedColor,
              }}
            >
              <CategoryIcon iconName={selectedIcon} className="h-4.5 w-4.5" />
            </div>
            <span>{isEditing ? 'Editar Meta de Ahorro' : 'Nueva Meta o Alcancía'}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            {isEditing
              ? 'Actualiza los datos, plazo o estado de tu ahorro.'
              : 'Crea una meta específica con fecha límite o una alcancía de ahorro libre.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Selector de Tipo: Meta vs Alcancía Libre */}
          {!isEditing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Tipo de Ahorro
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('type', 'goal')}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer',
                    selectedType === 'goal'
                      ? 'border-[#10B981] bg-[#10B981]/10 text-white font-medium shadow-sm'
                      : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:border-[#3E3E3E]'
                  )}
                >
                  <Target className="h-5 w-5 mb-1 text-[#10B981]" />
                  <span className="text-xs font-semibold">Meta con Objetivo</span>
                  <span className="text-[10px] text-muted-foreground">Monto y fecha límite</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('type', 'free')}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer',
                    selectedType === 'free'
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white font-medium shadow-sm'
                      : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:border-[#3E3E3E]'
                  )}
                >
                  <PiggyBank className="h-5 w-5 mb-1 text-[#3B82F6]" />
                  <span className="text-xs font-semibold">Alcancía Libre</span>
                  <span className="text-[10px] text-muted-foreground">Acumulación sin tope</span>
                </button>
              </div>
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-white">
              Nombre de la Meta *
            </Label>
            <Input
              id="name"
              placeholder="Ej. Fondo de Emergencia, Vacaciones Japón, Auto..."
              className="bg-[#121212] border-[#2E2E2E] text-white focus-visible:ring-[#10B981]"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-[#EF4444] font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Campos para Tipo Goal (Monto Meta y Fecha Límite) */}
          {selectedType === 'goal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Monto Objetivo */}
              <div className="space-y-1.5">
                <Label htmlFor="target_amount" className="text-xs font-semibold text-white">
                  Monto Objetivo ({currencySymbol}) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                    {currencySymbol}
                  </span>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-[#121212] border-[#2E2E2E] text-white pl-7 focus-visible:ring-[#10B981]"
                    {...register('target_amount')}
                  />
                </div>
                {errors.target_amount && (
                  <p className="text-xs text-[#EF4444] font-medium">
                    {errors.target_amount.message}
                  </p>
                )}
              </div>

              {/* Fecha Límite */}
              <div className="space-y-1.5">
                <Label htmlFor="target_date" className="text-xs font-semibold text-white">
                  Fecha Límite (Opcional)
                </Label>
                <Input
                  id="target_date"
                  type="date"
                  className="bg-[#121212] border-[#2E2E2E] text-white focus-visible:ring-[#10B981]"
                  {...register('target_date')}
                />
              </div>
            </div>
          )}

          {/* Estado (solo en edición) */}
          {isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-white">
                Estado del Ahorro
              </Label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  if (val) setValue('status', val as SavingStatus);
                }}
              >
                <SelectTrigger className="bg-[#121212] border-[#2E2E2E] text-white">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                  <SelectItem value="active">Activa (En curso)</SelectItem>
                  <SelectItem value="completed">Completada (Meta lograda)</SelectItem>
                  <SelectItem value="paused">En pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-white">
              Descripción o Notas (Opcional)
            </Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="¿Para qué es esta meta o qué condiciones tienes?"
              className="bg-[#121212] border-[#2E2E2E] text-white resize-none text-xs focus-visible:ring-[#10B981]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-[#EF4444] font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Color de Identificación</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setValue('color', c.hex)}
                  title={c.name}
                  className={cn(
                    'h-6 w-6 rounded-full transition-transform cursor-pointer flex items-center justify-center',
                    selectedColor === c.hex ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-[#1E1E1E]' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.hex && (
                    <Check className="h-3.5 w-3.5 text-white drop-shadow-md stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white">Ícono Representativo</Label>
              <span className="text-[11px] text-muted-foreground capitalize">
                {selectedIcon}
              </span>
            </div>

            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar ícono (viaje, auto, casa, ahorro...)"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="h-8 bg-[#121212] border-[#2E2E2E] text-xs pl-8 text-white focus-visible:ring-[#10B981]"
              />
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#121212] rounded-lg border border-[#2E2E2E]">
              {filteredIcons.map((item) => {
                const isSelected = selectedIcon === item.name;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    title={item.label}
                    onClick={() => setValue('icon', item.name)}
                    className={cn(
                      'h-9 rounded-md flex items-center justify-center transition-all cursor-pointer',
                      isSelected
                        ? 'bg-[#10B981] text-white shadow-sm scale-105'
                        : 'text-muted-foreground hover:text-white hover:bg-[#27272A]'
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
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
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-medium gap-1.5"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Meta de Ahorro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
