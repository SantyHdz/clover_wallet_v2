'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types';
import { CategoryIcon } from '@/lib/category-icons';

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
  { value: String(currentYear), label: String(currentYear) },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
  { value: String(currentYear - 2), label: String(currentYear - 2) },
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
  return (
    <div className="space-y-3 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-4 shadow-md">
      {/* Row 1: Search & Type Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <Tabs value={selectedType} onValueChange={onTypeChange}>
          <TabsList className="bg-[#121212] border border-[#2E2E2E] p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Todos
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
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por descripción..."
            className="h-9 w-full rounded-xl border-[#2E2E2E] bg-[#121212] pl-8 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
          />
        </div>
      </div>

      {/* Row 2: Category, Month & Year Selects + Reset */}
      <div className="pt-2 border-t border-[#2E2E2E]/60 flex flex-wrap items-center gap-2.5">
        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedCategoryId}
            onValueChange={(val) => onCategoryChange(val || 'all')}
          >
            <SelectTrigger className="h-8 rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white">
              <SelectValue placeholder="Categoría: Todas" />
            </SelectTrigger>
            <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
              <SelectItem value="all" className="text-xs">
                Todas las categorías
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded text-[8px] flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color || '#10B981' }}
                    >
                      <CategoryIcon iconName={cat.icon} className="h-2 w-2" />
                    </div>
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Filter */}
        <div className="w-[calc(50%-5px)] sm:w-40">
          <Select
            value={selectedMonth}
            onValueChange={(val) => onMonthChange(val || 'all')}
          >
            <SelectTrigger className="h-8 rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-xs">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="w-[calc(50%-5px)] sm:w-32">
          <Select
            value={selectedYear}
            onValueChange={(val) => onYearChange(val || 'all')}
          >
            <SelectTrigger className="h-8 rounded-xl border-[#2E2E2E] bg-[#121212] text-xs text-white">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
              {YEARS.map((y) => (
                <SelectItem key={y.value} value={y.value} className="text-xs">
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
