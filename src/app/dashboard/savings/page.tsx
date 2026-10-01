'use client';

import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  Plus,
  Search,
  Target,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSavings,
  useSavingSummary,
  useSavingProjections,
  useUpdateSaving,
} from '@/hooks/use-savings';
import { Saving, SavingStatus, SavingType } from '@/types';
import { SavingSummaryCards } from '@/components/savings/saving-summary-cards';
import { SavingCard } from '@/components/savings/saving-card';
import { SavingFormDialog } from '@/components/savings/saving-form-dialog';
import { SavingContributionDialog } from '@/components/savings/saving-contribution-dialog';
import { SavingDetailDialog } from '@/components/savings/saving-detail-dialog';
import { DeleteSavingDialog } from '@/components/savings/delete-saving-dialog';

export default function SavingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [savingToEdit, setSavingToEdit] = useState<Saving | null>(null);

  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [selectedSavingForContribution, setSelectedSavingForContribution] = useState<Saving | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSavingForDetail, setSelectedSavingForDetail] = useState<Saving | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [savingToDelete, setSavingToDelete] = useState<Saving | null>(null);

  // Queries
  const { data: savings = [], isLoading: isLoadingSavings } = useSavings(
    statusFilter === 'all' ? undefined : statusFilter
  );
  const { data: summary, isLoading: isLoadingSummary } = useSavingSummary();
  const { data: projections = [] } = useSavingProjections();

  const updateMutation = useUpdateSaving();

  // Create a projection lookup map by saving_id
  const projectionsMap = useMemo(() => {
    const map = new Map<string, any>();
    projections.forEach((p) => {
      map.set(p.saving_id, p);
    });
    return map;
  }, [projections]);

  // Filter savings by search and type
  const filteredSavings = useMemo(() => {
    return savings.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [savings, searchQuery, typeFilter]);

  // Handlers
  const handleOpenCreate = () => {
    setSavingToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (saving: Saving) => {
    setSavingToEdit(saving);
    setIsFormOpen(true);
  };

  const handleOpenContribution = (saving: Saving) => {
    setSelectedSavingForContribution(saving);
    setIsContributionOpen(true);
  };

  const handleOpenDetail = (saving: Saving) => {
    setSelectedSavingForDetail(saving);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (saving: Saving) => {
    setSavingToDelete(saving);
    setIsDeleteOpen(true);
  };

  const handleStatusChange = async (saving: Saving, newStatus: SavingStatus) => {
    try {
      await updateMutation.mutateAsync({
        id: saving.id,
        payload: { status: newStatus },
      });
    } catch (e) {
      // Handled by toast
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <PiggyBank className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ahorros & Metas Financieras
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gestiona tus metas con fecha límite, fondos de ahorro libre y proyecciones inteligentes de cumplimiento.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#10B981] hover:bg-[#059669] text-white font-medium gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Meta</span>
        </Button>
      </div>

      {/* 2. 4 KPIs Superiores de Resumen */}
      <SavingSummaryCards summary={summary} isLoading={isLoadingSummary} />

      {/* 3. Barra de Controles y Filtros */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-3">
          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 bg-[#121212] border border-[#2E2E2E] p-1 h-9">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs px-2.5"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs px-2.5"
              >
                Activas
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs px-2.5"
              >
                Completadas
              </TabsTrigger>
              <TabsTrigger
                value="paused"
                className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs px-2.5"
              >
                Pausadas
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search & Type Filter */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-[#121212] border-[#2E2E2E] text-xs pl-8 text-white focus-visible:ring-[#10B981]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Selector de Tipo */}
            <Select
              value={typeFilter}
              onValueChange={(val) => {
                if (val) setTypeFilter(val);
              }}
            >
              <SelectTrigger className="w-36 h-9 text-xs bg-[#121212] border-[#2E2E2E] text-white shrink-0">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="goal">Metas con plazo</SelectItem>
                <SelectItem value="free">Alcancías libres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 4. Grid de Tarjetas de Ahorro */}
      {isLoadingSavings ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-[#2E2E2E] bg-[#1E1E1E] rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-[#2E2E2E]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 bg-[#2E2E2E]" />
                  <Skeleton className="h-3 w-20 bg-[#2E2E2E]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-lg bg-[#2E2E2E]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1 bg-[#2E2E2E]" />
                <Skeleton className="h-8 w-16 bg-[#2E2E2E]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSavings.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-[#2E2E2E] rounded-2xl bg-[#1E1E1E]/50">
          <div className="h-14 w-14 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {savings.length === 0
              ? 'Aún no tienes metas de ahorro'
              : 'No se encontraron metas con los filtros actuales'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            {savings.length === 0
              ? 'Comienza creando tu primera meta financiera o alcancía para alcanzar tus objetivos.'
              : 'Prueba cambiando los términos de búsqueda o limpiando los filtros.'}
          </p>
          {savings.length === 0 ? (
            <Button
              onClick={handleOpenCreate}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Crear mi primera meta</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="border-[#2E2E2E] bg-[#27272A] hover:bg-[#323236] text-white font-medium text-xs"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSavings.map((saving) => (
            <SavingCard
              key={saving.id}
              saving={saving}
              projection={projectionsMap.get(saving.id)}
              onAddContribution={handleOpenContribution}
              onOpenDetails={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* 5. Modales Atómicos */}
      {/* Modal Crear / Editar Meta */}
      <SavingFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        savingToEdit={savingToEdit}
      />

      {/* Modal Registrar Aporte Rápido */}
      <SavingContributionDialog
        open={isContributionOpen}
        onOpenChange={setIsContributionOpen}
        saving={selectedSavingForContribution}
      />

      {/* Modal Detalle, Historial y Gráfica */}
      <SavingDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        saving={selectedSavingForDetail}
        projection={
          selectedSavingForDetail
            ? projectionsMap.get(selectedSavingForDetail.id)
            : undefined
        }
        onAddContribution={handleOpenContribution}
      />

      {/* Modal Confirmar Eliminación */}
      <DeleteSavingDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        saving={savingToDelete}
      />
    </div>
  );
}
