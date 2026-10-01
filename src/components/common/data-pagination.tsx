'use client';

import React from 'react';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
}

export function DataPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = 'registros',
  className,
}: DataPaginationProps) {
  if (totalItems === 0) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3',
        className
      )}
    >
      {/* 1. Contador y Selector de Densidad */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
        <span>
          Mostrando{' '}
          <strong className="text-white font-semibold">
            {startIndex} - {endIndex}
          </strong>{' '}
          de <strong className="text-white font-semibold">{totalItems}</strong> {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-muted-foreground/80">Mostrar:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-7 w-[68px] text-xs bg-[#1E1E1E] border-[#2E2E2E] text-white focus:ring-1 focus:ring-[#10B981]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white min-w-[70px]">
                {pageSizeOptions.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={String(opt)}
                    className="text-xs hover:bg-[#27272A] focus:bg-[#27272A] cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 2. Controles de Navegación de Páginas */}
      <div className="flex items-center gap-1">
        {/* Botón Primera Página */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Primera página"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-[#27272A] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Botón Página Anterior */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-[#27272A] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Números de Página */}
        <div className="flex items-center gap-1 mx-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-7 w-5 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant={isActive ? 'outline' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'h-7 w-7 rounded-lg text-xs font-medium cursor-pointer transition-colors',
                  isActive
                    ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981] font-bold hover:bg-[#10B981]/25 hover:text-[#10B981]'
                    : 'text-muted-foreground hover:bg-[#27272A] hover:text-white'
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Botón Página Siguiente */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-[#27272A] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {/* Botón Última Página */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Última página"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-[#27272A] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
