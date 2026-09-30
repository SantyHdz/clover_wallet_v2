'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DebtStatus, LoanStatus } from '@/types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  AlertOctagon,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebtStatusBadgeProps {
  status: DebtStatus;
  className?: string;
}

export function DebtStatusBadge({ status, className }: DebtStatusBadgeProps) {
  switch (status) {
    case 'paid':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1.5 font-medium',
            className
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Saldada</span>
        </Badge>
      );
    case 'partial':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-blue-500/30 bg-blue-500/10 text-blue-400 gap-1.5 font-medium',
            className
          )}
        >
          <Percent className="h-3.5 w-3.5 text-blue-400" />
          <span>Abono Parcial</span>
        </Badge>
      );
    case 'overdue':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-rose-500/30 bg-rose-500/10 text-rose-400 gap-1.5 font-medium animate-pulse',
            className
          )}
        >
          <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
          <span>Vencida</span>
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-amber-500/30 bg-amber-500/10 text-amber-400 gap-1.5 font-medium',
            className
          )}
        >
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span>Pendiente</span>
        </Badge>
      );
  }
}

interface LoanStatusBadgeProps {
  status: LoanStatus;
  className?: string;
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
  switch (status) {
    case 'recovered':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1.5 font-medium',
            className
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Recuperado</span>
        </Badge>
      );
    case 'partial':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-teal-500/30 bg-teal-500/10 text-teal-400 gap-1.5 font-medium',
            className
          )}
        >
          <Percent className="h-3.5 w-3.5 text-teal-400" />
          <span>Cobro Parcial</span>
        </Badge>
      );
    case 'overdue':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-rose-500/30 bg-rose-500/10 text-rose-400 gap-1.5 font-medium animate-pulse',
            className
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          <span>Vencido</span>
        </Badge>
      );
    case 'defaulted':
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-purple-500/30 bg-purple-500/10 text-purple-400 gap-1.5 font-medium',
            className
          )}
        >
          <Flame className="h-3.5 w-3.5 text-purple-400" />
          <span>Incobrable</span>
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            'border-sky-500/30 bg-sky-500/10 text-sky-400 gap-1.5 font-medium',
            className
          )}
        >
          <Clock className="h-3.5 w-3.5 text-sky-400" />
          <span>Pendiente</span>
        </Badge>
      );
  }
}
