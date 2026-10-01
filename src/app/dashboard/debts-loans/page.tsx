'use client';

import React, { useState, useMemo } from 'react';
import {
  HandCoins,
  Plus,
  Search,
  LayoutGrid,
  List,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Percent,
  X,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Debt, Loan } from '@/types';
import { useDebts } from '@/hooks/use-debts';
import { useLoans } from '@/hooks/use-loans';
import { DebtsLoansSummary } from '@/components/debts-loans/debts-loans-summary';
import { DebtCard } from '@/components/debts-loans/debt-card';
import { DebtsTable } from '@/components/debts-loans/debts-table';
import { DebtFormDialog } from '@/components/debts-loans/debt-form-dialog';
import { DebtPaymentDialog } from '@/components/debts-loans/debt-payment-dialog';
import { DeleteDebtDialog } from '@/components/debts-loans/delete-debt-dialog';
import { LoanCard } from '@/components/debts-loans/loan-card';
import { LoansTable } from '@/components/debts-loans/loans-table';
import { LoanFormDialog } from '@/components/debts-loans/loan-form-dialog';
import { LoanPaymentDialog } from '@/components/debts-loans/loan-payment-dialog';
import { DeleteLoanDialog } from '@/components/debts-loans/delete-loan-dialog';
import { cn } from '@/lib/utils';

