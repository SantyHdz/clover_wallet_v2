'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  PiggyBank,
  Target,
  CheckCircle2,
  Clock,
  Trophy,
  Percent,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn, formatMoney, getAmountFontSize } from '@/lib/utils';
import { SavingSummary } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SavingSummaryCardsProps {
  summary?: SavingSummary;
  isLoading?: boolean;
}

export function SavingSummaryCards({ summary, isLoading }: SavingSummaryCardsProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5">
            <CardContent className="p-0">
              <Skeleton className="h-3.5 w-24 bg-[#2E2E2E] mb-2" />
              <Skeleton className="h-7 w-32 bg-[#2E2E2E]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalSaved = Number(summary?.total_saved || 0);
  const totalGoal = Number(summary?.total_goal || 0);
  const activeCount = summary?.active_count || 0;
  const completedCount = summary?.completed_count || 0;
  const totalCount = summary?.savings_count || 0;

  const globalPercentage =
    totalGoal > 0 ? Math.min(100, Math.round((totalSaved / totalGoal) * 100)) : 0;

  const formattedSaved = formatMoney(totalSaved, currency);
  const formattedGoal = formatMoney(totalGoal, currency);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Ahorrado */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#3E3E3E] transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              Total Ahorrado
            </span>
            <div
              className={cn(
                'font-bold text-[#10B981] mt-0.5 truncate',
                getAmountFontSize(formattedSaved, 'xl')
              )}
              title={formattedSaved}
            >
              {formattedSaved}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              En {totalCount} {totalCount === 1 ? 'fondo' : 'fondos'} totales
            </p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
            <PiggyBank className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Meta Global Activa */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#3E3E3E] transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium">
                Meta Global
              </span>
              {totalGoal > 0 && (
                <span className="text-[10px] font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-1 py-0.2 rounded">
                  {globalPercentage}%
                </span>
              )}
            </div>
            <div
              className={cn(
                'font-bold text-white mt-0.5 truncate',
                getAmountFontSize(formattedGoal, 'xl')
              )}
              title={formattedGoal}
            >
              {formattedGoal}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              En metas activas
            </p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center shrink-0">
            <Target className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Metas Activas */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#3E3E3E] transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              Metas Activas
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#F59E0B] mt-0.5">
              {activeCount}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              En progreso continuo
            </p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Metas Cumplidas */}
      <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-3.5 shadow-sm hover:border-[#3E3E3E] transition-colors">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              Completadas
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#22C55E] mt-0.5">
              {completedCount}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {totalCount > 0
                ? `${Math.round((completedCount / totalCount) * 100)}% de éxito`
                : '0 logradas'}
            </p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
            <Trophy className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
