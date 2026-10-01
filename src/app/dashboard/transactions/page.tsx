'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction, TransactionType } from '@/types';
import { useTransactions } from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';
import { useAuth } from '@/contexts/auth-context';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { TransactionCard } from '@/components/transactions/transaction-card';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog';
import { DeleteTransactionDialog } from '@/components/transactions/delete-transaction-dialog';
import { cn, formatAmount, getAmountFontSize } from '@/lib/utils';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Modals state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Build backend query params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (selectedType !== 'all') params.type = selectedType as TransactionType;
    if (selectedCategoryId !== 'all') params.category_id = selectedCategoryId;
    if (selectedMonth !== 'all') params.month = Number(selectedMonth);
    if (selectedYear !== 'all') params.year = Number(selectedYear);
    return params;
  }, [selectedType, selectedCategoryId, selectedMonth, selectedYear]);

  const { data: transactions = [], isLoading } = useTransactions(queryParams);

  // Client-side description search filter
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    return transactions.filter((tx) =>
      (tx.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  // Compute metrics from current transactions
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    const net = income - expense;

    return {
      income,
      expense,
      net,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedCategoryId !== 'all' ||
    selectedMonth !== 'all' ||
    selectedYear !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategoryId('all');
    setSelectedMonth('all');
    setSelectedYear('all');
  };

  const handleOpenCreate = () => {
    setTransactionToEdit(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setFormDialogOpen(true);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setTransactionToDelete(tx);
    setDeleteDialogOpen(true);
  };

  const currencySymbol = user?.currency === 'EUR' ? '€' : '$';

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#1E1E1E] via-[#161616] to-[#1E1E1E] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Historial de Transacciones
            </h1>
            <p className="text-xs text-muted-foreground">
              Registro y clasificación de ingresos y egresos financieros
            </p>
          </div>
        </div>

        <Button
          data-tour="tx-add-btn"
          onClick={handleOpenCreate}
          className="bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/25 font-semibold text-xs h-10 px-4 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nueva Transacción
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUMMARY KPI CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Ingresos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#22C55E]/40 transition-colors">
          <CardContent className="p-0 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-1">
              <span className="text-[11px] text-muted-foreground font-medium">Ingresos Totales</span>
              <div
                className={cn(
                  'font-bold text-[#22C55E] mt-0.5 truncate',
                  getAmountFontSize(`+${currencySymbol}${formatAmount(metrics.income)}`, '2xl')
                )}
                title={`+${currencySymbol}${formatAmount(metrics.income)}`}
              >
                +{currencySymbol}{formatAmount(metrics.income)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Total Gastos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#EF4444]/40 transition-colors">
          <CardContent className="p-0 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-1">
              <span className="text-[11px] text-muted-foreground font-medium">Gastos Totales</span>
              <div
                className={cn(
                  'font-bold text-[#EF4444] mt-0.5 truncate',
                  getAmountFontSize(`-${currencySymbol}${formatAmount(metrics.expense)}`, '2xl')
                )}
                title={`-${currencySymbol}${formatAmount(metrics.expense)}`}
              >
                -{currencySymbol}{formatAmount(metrics.expense)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] shrink-0">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Balance Neto */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#10B981]/40 transition-colors">
          <CardContent className="p-0 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-1">
              <span className="text-[11px] text-muted-foreground font-medium">Balance Neto</span>
              <div
                className={cn(
                  'font-bold mt-0.5 truncate',
                  metrics.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]',
                  getAmountFontSize(`${metrics.net >= 0 ? '+' : ''}${currencySymbol}${formatAmount(metrics.net)}`, '2xl')
                )}
                title={`${metrics.net >= 0 ? '+' : ''}${currencySymbol}${formatAmount(metrics.net)}`}
              >
                {metrics.net >= 0 ? '+' : ''}{currencySymbol}{formatAmount(metrics.net)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Total Movimientos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium">Movimientos</span>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {metrics.count}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#121212] border border-[#2E2E2E] flex items-center justify-center text-muted-foreground shrink-0">
              <Wallet className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ADVANCED FILTERS BAR
      ───────────────────────────────────────────────────────────── */}
      <div data-tour="tx-filters">
        <TransactionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          categories={categories}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TRANSACTIONS LIST (TABLE OR GRID CARDS)
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'table' ? (
        <TransactionsTable
          transactions={filteredTransactions}
          categories={categories}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onCreateNew={handleOpenCreate}
          currencySymbol={currencySymbol}
        />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card className="border-[#2E2E2E] bg-[#1E1E1E]/50">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="p-3 rounded-2xl bg-[#10B981]/10 text-[#10B981] mb-3">
              <ArrowLeftRight className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              {hasActiveFilters
                ? 'No se encontraron movimientos con los filtros seleccionados'
                : 'No tienes transacciones registradas'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? 'Prueba ajustando los filtros de búsqueda, categoría o fecha.'
                : 'Comienza a registrar tus ingresos y gastos para ver estadísticas detalladas.'}
            </p>
            <Button
              onClick={handleOpenCreate}
              className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              <span>Registrar Transacción</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              category={categories.find((c) => c.id === tx.category_id)}
              currencySymbol={currencySymbol}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. MODALS (CREATE/EDIT & DELETE)
      ───────────────────────────────────────────────────────────── */}
      <TransactionFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        transactionToEdit={transactionToEdit}
      />

      <DeleteTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        transaction={transactionToDelete}
      />
    </div>
  );
}
