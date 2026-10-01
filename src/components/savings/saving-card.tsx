'use client';

import React from 'react';
import {
  MoreVertical,
  Plus,
  BarChart2,
  Edit2,
  Trash2,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Calendar,
  Sparkles,
  Target,
  PiggyBank,
  TrendingUp,
  Clock,
  Coins,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryIcon } from '@/lib/category-icons';
import { useAuth } from '@/contexts/auth-context';
import { cn, formatMoney, getAmountFontSize } from '@/lib/utils';
import { Saving, SavingProjection, SavingStatus } from '@/types';

interface SavingCardProps {
  saving: Saving;
  projection?: SavingProjection;
  onAddContribution: (saving: Saving) => void;
  onOpenDetails: (saving: Saving) => void;
  onEdit: (saving: Saving) => void;
  onDelete: (saving: Saving) => void;
  onStatusChange?: (saving: Saving, status: SavingStatus) => void;
}

export function SavingCard({
  saving,
  projection,
  onAddContribution,
  onOpenDetails,
  onEdit,
  onDelete,
  onStatusChange,
}: SavingCardProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const currentAmount = Number(saving.current_amount || 0);
  const targetAmount = saving.target_amount ? Number(saving.target_amount) : null;
  const isGoal = saving.type === 'goal' && targetAmount !== null && targetAmount > 0;
  
  const percentage = isGoal
    ? Math.min(100, Math.round((currentAmount / targetAmount!) * 100))
    : 100;
  
  const remaining = isGoal ? Math.max(0, targetAmount! - currentAmount) : 0;
  const isCompleted = saving.status === 'completed' || (isGoal && currentAmount >= targetAmount!);
  const isPaused = saving.status === 'paused';

  // Formatted amounts
  const formattedCurrent = formatMoney(currentAmount, currency);
  const formattedTarget = targetAmount ? formatMoney(targetAmount, currency) : null;
  const formattedRemaining = formatMoney(remaining, currency);

  // Status Badge
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge
          variant="outline"
          className="border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-medium gap-1 py-0.5"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Completada</span>
        </Badge>
      );
    }
    if (isPaused) {
      return (
        <Badge
          variant="outline"
          className="border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-medium gap-1 py-0.5"
        >
          <PauseCircle className="h-3 w-3" />
          <span>En pausa</span>
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[10px] font-medium gap-1 py-0.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
        <span>Activa</span>
      </Badge>
    );
  };

  // Date formatting & days left calculation
  const getDaysLeftText = () => {
    if (!saving.target_date) return null;
    const target = new Date(saving.target_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-[#EF4444] font-medium">Plazo vencido</span>;
    }
    if (diffDays === 0) {
      return <span className="text-[#F59E0B] font-medium">Vence hoy</span>;
    }
    if (diffDays === 1) {
      return <span className="text-[#F59E0B]">Queda 1 día</span>;
    }
    if (diffDays <= 30) {
      return <span className="text-[#F59E0B]">Quedan {diffDays} días</span>;
    }
    const months = Math.floor(diffDays / 30);
    return <span>Quedan ~{months} {months === 1 ? 'mes' : 'meses'}</span>;
  };

  const accentColor = saving.color || '#10B981';

  return (
    <Card className="border-[#2E2E2E] bg-[#1E1E1E] overflow-hidden flex flex-col justify-between hover:border-[#3E3E3E] transition-all duration-200 group">
      {/* Top Color Accent Line */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: accentColor }}
      />

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Header: Icon, Name, Badges, Dropdown */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                <CategoryIcon
                  iconName={saving.icon || 'piggybank'}
                  className="h-5 w-5"
                  style={{ color: accentColor }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white text-base leading-tight truncate">
                  {saving.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant="outline"
                    className="border-[#2E2E2E] bg-[#27272A] text-muted-foreground text-[10px] px-1.5 py-0"
                  >
                    {isGoal ? 'Meta' : 'Alcancía Libre'}
                  </Badge>
                  {getStatusBadge()}
                </div>
              </div>
            </div>

            {/* Menu Contextual */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-[#27272A] hover:text-white flex items-center justify-center outline-none shrink-0"
                aria-label="Opciones de ahorro"
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#1E1E1E] border-[#2E2E2E] text-white"
              >
                <DropdownMenuItem
                  onClick={() => onAddContribution(saving)}
                  className="gap-2 cursor-pointer text-[#10B981] hover:text-[#10B981] focus:text-[#10B981] focus:bg-[#10B981]/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Aportar dinero</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpenDetails(saving)}
                  className="gap-2 cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A]"
                >
                  <BarChart2 className="h-4 w-4 text-[#3B82F6]" />
                  <span>Ver Historial & Gráfica</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(saving)}
                  className="gap-2 cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A]"
                >
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                  <span>Editar Meta</span>
                </DropdownMenuItem>

                {onStatusChange && (
                  <>
                    <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                    {saving.status === 'active' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(saving, 'completed')}
                          className="gap-2 cursor-pointer text-[#22C55E] hover:bg-[#22C55E]/10 focus:bg-[#22C55E]/10"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Marcar completada</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(saving, 'paused')}
                          className="gap-2 cursor-pointer text-[#F59E0B] hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
                        >
                          <PauseCircle className="h-4 w-4" />
                          <span>Pausar meta</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    {saving.status === 'paused' && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(saving, 'active')}
                        className="gap-2 cursor-pointer text-[#10B981] hover:bg-[#10B981]/10 focus:bg-[#10B981]/10"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Reanudar meta</span>
                      </DropdownMenuItem>
                    )}
                    {saving.status === 'completed' && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(saving, 'active')}
                        className="gap-2 cursor-pointer text-[#3B82F6] hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Reabrir meta</span>
                      </DropdownMenuItem>
                    )}
                  </>
                )}

                <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                <DropdownMenuItem
                  onClick={() => onDelete(saving)}
                  className="gap-2 cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10 focus:bg-[#EF4444]/10 focus:text-[#EF4444]"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {saving.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {saving.description}
            </p>
          )}

          {/* Montos Principales */}
          <div className="bg-[#121212]/50 border border-[#2E2E2E]/60 rounded-lg p-3 mb-3">
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-[11px] text-muted-foreground font-medium">
                {isGoal ? 'Ahorrado' : 'Total en Alcancía'}
              </span>
              {isGoal && formattedTarget && (
                <span className="text-[11px] text-muted-foreground">
                  Meta: <strong className="text-white font-semibold">{formattedTarget}</strong>
                </span>
              )}
            </div>
            <div
              className={cn(
                'font-bold text-white mt-0.5 tracking-tight',
                getAmountFontSize(formattedCurrent, '2xl')
              )}
              title={formattedCurrent}
            >
              {formattedCurrent}
            </div>

            {/* Barra de Progreso si es Objetivo */}
            {isGoal && (
              <div className="mt-2.5">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                  <span className="font-semibold text-white">{percentage}% alcanzado</span>
                  <span>Faltan {formattedRemaining}</span>
                </div>
                <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
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
          </div>

          {/* Badge de Proyección Inteligente del Backend */}
          {isGoal && !isCompleted && projection && projection.monthly_average > 0 && projection.months_remaining && (
            <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg p-2.5 mb-3 text-xs text-[#10B981] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 shrink-0 text-[#10B981]" />
              <div className="min-w-0">
                <p className="text-[11px] leading-tight">
                  A tu ritmo (~{formatMoney(projection.monthly_average, currency)}/mes), llegarás en{' '}
                  <strong className="font-semibold text-white">
                    {projection.months_remaining} {projection.months_remaining === 1 ? 'mes' : 'meses'}
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Fecha Límite */}
          {saving.target_date && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Fecha límite: {new Date(saving.target_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </span>
              <span>{getDaysLeftText()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-2 border-t border-[#2E2E2E]/60 flex items-center gap-2">
          <Button
            onClick={() => onAddContribution(saving)}
            size="sm"
            className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs h-8 gap-1 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Aportar</span>
          </Button>
          <Button
            onClick={() => onOpenDetails(saving)}
            variant="outline"
            size="sm"
            className="border-[#2E2E2E] bg-[#27272A] hover:bg-[#323236] text-white font-medium text-xs h-8 px-2.5 gap-1"
          >
            <BarChart2 className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className="hidden sm:inline">Detalles</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
