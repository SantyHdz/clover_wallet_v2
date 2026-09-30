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
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Debt, Loan, DebtStatus, LoanStatus } from '@/types';
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
          1. HEADER PRINCIPAL & BOTONES DE ACCIÓN
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <HandCoins className="h-6 w-6 text-[#3B82F6]" />
            <span>Deudas y Préstamos</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitoreo y amortización de pasivos por pagar y dinero prestado por recuperar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'debts' ? (
            <Button
              onClick={handleOpenNewDebt}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md shadow-[#F97316]/20 cursor-pointer text-xs font-semibold"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              <span>Nueva Deuda</span>
            </Button>
          ) : (
            <Button
              onClick={handleOpenNewLoan}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md shadow-[#3B82F6]/20 cursor-pointer text-xs font-semibold"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              <span>Nuevo Préstamo</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. RESUMEN KPI GLOBAL REACTIVO
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
          3. PESTAÑAS Y VISTA DE LISTADOS
      ───────────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'debts' | 'loans')}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Tabs Triggers */}
          <TabsList className="bg-[#1E1E1E] border border-[#2E2E2E] p-1 rounded-xl h-auto">
            <TabsTrigger
              value="debts"
              className="px-3.5 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-[#F97316] data-[state=active]:text-white data-[state=active]:shadow-sm gap-2 cursor-pointer transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>Lo que debo (Deudas)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
                {debts.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="loans"
              className="px-3.5 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:shadow-sm gap-2 cursor-pointer transition-all"
            >
              <Banknote className="h-4 w-4" />
              <span>Lo que me deben (Préstamos)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
                {loans.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Controles de Búsqueda y Vista */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === 'debts'
                    ? 'Buscar por acreedor...'
                    : 'Buscar por deudor...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8.5 rounded-xl border-[#2E2E2E] bg-[#1E1E1E] text-xs text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
              />
            </div>

            {/* Alternador Grid / Table */}
            <div className="flex items-center p-0.5 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-lg text-muted-foreground transition-colors cursor-pointer',
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
                  'p-1.5 rounded-lg text-muted-foreground transition-colors cursor-pointer',
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
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CONTENIDO TAB 1: DEUDAS
        ───────────────────────────────────────────────────────────── */}
        <TabsContent value="debts" className="space-y-4 outline-none">
          {/* Píldoras de Filtro por Estado para Deudas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
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
                      : 'border-[#2E2E2E] bg-[#1E1E1E] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                  )}
                >
                  {IconComp && <IconComp className="h-3 w-3" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Listado de Deudas */}
          {isLoadingDebts ? (
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
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold cursor-pointer"
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
          )}
        </TabsContent>

        {/* ─────────────────────────────────────────────────────────────
            CONTENIDO TAB 2: PRÉSTAMOS
        ───────────────────────────────────────────────────────────── */}
        <TabsContent value="loans" className="space-y-4 outline-none">
          {/* Píldoras de Filtro por Estado para Préstamos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
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
                      : 'border-[#2E2E2E] bg-[#1E1E1E] text-muted-foreground hover:bg-[#27272A] hover:text-white'
                  )}
                >
                  {IconComp && <IconComp className="h-3 w-3" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Listado de Préstamos */}
          {isLoadingLoans ? (
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
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
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
          )}
        </TabsContent>
      </Tabs>

      {/* ─────────────────────────────────────────────────────────────
          4. DIÁLOGOS Y MODALES DE DEUDAS
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
          5. DIÁLOGOS Y MODALES DE PRÉSTAMOS
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
