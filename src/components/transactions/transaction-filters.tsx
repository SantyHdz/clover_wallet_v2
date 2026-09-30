'use client';

import React from 'react';
import { Search, X, Tags, Calendar, CalendarRange, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types';
import { CategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedCategoryId: string;
  onCategoryChange: (val: string) => void;
  selectedMonth: string;
  onMonthChange: (val: string) => void;
  selectedYear: string;
  onYearChange: (val: string) => void;
  categories: Category[];
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const MONTHS = [
  { value: 'all', label: 'Todos los meses' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const YEARS = [
  { value: 'all', label: 'Todos los años' },
  { value: String(currentYear), label: `Año ${currentYear}` },
  { value: String(currentYear - 1), label: `Año ${currentYear - 1}` },
  { value: String(currentYear - 2), label: `Año ${currentYear - 2}` },
];

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategoryId,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  categories,
  onResetFilters,
  hasActiveFilters,
}: TransactionFiltersProps) {
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const activeMonthLabel =
    MONTHS.find((m) => m.value === selectedMonth)?.label || 'Todos los meses';
  const activeYearLabel =
    YEARS.find((y) => y.value === selectedYear)?.label || 'Todos los años';

  return (
    <div className="space-y-3.5 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-4 shadow-xl">
      {/* ─────────────────────────────────────────────────────────────
          ROW 1: TYPE TABS & SEARCH INPUT
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <Tabs value={selectedType} onValueChange={onTypeChange}>
          <TabsList className="bg-[#121212] border border-[#2E2E2E] p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Todos los movimientos
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="rounded-lg text-xs data-[state=active]:bg-[#EF4444] data-[state=active]:text-white font-medium"
            >
              Solo Gastos
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-lg text-xs data-[state=active]:bg-[#22C55E] data-[state=active]:text-white font-medium"
            >
              Solo Ingresos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por descripción o notas..."
            className="h-10 w-full rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 pr-8 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: DROPDOWN FILTER PILLS (CATEGORÍA, MES, AÑO)
      ───────────────────────────────────────────────────────────── */}
      <div className="pt-3 border-t border-[#2E2E2E] flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5 text-[#10B981]" />
          <span>Filtros:</span>
        </div>

        {/* 1. Categoría Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'h-9 inline-flex items-center gap-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer outline-none',
              selectedCategoryId !== 'all'
                ? 'border-[#10B981] bg-[#10B981]/15 text-white shadow-sm'
                : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:text-white hover:border-[#10B981]/40'
            )}
          >
            <Tags className="h-3.5 w-3.5 text-[#10B981]" />
            {activeCategory ? (
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <div
                  className="h-3.5 w-3.5 rounded text-[8px] flex items-center justify-center text-white"
                  style={{ backgroundColor: activeCategory.color || '#10B981' }}
                >
                  <CategoryIcon iconName={activeCategory.icon} className="h-2 w-2" />
                </div>
                <span>{activeCategory.name}</span>
              </span>
            ) : (
              <span>Todas las categorías</span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-56 max-h-64 overflow-y-auto border border-[#2E2E2E] bg-[#1E1E1E] p-1.5 text-white shadow-2xl rounded-xl"
          >
            <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
              Seleccionar Categoría
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onCategoryChange('all')}
              className="cursor-pointer gap-2 rounded-lg text-xs hover:bg-[#27272A] hover:text-white"
            >
              <Tags className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Todas las categorías</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2E2E2E]" />
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="cursor-pointer gap-2.5 rounded-lg text-xs hover:bg-[#27272A] hover:text-white"
              >
                <div
                  className="h-4 w-4 rounded text-[9px] flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: cat.color || '#10B981' }}
                >
                  <CategoryIcon iconName={cat.icon} className="h-2.5 w-2.5" />
                </div>
                <span className="truncate">{cat.name}</span>
                {cat.id === selectedCategoryId && (
                  <Badge className="ml-auto bg-[#10B981] text-white text-[9px] h-4 px-1">
                    Activa
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Mes Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'h-9 inline-flex items-center gap-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer outline-none',
              selectedMonth !== 'all'
                ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-white shadow-sm'
                : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:text-white hover:border-[#3B82F6]/40'
            )}
          >
            <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className={selectedMonth !== 'all' ? 'text-white font-semibold' : ''}>
              {activeMonthLabel}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-48 max-h-64 overflow-y-auto border border-[#2E2E2E] bg-[#1E1E1E] p-1.5 text-white shadow-2xl rounded-xl"
          >
            <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
              Filtrar por Mes
            </DropdownMenuLabel>
            {MONTHS.map((m) => (
              <DropdownMenuItem
                key={m.value}
                onClick={() => onMonthChange(m.value)}
                className="cursor-pointer gap-2 rounded-lg text-xs hover:bg-[#27272A] hover:text-white"
              >
                <span>{m.label}</span>
                {m.value === selectedMonth && (
                  <Badge className="ml-auto bg-[#3B82F6] text-white text-[9px] h-4 px-1">
                    Activo
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. Año Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'h-9 inline-flex items-center gap-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer outline-none',
              selectedYear !== 'all'
                ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-white shadow-sm'
                : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:text-white hover:border-[#F59E0B]/40'
            )}
          >
            <CalendarRange className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className={selectedYear !== 'all' ? 'text-white font-semibold' : ''}>
              {activeYearLabel}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-44 border border-[#2E2E2E] bg-[#1E1E1E] p-1.5 text-white shadow-2xl rounded-xl"
          >
            <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1">
              Filtrar por Año
            </DropdownMenuLabel>
            {YEARS.map((y) => (
              <DropdownMenuItem
                key={y.value}
                onClick={() => onYearChange(y.value)}
                className="cursor-pointer gap-2 rounded-lg text-xs hover:bg-[#27272A] hover:text-white"
              >
                <span>{y.label}</span>
                {y.value === selectedYear && (
                  <Badge className="ml-auto bg-[#F59E0B] text-white text-[9px] h-4 px-1">
                    Activo
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 4. Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/15 rounded-xl transition-colors cursor-pointer gap-1.5 ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            <span>Limpiar Filtros</span>
          </Button>
        )}
      </div>
    </div>
  );
}