export default function DebtsLoansPage() {
  const [activeTab, setActiveTab] = useState<'debts' | 'loans'>('debts');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debtStatusFilter, setDebtStatusFilter] = useState<string>('all');
  const [loanStatusFilter, setLoanStatusFilter] = useState<string>('all');

  // Modales de Deudas
  const [isDebtFormOpen, setIsDebtFormOpen] = useState(false);
  const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);
  const [isDeleteDebtOpen, setIsDeleteDebtOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

  // Modales de Préstamos
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [loanToEdit, setLoanToEdit] = useState<Loan | null>(null);
  const [isLoanPaymentOpen, setIsLoanPaymentOpen] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<Loan | null>(null);
  const [isDeleteLoanOpen, setIsDeleteLoanOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);

  // Queries
  const { data: debts = [], isLoading: isLoadingDebts } = useDebts();
  const { data: loans = [], isLoading: isLoadingLoans } = useLoans();

  // Cálculos de resumen para Deudas
  const debtsSummary = useMemo(() => {
    let total = 0;
    let paid = 0;
    debts.forEach((d) => {
      total += Number(d.total_amount || 0);
      paid += Number(d.paid_amount || 0);
    });
    return {
      total,
      paid,
      pending: Math.max(0, total - paid),
      count: debts.length,
    };
  }, [debts]);

  // Cálculos de resumen para Préstamos
  const loansSummary = useMemo(() => {
    let total = 0;
    let recovered = 0;
    loans.forEach((l) => {
      total += Number(l.total_amount || 0);
      recovered += Number(l.recovered_amount || 0);
    });
    return {
      total,
      recovered,
      pending: Math.max(0, total - recovered),
      count: loans.length,
    };
  }, [loans]);

  // Filtrado de Deudas
  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      const matchesSearch =
        d.creditor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const isOverdue =
        d.due_date &&
        d.status !== 'paid' &&
        new Date(d.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

      const computedStatus = isOverdue ? 'overdue' : d.status;

      const matchesStatus =
        debtStatusFilter === 'all' || computedStatus === debtStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [debts, searchQuery, debtStatusFilter]);

  // Filtrado de Préstamos
  const filteredLoans = useMemo(() => {
    return loans.filter((l) => {
      const matchesSearch =
        l.debtor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const isOverdue =
        l.due_date &&
        l.status !== 'recovered' &&
        new Date(l.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

      const computedStatus = isOverdue ? 'overdue' : l.status;

      const matchesStatus =
        loanStatusFilter === 'all' || computedStatus === loanStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, searchQuery, loanStatusFilter]);

  // Handlers para Deudas
  const handleOpenNewDebt = () => {
    setDebtToEdit(null);
    setIsDebtFormOpen(true);
  };

  const handleEditDebt = (debt: Debt) => {
    setDebtToEdit(debt);
    setIsDebtFormOpen(true);
  };

  const handlePayDebt = (debt: Debt) => {
    setSelectedDebtForPayment(debt);
    setIsDebtPaymentOpen(true);
  };

  const handleDeleteDebt = (debt: Debt) => {
    setDebtToDelete(debt);
    setIsDeleteDebtOpen(true);
  };

  // Handlers para Préstamos
  const handleOpenNewLoan = () => {
    setLoanToEdit(null);
    setIsLoanFormOpen(true);
  };

  const handleEditLoan = (loan: Loan) => {
    setLoanToEdit(loan);
    setIsLoanFormOpen(true);
  };

  const handlePayLoan = (loan: Loan) => {
    setSelectedLoanForPayment(loan);
    setIsLoanPaymentOpen(true);
  };

  const handleDeleteLoan = (loan: Loan) => {
    setLoanToDelete(loan);
    setIsDeleteLoanOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER UNIFICADO
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#1E1E1E] via-[#161616] to-[#1E1E1E] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
            <HandCoins className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Deudas y Préstamos
            </h1>
            <p className="text-xs text-muted-foreground">
              Monitoreo y amortización de pasivos por pagar y dinero prestado por recuperar
            </p>
          </div>
        </div>

        <Button
          onClick={activeTab === 'debts' ? handleOpenNewDebt : handleOpenNewLoan}
          className="bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/25 font-semibold text-xs h-10 px-4 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {activeTab === 'debts' ? 'Nueva Deuda' : 'Nuevo Préstamo'}
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. GRAND TABS DE MODO (50% / 50% FULL-WIDTH RESPONSIVE)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="tablist">
        {/* Tab 1: Deudas */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'debts'}
          onClick={() => {
            setActiveTab('debts');
            setSearchQuery('');
          }}
          className={cn(
            'w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden',
            activeTab === 'debts'
              ? 'bg-[#1E1E1E] border-[#F97316] shadow-lg shadow-[#F97316]/10 ring-1 ring-[#F97316]/30'
              : 'bg-[#161616] border-[#2E2E2E] hover:bg-[#1A1A1A] hover:border-[#3E3E3E] opacity-75 hover:opacity-100'
          )}
        >
          {/* Indicador de Barra Superior de Estado Activo */}
          {activeTab === 'debts' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />
          )}

          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div
              className={cn(
                'h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                activeTab === 'debts'
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/30'
                  : 'bg-[#27272A] text-muted-foreground border border-[#3E3E3E]'
              )}
            >
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  className={cn(
                    'text-sm sm:text-base font-bold truncate transition-colors',
                    activeTab === 'debts' ? 'text-white' : 'text-neutral-300'
                  )}
                >
                  Lo que debo (Deudas)
                </h2>
                {activeTab === 'debts' && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {debts.length} {debts.length === 1 ? 'obligación registrada' : 'obligaciones registradas'}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 ml-2 border',
              activeTab === 'debts'
                ? 'bg-[#F97316]/15 border-[#F97316]/30 text-[#F97316]'
                : 'bg-[#1E1E1E] border-[#2E2E2E] text-muted-foreground'
            )}
          >
            {debts.length}
          </div>
        </button>

        {/* Tab 2: Préstamos */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'loans'}
          onClick={() => {
            setActiveTab('loans');
            setSearchQuery('');
          }}
          className={cn(
            'w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden',
            activeTab === 'loans'
              ? 'bg-[#1E1E1E] border-[#3B82F6] shadow-lg shadow-[#3B82F6]/10 ring-1 ring-[#3B82F6]/30'
              : 'bg-[#161616] border-[#2E2E2E] hover:bg-[#1A1A1A] hover:border-[#3E3E3E] opacity-75 hover:opacity-100'
          )}
        >
          {/* Indicador de Barra Superior de Estado Activo */}
          {activeTab === 'loans' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6]" />
          )}

          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div
              className={cn(
                'h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                activeTab === 'loans'
                  ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30'
                  : 'bg-[#27272A] text-muted-foreground border border-[#3E3E3E]'
              )}
            >
              <Banknote className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  className={cn(
                    'text-sm sm:text-base font-bold truncate transition-colors',
                    activeTab === 'loans' ? 'text-white' : 'text-neutral-300'
                  )}
                >
                  Lo que me deben (Préstamos)
                </h2>
                {activeTab === 'loans' && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {loans.length} {loans.length === 1 ? 'préstamo por cobrar' : 'préstamos por cobrar'}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 ml-2 border',
              activeTab === 'loans'
                ? 'bg-[#3B82F6]/15 border-[#3B82F6]/30 text-[#3B82F6]'
                : 'bg-[#1E1E1E] border-[#2E2E2E] text-muted-foreground'
            )}
          >
            {loans.length}
          </div>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RESUMEN KPI GLOBAL REACTIVO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'debts' ? (
        <DebtsLoansSummary
          type="debts"
          totalAmount={debtsSummary.total}
          completedAmount={debtsSummary.paid}
          pendingAmount={debtsSummary.pending}
          count={debtsSummary.count}
        />
      ) : (
        <DebtsLoansSummary
          type="loans"
          totalAmount={loansSummary.total}
          completedAmount={loansSummary.recovered}
          pendingAmount={loansSummary.pending}
          count={loansSummary.count}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. FILTROS Y CONTROLES DE VISTA
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3.5 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Buscador */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                activeTab === 'debts'
                  ? 'Buscar por acreedor o descripción...'
                  : 'Buscar por deudor o descripción...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 pr-8 text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
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

          {/* Alternador Grid / Table */}
          <div className="flex items-center p-0.5 rounded-xl border border-[#2E2E2E] bg-[#121212] shrink-0 h-10 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg text-muted-foreground transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-[#27272A] text-white shadow-sm'
                  : 'hover:text-white'
              )}
              title="Vista en tarjetas"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'p-2 rounded-lg text-muted-foreground transition-colors cursor-pointer',
                viewMode === 'table'
                  ? 'bg-[#27272A] text-white shadow-sm'
                  : 'hover:text-white'
              )}
              title="Vista en tabla"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Píldoras de Filtro por Estado */}
        <div className="pt-3 border-t border-[#2E2E2E] flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Estado:</span>
          </div>

          {activeTab === 'debts'
            ? [
                { id: 'all', label: 'Todas las Deudas', icon: null },
                { id: 'pending', label: 'Pendientes', icon: Clock },
                { id: 'partial', label: 'Con Abonos', icon: Percent },
                { id: 'paid', label: 'Saldadas', icon: CheckCircle2 },
                { id: 'overdue', label: 'Vencidas', icon: AlertTriangle },
              ].map((f) => {
                const active = debtStatusFilter === f.id;
                const IconComp = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDebtStatusFilter(f.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                      active
                        ? 'border-[#F97316] bg-[#F97316]/15 text-[#F97316] font-semibold'
                        : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                    )}
                  >
                    {IconComp && <IconComp className="h-3 w-3" />}
                    <span>{f.label}</span>
                  </button>
                );
              })
            : [
                { id: 'all', label: 'Todos los Préstamos', icon: null },
                { id: 'pending', label: 'Pendientes', icon: Clock },
                { id: 'partial', label: 'Cobro Parcial', icon: Percent },
                { id: 'recovered', label: 'Recuperados', icon: CheckCircle2 },
                { id: 'overdue', label: 'Vencidos', icon: AlertTriangle },
                { id: 'defaulted', label: 'Incobrables', icon: Flame },
              ].map((f) => {
                const active = loanStatusFilter === f.id;
                const IconComp = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLoanStatusFilter(f.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                      active
                        ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6] font-semibold'
                        : 'border-[#2E2E2E] bg-[#121212] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                    )}
                  >
                    {IconComp && <IconComp className="h-3 w-3" />}
                    <span>{f.label}</span>
                  </button>
                );
              })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. CONTENIDO DEL MODO SELECCIONADO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'debts' ? (
        /* CONTENIDO DEUDAS */
        isLoadingDebts ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" />
          </div>
        ) : filteredDebts.length === 0 ? (
          <Card className="border-[#2E2E2E] bg-[#1E1E1E]/50">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="p-3 rounded-2xl bg-[#F97316]/10 text-[#F97316] mb-3">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {searchQuery || debtStatusFilter !== 'all'
                  ? 'No se encontraron deudas con esos filtros'
                  : 'No tienes deudas registradas'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                {searchQuery || debtStatusFilter !== 'all'
                  ? 'Prueba restableciendo los filtros de búsqueda o estado.'
                  : 'Registra tus obligaciones y pasivos para llevar control de amortizaciones.'}
              </p>
              <Button
                onClick={handleOpenNewDebt}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                <span>Agregar Deuda</span>
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onPay={handlePayDebt}
                onEdit={handleEditDebt}
                onDelete={handleDeleteDebt}
              />
            ))}
          </div>
        ) : (
          <DebtsTable
            debts={filteredDebts}
            onPay={handlePayDebt}
            onEdit={handleEditDebt}
            onDelete={handleDeleteDebt}
          />
        )
      ) : (
        /* CONTENIDO PRÉSTAMOS */
        isLoadingLoans ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
          </div>
        ) : filteredLoans.length === 0 ? (
          <Card className="border-[#2E2E2E] bg-[#1E1E1E]/50">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="p-3 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] mb-3">
                <Banknote className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {searchQuery || loanStatusFilter !== 'all'
                  ? 'No se encontraron préstamos con esos filtros'
                  : 'No tienes préstamos otorgados registrados'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                {searchQuery || loanStatusFilter !== 'all'
                  ? 'Prueba restableciendo los filtros de búsqueda o estado.'
                  : 'Registra el dinero que has prestado a amigos, familiares o socios.'}
              </p>
              <Button
                onClick={handleOpenNewLoan}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                <span>Registrar Préstamo</span>
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onPay={handlePayLoan}
                onEdit={handleEditLoan}
                onDelete={handleDeleteLoan}
              />
            ))}
          </div>
        ) : (
          <LoansTable
            loans={filteredLoans}
            onPay={handlePayLoan}
            onEdit={handleEditLoan}
            onDelete={handleDeleteLoan}
          />
        )
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. DIÁLOGOS Y MODALES DE DEUDAS
      ───────────────────────────────────────────────────────────── */}
      <DebtFormDialog
        open={isDebtFormOpen}
        onOpenChange={setIsDebtFormOpen}
        debtToEdit={debtToEdit}
      />

      <DebtPaymentDialog
        open={isDebtPaymentOpen}
        onOpenChange={setIsDebtPaymentOpen}
        debt={selectedDebtForPayment}
      />

      <DeleteDebtDialog
        open={isDeleteDebtOpen}
        onOpenChange={setIsDeleteDebtOpen}
        debt={debtToDelete}
      />

      {/* ─────────────────────────────────────────────────────────────
          7. DIÁLOGOS Y MODALES DE PRÉSTAMOS
      ───────────────────────────────────────────────────────────── */}
      <LoanFormDialog
        open={isLoanFormOpen}
        onOpenChange={setIsLoanFormOpen}
        loanToEdit={loanToEdit}
      />

      <LoanPaymentDialog
        open={isLoanPaymentOpen}
        onOpenChange={setIsLoanPaymentOpen}
        loan={selectedLoanForPayment}
      />

      <DeleteLoanDialog
        open={isDeleteLoanOpen}
        onOpenChange={setIsDeleteLoanOpen}
        loan={loanToDelete}
      />
    </div>
  );
}
