'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Check,
  TrendingDown,
  TrendingUp,
  ArrowLeftRight,
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
import { Badge } from '@/components/ui/badge';
import { CategoryType } from '@/types';
import { useCreateCategory } from '@/hooks/use-categories';
import {
  AVAILABLE_ICONS,
  CATEGORY_COLORS,
  CategoryIcon,
} from '@/lib/category-icons';
import { cn } from '@/lib/utils';

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),
  type: z.enum(['expense', 'income', 'both']),
  icon: z.string(),
  color: z.string(),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [iconSearch, setIconSearch] = useState('');
  const createMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      icon: 'shoppingbag',
      color: '#10B981',
    },
  });

  const selectedType = watch('type');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const categoryName = watch('name');

  const filteredIcons = AVAILABLE_ICONS.filter(
    (item) =>
      item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const onSubmit = async (data: CreateCategoryFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: data.name.trim(),
        type: data.type as CategoryType,
        icon: data.icon,
        color: data.color,
      });
      reset({
        name: '',
        type: 'expense',
        icon: 'shoppingbag',
        color: '#10B981',
      });
      setIconSearch('');
      onOpenChange(false);
    } catch {
      // Error is handled in hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-[#2E2E2E] bg-[#1E1E1E] text-white p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#10B981]" />
            Nueva Categoría
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Crea una etiqueta personalizada para clasificar tus gastos o fuentes de ingreso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* ─────────────────────────────────────────────────────────────
              1. PREVIEW EN TIEMPO REAL
          ───────────────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all"
                style={{
                  backgroundColor: `${selectedColor}20`,
                  borderColor: `${selectedColor}50`,
                  color: selectedColor,
                }}
              >
                <CategoryIcon iconName={selectedIcon} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  Vista Previa
                </span>
                <div className="text-sm font-bold text-white truncate">
                  {categoryName || 'Nombre de la categoría'}
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                'text-[10px] font-semibold py-0.5 px-2 capitalize',
                selectedType === 'income' && 'border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10',
                selectedType === 'expense' && 'border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10',
                selectedType === 'both' && 'border-[#3B82F6]/40 text-[#3B82F6] bg-[#3B82F6]/10'
              )}
            >
              {selectedType === 'expense' ? 'Gasto' : selectedType === 'income' ? 'Ingreso' : 'Mixta'}
            </Badge>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. NOMBRE DE LA CATEGORÍA
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-semibold text-white">
              Nombre de la Categoría <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="Ej. Restaurantes, Cursos Online, Freelance..."
              {...register('name')}
              className={cn(
                'h-10 rounded-xl border-[#2E2E2E] bg-[#121212] text-sm text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]',
                errors.name && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
              )}
            />
            {errors.name && (
              <p className="text-[11px] text-[#EF4444]">{errors.name.message}</p>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. TIPO DE CATEGORÍA (GASTO, INGRESO, AMBOS)
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white">
              Tipo de Movimiento <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                  selectedType === 'expense'
                    ? 'border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444] shadow-sm shadow-[#EF4444]/20'
                    : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                )}
              >
                <TrendingDown className="h-4 w-4" />
                <span>Gasto</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                  selectedType === 'income'
                    ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] shadow-sm shadow-[#22C55E]/20'
                    : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                )}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Ingreso</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('type', 'both')}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                  selectedType === 'both'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6] shadow-sm shadow-[#3B82F6]/20'
                    : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                )}
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Mixta</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. SELECTOR DE COLOR
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white">Color Representativo</Label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {CATEGORY_COLORS.map((col) => {
                const isSelected = selectedColor === col.hex;
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setValue('color', col.hex)}
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer relative',
                      isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-85 hover:opacity-100'
                    )}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md stroke-[3px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. SELECTOR DE ÍCONO CON BUSCADOR
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white">Ícono de la Categoría</Label>
              <span className="text-[10px] text-muted-foreground">{filteredIcons.length} disponibles</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Buscar ícono (ej. carro, comida, café, sueldo)..."
                className="h-8 rounded-xl border-[#2E2E2E] bg-[#121212] pl-8 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
              />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-40 overflow-y-auto p-1 border border-[#2E2E2E] rounded-xl bg-[#121212]/70">
              {filteredIcons.map((item) => {
                const isSelected = selectedIcon === item.name;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setValue('icon', item.name)}
                    className={cn(
                      'flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer',
                      isSelected
                        ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981] shadow-sm'
                        : 'text-muted-foreground hover:bg-[#1E1E1E] hover:text-white'
                    )}
                    title={item.label}
                  >
                    <IconComponent className="h-4 w-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              6. BOTONES DE ACCIÓN
          ───────────────────────────────────────────────────────────── */}
          <DialogFooter className="pt-3 border-t border-[#2E2E2E] flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
              className="text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-[#10B981] text-white hover:bg-[#059669] text-xs font-semibold shadow-md shadow-[#10B981]/25 cursor-pointer"
            >
              {createMutation.isPending ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  <span>Crear Categoría</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
