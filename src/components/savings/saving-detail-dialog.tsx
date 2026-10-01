'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  Calendar,
  Clock,
  History,
  Plus,
  Trash2,
  TrendingUp,
  Target,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  useSavingContributions,
  useDeleteSavingContribution,
  useMonthlyContributions,
} from '@/hooks/use-savings';
import { Saving, SavingProjection } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { formatMoney, formatAmount, getAmountFontSize, cn } from '@/lib/utils';
import { CategoryIcon } from '@/lib/category-icons';

const MONTH_NAMES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

interface SavingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving?: Saving | null;
  projection?: SavingProjection;
  onAddContribution: (saving: Saving) => void;
}

export function SavingDetailDialog({
  open,
  onOpenChange,
  saving,
  projection,
  onAddContribution,
}: SavingDetailDialogProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const {
    data: contributions = [],
    isLoading: isLoadingContributions,
  } = useSavingContributions(saving?.id);

  const {
    data: monthlyData = [],
    isLoading: isLoadingMonthly,
  } = useMonthlyContributions(saving?.id, selectedYear);

  const deleteContributionMutation = useDeleteSavingContribution();

  if (!saving) return null;

  const currentAmount = Number(saving.current_amount || 0);
  const targetAmount = saving.target_amount ? Number(saving.target_amount) : null;
  const isGoal = saving.type === 'goal' && targetAmount !== null && targetAmount > 0;
  const percentage = isGoal
    ? Math.min(100, Math.round((currentAmount / targetAmount!) * 100))
    : 100;
  const remaining = isGoal ? Math.max(0, targetAmount! - currentAmount) : 0;
  const accentColor = saving.color || '#10B981';

  const formattedCurrent = formatMoney(currentAmount, currency);
  const formattedTarget = targetAmount ? formatMoney(targetAmount, currency) : null;
  const formattedRemaining = formatMoney(remaining, currency);

  // Format monthly chart data
  const chartData = (monthlyData.length > 0
    ? monthlyData
    : Array.from({ length: 12 }, (_, i) => ({ year: selectedYear, month: i + 1, total: 0 }))
  ).map((item) => ({
    name: MONTH_NAMES[item.month - 1],
    total: Number(item.total || 0),
  }));

  const totalYearContributed = chartData.reduce((acc, curr) => acc + curr.total, 0);

  const handleDeleteContribution = async (contributionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este aporte?')) return;
    try {
      await deleteContributionMutation.mutateAsync({
        savingId: saving.id,
        contributionId,
      });
    } catch (e) {
      // Handled by toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] bg-[#1E1E1E] border-[#2E2E2E] text-white p-5 sm:p-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="pr-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                }}
              >
                <CategoryIcon iconName={saving.icon || 'piggybank'} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold truncate">
                  {saving.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  {isGoal ? 'Meta Financiera con Plazo' : 'Alcancía de Ahorro Libre'} • Creada el{' '}
                  {new Date(saving.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </DialogDescription>
              </div>
            </div>

            <Button
              onClick={() => onAddContribution(saving)}
              size="sm"
              className="bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs gap-1 shrink-0 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Aportar</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Progress & Overview Card */}
        <div className="bg-[#121212] border border-[#2E2E2E] rounded-xl p-3.5 sm:p-4 mt-2 space-y-3">
          {/* Montos Estadísticos en Cajas Separadas */}
          <div className={cn(
            'grid gap-2 sm:gap-2.5',
            isGoal ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'
          )}>
            {/* Monto Acumulado */}
            <div className="bg-[#18181B] border border-[#2E2E2E] rounded-lg p-2.5 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block truncate">
                Monto Acumulado
              </span>
              <div
                className={cn(
                  'font-bold text-white mt-0.5 truncate',
                  getAmountFontSize(formattedCurrent, 'xl')
                )}
                title={formattedCurrent}
              >
                {formattedCurrent}
              </div>
            </div>

            {isGoal && formattedTarget && (
              <>
                {/* Monto Meta */}
                <div className="bg-[#18181B] border border-[#2E2E2E] rounded-lg p-2.5 min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#3B82F6] font-medium block truncate">
                    Monto Meta
                  </span>
                  <div
                    className={cn(
                      'font-bold text-[#3B82F6] mt-0.5 truncate',
                      getAmountFontSize(formattedTarget, 'xl')
                    )}
                    title={formattedTarget}
                  >
                    {formattedTarget}
                  </div>
                </div>

                {/* Restante por Ahorrar */}
                <div className="bg-[#18181B] border border-[#2E2E2E] rounded-lg p-2.5 min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#F59E0B] font-medium block truncate">
                    Falta por Ahorrar
                  </span>
                  <div
                    className={cn(
                      'font-bold text-[#F59E0B] mt-0.5 truncate',
                      getAmountFontSize(formattedRemaining, 'xl')
                    )}
                    title={formattedRemaining}
                  >
                    {formattedRemaining}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Barra de Progreso */}
          {isGoal && (
            <div className="pt-1">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                <span className="font-semibold text-white">Progreso: {percentage}%</span>
                {saving.target_date && (
                  <span>
                    Fecha límite:{' '}
                    {new Date(saving.target_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <div className="h-2.5 w-full bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </div>
          )}

          {/* Proyección Inteligente del Backend */}
          {projection && projection.monthly_average > 0 && (
            <div className="bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg p-3 text-xs text-white flex items-start gap-2.5">
              <TrendingUp className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#10B981]">
                  Ritmo de ahorro proyectado (últimos 90 días):
                </span>{' '}
                Promedio de <strong>{formatMoney(projection.monthly_average, currency)}/mes</strong>.
                {projection.months_remaining && (
                  <p className="text-muted-foreground mt-0.5">
                    A este ritmo constante, completarás tu meta en aproximadamente{' '}
                    <strong className="text-white">
                      {projection.months_remaining} {projection.months_remaining === 1 ? 'mes' : 'meses'}
                    </strong>{' '}
                    ({projection.projected_date ? new Date(projection.projected_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}).
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs: Historial de Aportes & Evolución Mensual */}
        <Tabs defaultValue="contributions" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 bg-[#121212] border border-[#2E2E2E] p-1">
            <TabsTrigger
              value="contributions"
              className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs gap-1.5"
            >
              <History className="h-3.5 w-3.5" />
              <span>Historial ({contributions.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-xs gap-1.5"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Evolución Anual</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Historial de Aportes */}
          <TabsContent value="contributions" className="mt-3">
            {isLoadingContributions ? (
              <div className="space-y-2 py-4">
                <Skeleton className="h-10 w-full bg-[#2E2E2E]" />
                <Skeleton className="h-10 w-full bg-[#2E2E2E]" />
                <Skeleton className="h-10 w-full bg-[#2E2E2E]" />
              </div>
            ) : contributions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#2E2E2E] rounded-xl">
                <PiggyBank className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium text-white">Sin aportes registrados</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Haz clic en "+ Aporte" para agregar tu primer depósito a este fondo.
                </p>
              </div>
            ) : (
              <div className="border border-[#2E2E2E] rounded-lg overflow-hidden bg-[#121212]">
                <Table>
                  <TableHeader className="bg-[#18181B]">
                    <TableRow className="border-b border-[#2E2E2E]">
                      <TableHead className="text-xs text-muted-foreground">Fecha</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Concepto / Nota</TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">Monto</TableHead>
                      <TableHead className="text-xs text-muted-foreground w-12 text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((c) => (
                      <TableRow
                        key={c.id}
                        className="border-b border-[#2E2E2E]/60 hover:bg-[#1E1E1E]"
                      >
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(c.contribution_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-xs text-white max-w-[200px] truncate">
                          {c.note || <span className="text-muted-foreground italic">Aporte regular</span>}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#10B981] text-right whitespace-nowrap">
                          +{formatMoney(c.amount, currency)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleteContributionMutation.isPending}
                            onClick={() => handleDeleteContribution(c.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                            title="Eliminar aporte"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Evolución Mensual / Gráfico */}
          <TabsContent value="analytics" className="mt-3">
            <div className="bg-[#121212] border border-[#2E2E2E] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-white">
                    Aportes por Mes ({selectedYear})
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Total aportado en {selectedYear}:{' '}
                    <strong className="text-[#10B981]">
                      {formatMoney(totalYearContributed, currency)}
                    </strong>
                  </p>
                </div>

                <Select
                  value={String(selectedYear)}
                  onValueChange={(val) => {
                    if (val) setSelectedYear(parseInt(val));
                  }}
                >
                  <SelectTrigger className="w-28 h-8 text-xs bg-[#1E1E1E] border-[#2E2E2E] text-white">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                    {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoadingMonthly ? (
                <div className="h-48 flex items-center justify-center">
                  <Skeleton className="h-40 w-full bg-[#2E2E2E]" />
                </div>
              ) : (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#A1A1AA"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#A1A1AA"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          borderColor: '#2E2E2E',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                        }}
                        formatter={(value: any) => [
                          formatMoney(value, currency),
                          'Aportado',
                        ]}
                      />
                      <Bar
                        dataKey="total"
                        fill={accentColor}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
