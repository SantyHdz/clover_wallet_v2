'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PieChart as PieChartIcon,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Receipt,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/contexts/auth-context';
import {
  useReportsSummary,
  useMonthlyReports,
  useCategoryBreakdown,
} from '@/hooks/use-reports';
import { useTransactions } from '@/hooks/use-transactions';
import { ExportReportDialog } from '@/components/reports/export-report-dialog';
import { CategoryIcon } from '@/lib/category-icons';
import { cn, formatAmount } from '@/lib/utils';

const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const FULL_MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Fallback palette for pie chart slices
const PIE_COLORS = [
  '#10B981', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EAB308', '#14B8A6', '#6366F1', '#F43F5E'
];

export default function ReportsPage() {
  const { user } = useAuth();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [breakdownType, setBreakdownType] = useState<'expense' | 'income'>('expense');

  const currencySymbol = user?.currency === 'COP' ? 'COL$' : user?.currency === 'EUR' ? '€' : '$';

  // API Queries
  const { data: summary, isLoading: isLoadingSummary } = useReportsSummary();
  const { data: rawMonthlyData = [], isLoading: isLoadingMonthly } = useMonthlyReports(selectedYear);
  const { data: rawBreakdown = [], isLoading: isLoadingBreakdown } = useCategoryBreakdown({
    type: breakdownType,
    year: selectedYear,
    month: selectedMonth,
  });
  const { data: transactions = [] } = useTransactions({
    year: selectedYear,
    month: selectedMonth,
  });

  // Complete 12 months array for smooth chart visualization
  const monthlyChartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const monthNum = index + 1;
      const found = rawMonthlyData.find((m) => m.month === monthNum);
      return {
        month: MONTH_NAMES[index],
        monthFull: FULL_MONTH_NAMES[index],
        monthIndex: monthNum,
        income: Number(found?.total_income || 0),
        expense: Number(found?.total_expense || 0),
        balance: Number(found?.balance || 0),
      };
    });
  }, [rawMonthlyData]);

  // Normalized Breakdown data with colors and percentages
  const breakdownData = useMemo(() => {
    const totalAmount = rawBreakdown.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
    return rawBreakdown.map((item, idx) => {
      const amount = Number(item.total_amount || 0);
      const percentage = totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0;
      return {
        ...item,
        total_amount: amount,
        percentage,
        fill: item.category_color || PIE_COLORS[idx % PIE_COLORS.length],
      };
    });
  }, [rawBreakdown]);

  // Aggregate stats for the selected period
  const totalIncome = Number(summary?.total_income || 0);
  const totalExpense = Number(summary?.total_expense || 0);
  const balance = Number(summary?.balance || 0);
  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Shadcn Chart Configurations
  const barChartConfig = {
    income: {
      label: 'Ingresos',
      color: '#22C55E',
    },
    expense: {
      label: 'Gastos',
      color: '#EF4444',
    },
    balance: {
      label: 'Balance Neto',
      color: '#10B981',
    },
  } satisfies ChartConfig;

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {
      amount: {
        label: breakdownType === 'expense' ? 'Gastos' : 'Ingresos',
      },
    };
    breakdownData.forEach((item) => {
      config[item.category_id] = {
        label: item.category_name,
        color: item.fill,
      };
    });
    return config;
  }, [breakdownData, breakdownType]);

  const years = [currentDate.getFullYear(), currentDate.getFullYear() - 1, currentDate.getFullYear() - 2];

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER Y BARRA DE FILTROS & EXPORTACIÓN
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#2E2E2E] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-[#10B981]" />
            <span>Reportes & Estadísticas</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Análisis consolidado de flujo de caja, comparativa mensual y desglose por categorías.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Año */}
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="w-[110px] border-[#2E2E2E] bg-[#1E1E1E] text-white text-xs font-semibold">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#10B981]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  Año {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selector de Mes */}
          <Select
            value={String(selectedMonth)}
            onValueChange={(val) => setSelectedMonth(Number(val))}
          >
            <SelectTrigger className="w-[130px] border-[#2E2E2E] bg-[#1E1E1E] text-white text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
              {FULL_MONTH_NAMES.map((name, idx) => (
                <SelectItem key={idx + 1} value={String(idx + 1)} className="text-xs">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botón de Exportación con Puppeteer */}
          <ExportReportDialog
            currentYear={selectedYear}
            currentMonth={selectedMonth}
            summary={summary}
            monthlyData={rawMonthlyData}
            breakdown={breakdownData}
            transactions={transactions}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 4 FINANCIAL KPI CARDS CON SEPARADOR DE MILES (,)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Ingresos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#22C55E]/40 transition-all shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Ingresos
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-28 bg-[#27272A]" />
            ) : (
              <div className="text-2xl font-extrabold text-[#22C55E]">
                +{currencySymbol}{formatAmount(totalIncome)}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#22C55E]" />
              <span>Entradas acumuladas</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Gastos */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#EF4444]/40 transition-all shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Gastos
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]/15 text-[#EF4444]">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-28 bg-[#27272A]" />
            ) : (
              <div className="text-2xl font-extrabold text-[#EF4444]">
                -{currencySymbol}{formatAmount(totalExpense)}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownRight className="h-3.5 w-3.5 text-[#EF4444]" />
              <span>Egresos devengados</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Balance */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#10B981]/40 transition-all shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Balance Neto
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-28 bg-[#27272A]" />
            ) : (
              <div
                className={cn(
                  'text-2xl font-extrabold',
                  balance >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                )}
              >
                {balance >= 0 ? '+' : ''}{currencySymbol}{formatAmount(balance)}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              {balance >= 0 ? 'Superávit financiero' : 'Déficit financiero'}
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Tasa de Ahorro */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] hover:border-[#3B82F6]/40 transition-all shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tasa de Ahorro
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/15 text-[#3B82F6]">
              <PiggyBank className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-28 bg-[#27272A]" />
            ) : (
              <div className="text-2xl font-extrabold text-white">
                {savingsRate}%
              </div>
            )}
            <div className="mt-1">
              <Progress value={savingsRate} className="h-1.5 bg-[#2E2E2E]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SECCIÓN PRINCIPAL DE GRÁFICOS SHADCN CHARTS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO 1: EVOLUCIÓN MENSUAL (BAR CHART) */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#10B981]" />
                <span>Evolución Mensual del Año {selectedYear}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Comparativa de ingresos, gastos y balance neto mensual
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] text-xs text-muted-foreground">
              12 Meses
            </Badge>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoadingMonthly ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[280px] w-full bg-[#27272A]" />
              </div>
            ) : (
              <ChartContainer config={barChartConfig} className="h-[320px] w-full">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#2E2E2E" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#A1A1AA', fontSize: 10 }}
                    tickFormatter={(val) => `${currencySymbol}${formatAmount(val, 0)}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(val, name) => {
                          const num = Number(val);
                          const isInc = name === 'income';
                          const isExp = name === 'expense';
                          const color = isInc ? 'text-[#22C55E]' : isExp ? 'text-[#EF4444]' : 'text-[#10B981]';
                          const label = isInc ? 'Ingresos' : isExp ? 'Gastos' : 'Balance Neto';
                          return (
                            <div className="flex items-center justify-between gap-4 w-full">
                              <span className="text-muted-foreground text-[11px]">{label}:</span>
                              <span className={cn('font-mono font-bold text-[11px]', color)}>
                                {isInc ? '+' : isExp ? '-' : num >= 0 ? '+' : ''}
                                {currencySymbol}{formatAmount(num)}
                              </span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <ChartLegend content={(props: any) => <ChartLegendContent payload={props.payload} verticalAlign={props.verticalAlign} />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* GRÁFICO 2: DESGLOSE POR CATEGORÍAS (DONUT / PIE CHART) */}
        <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-lg flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-[#10B981]" />
                <span>Desglose por Categoría</span>
              </CardTitle>
              <div className="flex bg-[#121212] p-0.5 rounded-lg border border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={() => setBreakdownType('expense')}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors',
                    breakdownType === 'expense'
                      ? 'bg-[#EF4444] text-white'
                      : 'text-muted-foreground hover:text-white'
                  )}
                >
                  Gastos
                </button>
                <button
                  type="button"
                  onClick={() => setBreakdownType('income')}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors',
                    breakdownType === 'income'
                      ? 'bg-[#22C55E] text-white'
                      : 'text-muted-foreground hover:text-white'
                  )}
                >
                  Ingresos
                </button>
              </div>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {FULL_MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex-1 flex flex-col justify-center">
            {isLoadingBreakdown ? (
              <div className="h-[220px] flex items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full bg-[#27272A]" />
              </div>
            ) : breakdownData.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-center p-4">
                <PieChartIcon className="h-10 w-10 text-[#2E2E2E] mb-2" />
                <p className="text-xs text-muted-foreground">
                  No hay movimientos de {breakdownType === 'expense' ? 'gastos' : 'ingresos'} registrados en este mes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[200px]">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(val, name, item) => (
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-muted-foreground">{item.payload.category_name}:</span>
                              <span className="font-mono font-bold text-white">
                                {currencySymbol}{formatAmount(Number(val))} ({item.payload.percentage}%)
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={breakdownData}
                      dataKey="total_amount"
                      nameKey="category_name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#1E1E1E" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* Top Categories Mini List */}
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {breakdownData.slice(0, 4).map((item) => (
                    <div key={item.category_id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-muted-foreground truncate">{item.category_name}</span>
                      </div>
                      <span className="font-mono font-bold text-white whitespace-nowrap">
                        {currencySymbol}{formatAmount(item.total_amount)}
                        <span className="text-muted-foreground text-[10px] ml-1">({item.percentage}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TABLAS DETALLADAS (DESGLOSE Y REGISTROS MENSUALES)
      ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList className="bg-[#1E1E1E] border border-[#2E2E2E] p-1 rounded-xl">
          <TabsTrigger
            value="breakdown"
            className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
          >
            Desglose de Categorías ({breakdownData.length})
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="rounded-lg text-xs data-[state=active]:bg-[#10B981] data-[state=active]:text-white font-medium"
          >
            Histórico Mensual ({selectedYear})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Desglose por Categorías */}
        <TabsContent value="breakdown">
          <Card className="border-[#2E2E2E] bg-[#1E1E1E]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white">
                Distribución de {breakdownType === 'expense' ? 'Gastos' : 'Ingresos'} — {FULL_MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Concentración del dinero por categoría con separador de miles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {breakdownData.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No hay datos disponibles para el período seleccionado.
                </div>
              ) : (
                <div className="rounded-xl border border-[#2E2E2E] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#18181B]">
                      <TableRow className="border-[#2E2E2E] hover:bg-transparent">
                        <TableHead className="text-xs font-semibold text-muted-foreground">Categoría</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-center">Movimientos</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Participación</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right">Monto Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {breakdownData.map((cat) => (
                        <TableRow key={cat.category_id} className="border-[#2E2E2E] hover:bg-[#27272A]/40">
                          <TableCell className="font-medium text-white text-xs">
                            <div className="flex items-center gap-2">
                              <CategoryIcon iconName={cat.category_icon} color={cat.fill} className="h-4 w-4" />
                              <span>{cat.category_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground text-center">
                            {cat.count} {cat.count === 1 ? 'registro' : 'registros'}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-2 max-w-[140px]">
                              <Progress value={cat.percentage} className="h-1.5 bg-[#2E2E2E]" />
                              <span className="text-[11px] font-mono text-muted-foreground w-8">
                                {cat.percentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold font-mono text-white">
                            {currencySymbol}{formatAmount(cat.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Histórico Mensual */}
        <TabsContent value="monthly">
          <Card className="border-[#2E2E2E] bg-[#1E1E1E]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white">
                Progreso Mensual Consolidado — Año {selectedYear}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Comparativa de ingresos, gastos y balance neto mensual con formato monetario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-[#2E2E2E] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#18181B]">
                    <TableRow className="border-[#2E2E2E] hover:bg-transparent">
                      <TableHead className="text-xs font-semibold text-muted-foreground">Mes</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">Ingresos</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">Gastos</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">Balance Neto</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyChartData.map((row) => {
                      const bal = row.balance;
                      const hasActivity = row.income > 0 || row.expense > 0;
                      return (
                        <TableRow key={row.monthIndex} className="border-[#2E2E2E] hover:bg-[#27272A]/40">
                          <TableCell className="font-semibold text-white text-xs">
                            {row.monthFull}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-semibold text-[#22C55E]">
                            +{currencySymbol}{formatAmount(row.income)}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-semibold text-[#EF4444]">
                            -{currencySymbol}{formatAmount(row.expense)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right text-xs font-mono font-bold',
                              bal >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                            )}
                          >
                            {bal >= 0 ? '+' : ''}{currencySymbol}{formatAmount(bal)}
                          </TableCell>
                          <TableCell className="text-center">
                            {hasActivity ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] font-semibold py-0.5',
                                  bal >= 0
                                    ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]'
                                    : 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]'
                                )}
                              >
                                {bal >= 0 ? 'Superávit' : 'Déficit'}
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">Sin datos</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
