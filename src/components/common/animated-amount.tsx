'use client';

import React, { useEffect, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';

export interface AnimatedAmountProps {
  value: number;
  prefix?: string;
  currency?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  showSign?: boolean;
  locales?: string;
  animateOnMount?: boolean;
  sizeVariant?: string;
}

/**
 * Componente financiero fintech para animar cifras monetarias con odómetro suave (NumberFlow).
 * Anima tanto en la carga inicial como en actualizaciones reactivas de estado.
 */
export function AnimatedAmount({
  value = 0,
  prefix,
  currency,
  suffix = '',
  className,
  decimals = 2,
  showSign = false,
  locales = 'en-US',
  animateOnMount = true,
}: AnimatedAmountProps) {
  const [displayValue, setDisplayValue] = useState<number>(() =>
    animateOnMount ? 0 : (Number.isFinite(value) ? value : 0)
  );

  useEffect(() => {
    const validValue = Number.isFinite(value) ? value : 0;
    const timer = setTimeout(() => {
      setDisplayValue(validValue);
    }, 40);
    return () => clearTimeout(timer);
  }, [value]);

  const defaultPrefix = currency === 'EUR' ? '€' : '$';
  const resolvedPrefix = prefix !== undefined ? prefix : defaultPrefix;

  const isPositive = value > 0;
  const signPrefix = showSign && isPositive ? '+' : '';
  const formattedPrefix = `${signPrefix}${resolvedPrefix}`;

  return (
    <NumberFlow
      value={displayValue}
      prefix={formattedPrefix}
      suffix={suffix}
      locales={locales}
      format={{
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }}
      className={cn('tabular-nums font-semibold transition-colors duration-200', className)}
    />
  );
}
