'use client';

import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Layers,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Category, CategoryType } from '@/types';
import { useCategories } from '@/hooks/use-categories';
import { CategoryCard } from '@/components/categories/category-card';
import { CreateCategoryDialog } from '@/components/categories/create-category-dialog';
import { DeleteCategoryDialog } from '@/components/categories/delete-category-dialog';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Metrics summary
  const totalCount = categories.length;
  const expenseCount = categories.filter((c) => c.type === 'expense' || c.type === 'both').length;
  const incomeCount = categories.filter((c) => c.type === 'income' || c.type === 'both').length;
  const customCount = categories.filter((c) => !c.is_global).length;

  // Filtered categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'expense') return category.type === 'expense' || category.type === 'both';
    if (filterType === 'income') return category.type === 'income' || category.type === 'both';
    if (filterType === 'custom') return !category.is_global;

    return true;
  });

  const handleDeleteRequest = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER & ACTION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#1E1E1E] via-[#161616] to-[#1E1E1E] p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Gestor de Categorías
              </h1>
              <p className="text-xs text-muted-foreground">
                Etiquetas visuales para clasificar y organizar ingresos y gastos
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/25 font-semibold text-xs h-10 px-4 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUMMARY KPI BADGES
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground">Total Disponibles</span>
              <div className="text-xl font-bold text-white mt-0.5">{totalCount}</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#121212] border border-[#2E2E2E] flex items-center justify-center text-muted-foreground">
              <Layers className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground">Para Gastos</span>
              <div className="text-xl font-bold text-[#EF4444] mt-0.5">{expenseCount}</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground">Para Ingresos</span>
              <div className="text-xl font-bold text-[#22C55E] mt-0.5">{incomeCount}</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground">Personalizadas</span>
              <div className="text-xl font-bold text-[#10B981] mt-0.5">{customCount}</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <User className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SEARCH & FILTER CONTROLS (TABS + INPUT)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2E2E] pb-3">
        {/* Type Tabs */}
        <Tabs value={filterType} onValueChange={setFilterType}>
          <TabsList className="bg-[#1E1E1E] border border-[#2E2E2E] p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Todas ({totalCount})
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Gastos
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Ingresos
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Mis Categorías ({customCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nombre..."
            className="h-9 w-full rounded-xl border-[#2E2E2E] bg-[#1E1E1E] pl-8 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CATEGORIES GRID / SKELETON / EMPTY STATE
      ───────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-xl bg-[#27272A]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28 bg-[#27272A]" />
                  <Skeleton className="h-3 w-16 bg-[#27272A]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-8 text-center">
          <div className="text-sm text-[#EF4444] mb-3">
            Ocurrió un problema al cargar el listado de categorías.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-[#2E2E2E] bg-[#121212] text-xs text-white hover:bg-[#27272A]"
          >
            Reintentar
          </Button>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-12 text-center">
          <Tags className="h-12 w-12 text-[#2E2E2E] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No se encontraron categorías</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No hay coincidencias con la búsqueda "${searchQuery}".`
              : 'No hay categorías registradas en esta sección.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-xs text-muted-foreground hover:text-white"
              >
                Limpiar búsqueda
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="bg-[#10B981] text-white hover:bg-[#059669] text-xs font-semibold"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Crear Categoría
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. MODALS (CREATE & DELETE)
      ───────────────────────────────────────────────────────────── */}
      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <DeleteCategoryDialog
        category={categoryToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
