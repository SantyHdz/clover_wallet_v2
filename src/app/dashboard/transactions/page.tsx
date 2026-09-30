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
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog';
import { DeleteTransactionDialog } from '@/components/transactions/delete-transaction-dialog';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();

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
            <div>
              <span className="text-[11px] text-muted-foreground font-medium">Ingresos Totales</span>
              <div className="text-lg sm:text-xl font-bold text-[#22C55E] mt-0.5">
                +{currencySymbol}{metrics.income.toFixed(2)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Total Gastos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#EF4444]/40 transition-colors">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium">Gastos Totales</span>
              <div className="text-lg sm:text-xl font-bold text-[#EF4444] mt-0.5">
                -{currencySymbol}{metrics.expense.toFixed(2)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Balance Neto */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#10B981]/40 transition-colors">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium">Balance Neto</span>
              <div
                className={cn(
                  'text-lg sm:text-xl font-bold mt-0.5',
                  metrics.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                )}
              >
                {metrics.net >= 0 ? '+' : ''}{currencySymbol}{metrics.net.toFixed(2)}
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
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
            <div className="h-8 w-8 rounded-lg bg-[#121212] border border-[#2E2E2E] flex items-center justify-center text-muted-foreground">
              <Wallet className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ADVANCED FILTERS BAR
      ───────────────────────────────────────────────────────────── */}
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
      />

      {/* ─────────────────────────────────────────────────────────────
          4. TRANSACTIONS TABLE
      ───────────────────────────────────────────────────────────── */}
      <TransactionsTable
        transactions={filteredTransactions}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onCreateNew={handleOpenCreate}
        currencySymbol={currencySymbol}
      />

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
