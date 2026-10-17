'use client';

import { useEffect, useRef, useState } from 'react';
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
  /** Entrada desde 0 al montar. Úsalo solo en cifras protagonistas (KPIs principales). */
  animateOnMount?: boolean;
  sizeVariant?: string;
}

// Rápido y suave: el valor nuevo se percibe casi al instante.
const TRANSFORM_TIMING = { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
const SPIN_TIMING = { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
const OPACITY_TIMING = { duration: 250, easing: 'ease-out' };

/**
 * Cifra monetaria con odómetro (NumberFlow).
 * - Al montar muestra el valor final sin animar (no hay giro desde 0 en cada navegación).
 * - Anima solo cuando `value` cambia (nueva transacción, abono, refetch).
 * - Respeta `prefers-reduced-motion` (comportamiento por defecto de NumberFlow).
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
  animateOnMount = false,
}: AnimatedAmountProps) {
  const target = Number.isFinite(value) ? value : 0;

  // Con animateOnMount se renderiza 0 en el primer frame y se pasa al valor real una sola vez.
  const [entered, setEntered] = useState(!animateOnMount);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!animateOnMount) return;
    frame.current = requestAnimationFrame(() => setEntered(true));
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [animateOnMount]);

  const defaultPrefix = currency === 'EUR' ? '€' : '$';
  const resolvedPrefix = prefix !== undefined ? prefix : defaultPrefix;
  const signPrefix = showSign && target > 0 ? '+' : '';

  return (
    <NumberFlow
      value={entered ? target : 0}
      prefix={`${signPrefix}${resolvedPrefix}`}
      suffix={suffix}
      locales={locales}
      format={{
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }}
      transformTiming={TRANSFORM_TIMING}
      spinTiming={SPIN_TIMING}
      opacityTiming={OPACITY_TIMING}
      willChange
      className={cn('tabular-nums font-semibold', className)}
    />
  );
}
