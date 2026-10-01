'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  HandCoins,
  Plus,
  ArrowRight,
  Wallet,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  PieChart as PieChartIcon,
  Tag,
  Repeat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead, 
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useReportsSummary } from '@/hooks/use-reports';
import { useTransactions } from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';
import { CategoryIcon } from '@/lib/category-icons';
import { AnimatedAmount } from '@/components/common/animated-amount';
import { cn, formatAmount, getAmountFontSize } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: summary, isLoading: isLoadingSummary } = useReportsSummary();
  const { data: transactions = [], isLoading: isLoadingTx } = useTransactions();
  const { data: categories = [] } = useCategories();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const currencySymbol = user?.currency === 'EUR' ? '€' : '$';

  // Metrics from real backend summary
  const totalIncome = Number(summary?.total_income || 0);
  const totalExpense = Number(summary?.total_expense || 0);
  const balance = Number(summary?.balance || 0);
  const totalDebt = Number(summary?.total_debt || 0);
  const totalDebtPaid = Number(summary?.total_debt_paid || 0);
  const totalDebtPending = Number(summary?.total_debt_pending || 0);
  const totalLoan = Number(summary?.total_loan || 0);
  const totalLoanRecovered = Number(summary?.total_loan_recovered || 0);
  const totalLoanPending = Number(summary?.total_loan_pending || 0);

  // Percentages
  const debtProgress =
    totalDebt > 0 ? Math.min(100, Math.round((totalDebtPaid / totalDebt) * 100)) : 0;
  const loanProgress =
    totalLoan > 0 ? Math.min(100, Math.round((totalLoanRecovered / totalLoan) * 100)) : 0;
  const expenseRatio =
    totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;

  const recentTransactions = transactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. WELCOME HERO CARD
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-[#2E2E2E] bg-gradient-to-r from-[#1E1E1E] via-[#161616] to-[#1E1E1E] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] px-2.5 py-0.5 text-xs font-semibold">
                  🍀 Panel Financiero en Vivo
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Moneda: <strong className="text-white">{user?.currency?.toUpperCase() || 'USD'}</strong>
                </span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {getGreeting()}, {user?.full_name ? user.full_name.split(' ')[0] : 'Financiero'}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Control consolidado de tu flujo de ingresos, egresos, pasivos y préstamos otorgados.
              </CardDescription>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href="/dashboard/transactions">
                <Button
                  size="sm"
                  className="bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/25 font-medium cursor-pointer"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Nueva Transaccion
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#2E2E2E] bg-[#1E1E1E] text-white hover:bg-[#27272A] hover:border-[#10B981]/40"
                >
                  <PieChartIcon className="mr-1.5 h-4 w-4 text-[#10B981]" />
                  Ver Reportes
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          2. 4 FINANCIAL KPI CARDS (DATOS REALES)
      ───────────────────────────────────────────────────────────── */}
      <div data-tour="dashboard-kpis" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Ingresos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#22C55E]/40 transition-all shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Ingresos
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22C55E]/15 text-[#22C55E] group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32 bg-[#27272A]" />
            ) : (
              <div
                className={cn(
                  'font-extrabold text-[#22C55E] truncate',
                  getAmountFontSize(`+${currencySymbol}${formatAmount(totalIncome)}`, '3xl')
                )}
                title={`+${currencySymbol}${formatAmount(totalIncome)}`}
              >
                <AnimatedAmount
                  value={totalIncome}
                  prefix={`+${currencySymbol}`}
                />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Entradas consolidadas</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-[#2E2E2E]/60 text-[11px] text-muted-foreground flex justify-between">
            <span>Histórico acumulado</span>
            <span className="text-[#22C55E] font-medium">Activo</span>
          </CardFooter>
        </Card>

        {/* KPI 2: Gastos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#EF4444]/40 transition-all shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Gastos
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EF4444]/15 text-[#EF4444] group-hover:scale-105 transition-transform">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32 bg-[#27272A]" />
            ) : (
              <div
                className={cn(
                  'font-extrabold text-[#EF4444] truncate',
                  getAmountFontSize(`-${currencySymbol}${formatAmount(totalExpense)}`, '3xl')
                )}
                title={`-${currencySymbol}${formatAmount(totalExpense)}`}
              >
                <AnimatedAmount
                  value={totalExpense}
                  prefix={`-${currencySymbol}`}
                />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[#EF4444]">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Egresos devengados</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-[#2E2E2E]/60 text-[11px] text-muted-foreground flex justify-between">
            <span>Gasto vs Ingreso</span>
            <span className="text-[#EF4444] font-medium">{expenseRatio}%</span>
          </CardFooter>
        </Card>

        {/* KPI 3: Deudas */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#F97316]/40 transition-all shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Deudas Pendientes
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316]/15 text-[#F97316] group-hover:scale-105 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32 bg-[#27272A]" />
            ) : (
              <div
                className={cn(
                  'font-extrabold text-white truncate',
                  getAmountFontSize(`${currencySymbol}${formatAmount(totalDebtPending)}`, '3xl')
                )}
                title={`${currencySymbol}${formatAmount(totalDebtPending)}`}
              >
                <AnimatedAmount
                  value={totalDebtPending}
                  prefix={currencySymbol}
                />
              </div>
            )}
            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Amortizado: {currencySymbol}{formatAmount(totalDebtPaid)}</span>
                <span className="text-white font-medium">{debtProgress}%</span>
              </div>
              <Progress value={debtProgress} className="h-1.5 bg-[#2E2E2E]" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-[#2E2E2E]/60 text-[11px] text-muted-foreground flex justify-between">
            <span>Total: {currencySymbol}{formatAmount(totalDebt)}</span>
            <span className="text-[#F97316] font-medium">{totalDebtPending > 0 ? 'Por liquidar' : 'Al día'}</span>
          </CardFooter>
        </Card>

        {/* KPI 4: Préstamos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#3B82F6]/40 transition-all shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Por Recuperar
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] group-hover:scale-105 transition-transform">
              <HandCoins className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32 bg-[#27272A]" />
            ) : (
              <div
                className={cn(
                  'font-extrabold text-white truncate',
                  getAmountFontSize(`${currencySymbol}${formatAmount(totalLoanPending)}`, '3xl')
                )}
                title={`${currencySymbol}${formatAmount(totalLoanPending)}`}
              >
                <AnimatedAmount
                  value={totalLoanPending}
                  prefix={currencySymbol}
                />
              </div>
            )}
            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Cobrado: {currencySymbol}{formatAmount(totalLoanRecovered)}</span>
                <span className="text-white font-medium">{loanProgress}%</span>
              </div>
              <Progress value={loanProgress} className="h-1.5 bg-[#2E2E2E]" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-[#2E2E2E]/60 text-[11px] text-muted-foreground flex justify-between">
            <span>Total: {currencySymbol}{formatAmount(totalLoan)}</span>
            <span className="text-[#3B82F6] font-medium">{totalLoanPending > 0 ? 'En cobranza' : 'Completado'}</span>
          </CardFooter>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TABS: RESUMEN / MOVIMIENTOS RECIENTES / SALUD
      ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2E2E] pb-3">
          <TabsList className="bg-[#1E1E1E] border border-[#2E2E2E] p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Resumen General
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Movimientos Recientes ({transactions.length})
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
            >
              Salud Financiera
            </TabsTrigger>
          </TabsList>

          <Badge variant="outline" className="border-[#2E2E2E] bg-[#1E1E1E] text-xs text-muted-foreground self-start sm:self-auto py-1 px-3">
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#10B981]" />
            {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date())}
          </Badge>
        </div>

        {/* Tab 1: Resumen General */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Net Balance Card */}
            <Card data-tour="dashboard-recent" className="border-[#2E2E2E] bg-[#1E1E1E] p-6 lg:col-span-2 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-lg text-white">Balance Neto Calculado</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Diferencia directa entre ingresos percibidos y gastos devengados
                    </CardDescription>
                  </div>
                  <Badge className="bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30 border-0 text-xs">
                    En Tiempo Real
                  </Badge>
                </div>

                <div className="mt-4 rounded-2xl border border-[#2E2E2E] bg-[#121212] p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Disponible para ahorro/inversión</span>
                    {isLoadingSummary ? (
                      <Skeleton className="h-10 w-44 bg-[#27272A] mt-1" />
                    ) : (
                      <div
                        className={cn(
                          'font-black mt-1 truncate',
                          balance >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]',
                          getAmountFontSize(`${balance >= 0 ? '+' : ''}${currencySymbol}${formatAmount(balance)}`, '3xl')
                        )}
                        title={`${balance >= 0 ? '+' : ''}${currencySymbol}${formatAmount(balance)}`}
                      >
                        <AnimatedAmount
                          value={balance}
                          prefix={currencySymbol}
                          showSign={true}
                        />
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/transactions">
                    <Button variant="outline" size="sm" className="border-[#2E2E2E] bg-[#1E1E1E] text-white hover:bg-[#27272A]">
                      Administrar Registros
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E2E2E] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#2E2E2E]">
                  <span className="text-muted-foreground">Porcentaje Gastado</span>
                  <span className="font-semibold text-white">{expenseRatio}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#2E2E2E]">
                  <span className="text-muted-foreground">Deudas por liquidar</span>
                  <span className="font-semibold text-[#F97316]">
                    <AnimatedAmount
                      value={totalDebtPending}
                      prefix={currencySymbol}
                    />
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Modules Shortcuts Card */}
            <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-lg flex flex-col justify-between">
              <div>
                <CardTitle className="text-base text-white mb-1">Módulos Especializados</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mb-4">
                  Acceso directo a las herramientas principales de Clover
                </CardDescription>

                <div className="space-y-2.5">
                  <Link
                    href="/dashboard/transactions"
                    className="flex items-center justify-between p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] hover:border-[#10B981]/50 hover:bg-[#1A1A1A] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-[#10B981] transition-colors">
                          Transacciones
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {transactions.length} movimientos
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/debts-loans"
                    className="flex items-center justify-between p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] hover:border-[#3B82F6]/50 hover:bg-[#1A1A1A] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center">
                        <HandCoins className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-[#3B82F6] transition-colors">
                          Deudas & Préstamos
                        </div>
                        <div className="text-[10px] text-muted-foreground">Abonos y cobranzas</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/categories"
                    className="flex items-center justify-between p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] hover:border-[#F97316]/50 hover:bg-[#1A1A1A] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#F97316]/15 text-[#F97316] flex items-center justify-center">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-[#F97316] transition-colors">
                          Categorías
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {categories.length} categorías
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Movimientos Recientes */}
        <TabsContent value="recent">
          <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-white">Últimas Transacciones Registradas</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Detalle cronológico de tus movimientos financieros más recientes
                </CardDescription>
              </div>
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm" className="border-[#2E2E2E] bg-[#121212] text-xs text-white hover:bg-[#27272A]">
                  Ver Todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingTx ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-[#27272A] rounded-xl" />
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <Wallet className="h-8 w-8 text-[#2E2E2E] mx-auto mb-2" />
                  Aún no tienes movimientos registrados.
                  <div className="mt-3">
                    <Link href="/dashboard/transactions">
                      <Button size="sm" className="bg-[#10B981] text-white hover:bg-[#059669] text-xs">
                        + Registrar primera transacción
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#2E2E2E] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#121212]">
                      <TableRow className="border-[#2E2E2E] hover:bg-transparent">
                        <TableHead className="text-xs text-muted-foreground">Fecha</TableHead>
                        <TableHead className="text-xs text-muted-foreground">Categoría</TableHead>
                        <TableHead className="text-xs text-muted-foreground">Descripción</TableHead>
                        <TableHead className="text-xs text-muted-foreground">Tipo</TableHead>
                        <TableHead className="text-xs text-muted-foreground text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((tx) => {
                        const isIncome = tx.type === 'income';
                        const cat =
                          tx.category || categories.find((c) => c.id === tx.category_id);
                        const catColor = cat?.color || '#71717A';

                        return (
                          <TableRow key={tx.id} className="border-[#2E2E2E] hover:bg-[#1A1A1A]">
                            <TableCell className="text-xs text-white whitespace-nowrap">
                              {formatDate(tx.transaction_date)}
                            </TableCell>

                            <TableCell className="text-xs">
                              {cat ? (
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-[#2E2E2E] bg-[#121212]">
                                  <div
                                    className="flex h-3.5 w-3.5 items-center justify-center rounded text-white text-[8px]"
                                    style={{ backgroundColor: catColor }}
                                  >
                                    <CategoryIcon iconName={cat.icon} className="h-2 w-2" />
                                  </div>
                                  <span className="text-white text-xs">{cat.name}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  Sin categoría
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-xs font-medium text-white max-w-[180px] truncate">
                              {tx.description || (isIncome ? 'Ingreso' : 'Gasto')}
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] font-semibold py-0.5',
                                  isIncome
                                    ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]'
                                    : 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
                                )}
                              >
                                {isIncome ? 'Ingreso' : 'Gasto'}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right text-xs font-bold whitespace-nowrap">
                              <span className={isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                                {isIncome ? '+' : '-'}{currencySymbol}{formatAmount(tx.amount)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Salud Financiera */}
        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Indicador de Capacidad de Ahorro</h3>
                  <p className="text-xs text-muted-foreground">Basado en tus ingresos y gastos reales</p>
                </div>
              </div>

              <Separator className="bg-[#2E2E2E]" />

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Porcentaje de Gastos sobre Ingresos</span>
                    <span className="text-white font-medium">{expenseRatio}%</span>
                  </div>
                  <Progress value={expenseRatio} className="h-2 bg-[#2E2E2E]" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Amortización de Deudas</span>
                    <span className="text-[#F97316] font-medium">{debtProgress}%</span>
                  </div>
                  <Progress value={debtProgress} className="h-2 bg-[#2E2E2E]" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Recuperación de Préstamos</span>
                    <span className="text-[#3B82F6] font-medium">{loanProgress}%</span>
                  </div>
                  <Progress value={loanProgress} className="h-2 bg-[#2E2E2E]" />
                </div>
              </div>
            </Card>

            <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sincronización con el Backend</h3>
                  <p className="text-xs text-muted-foreground">FastAPI + Supabase PostgreSQL</p>
                </div>
              </div>

              <Separator className="bg-[#2E2E2E]" />

              <p className="text-xs text-muted-foreground leading-relaxed">
                Todas las métricas de este dashboard se actualizan automáticamente utilizando React Query v5 y caché optimizado para garantizar latencia mínima en cada consulta financiera.
              </p>

              <div className="pt-2">
                <Badge variant="outline" className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs">
                  Estado: Conectado en Tiempo Real
                </Badge>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
