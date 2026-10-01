'use client';

import * as React from 'react';
import CurrencyInputField, { CurrencyInputProps } from 'react-currency-input-field';
import { cn } from '@/lib/utils';

export interface CustomCurrencyInputProps extends Omit<CurrencyInputProps, 'prefix'> {
  prefix?: string;
  error?: boolean;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CustomCurrencyInputProps>(
  (
    {
      className,
      prefix = '$ ',
      decimalsLimit = 2,
      decimalSeparator = '.',
      groupSeparator = ',',
      allowNegativeValue = false,
      error = false,
      ...props
    },
    ref
  ) => {
    return (
      <CurrencyInputField
        ref={ref}
        prefix={prefix}
        decimalsLimit={decimalsLimit}
        decimalSeparator={decimalSeparator}
        groupSeparator={groupSeparator}
        allowNegativeValue={allowNegativeValue}
        className={cn(
          'flex h-9 w-full min-w-0 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] px-3 py-1.5 text-sm text-white placeholder:text-muted-foreground/40 transition-all outline-none focus-visible:border-[#10B981] focus-visible:ring-1 focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[#EF4444]',
          className
        )}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
