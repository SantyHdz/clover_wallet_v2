'use client';

import React from 'react';
import {
  Lock,
  Trash2,
  TrendingDown,
  TrendingUp,
  ArrowLeftRight,
  User,
} from 'lucide-react';
import { Category } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '@/lib/category-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CategoryCardProps {
  category: Category;
  onDeleteRequest: (category: Category) => void;
}

export function CategoryCard({ category, onDeleteRequest }: CategoryCardProps) {
  const isGlobal = category.is_global;
  const color = category.color || '#10B981';

  const getTypeBadge = () => {
    switch (category.type) {
      case 'income':
        return (
          <Badge
            variant="outline"
            className="border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-medium gap-1 py-0.5"
          >
            <TrendingUp className="h-3 w-3" />
            <span>Ingreso</span>
          </Badge>
        );
      case 'expense':
        return (
          <Badge
            variant="outline"
            className="border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-medium gap-1 py-0.5"
          >
            <TrendingDown className="h-3 w-3" />
            <span>Gasto</span>
          </Badge>
        );
      case 'both':
      default:
        return (
          <Badge
            variant="outline"
            className="border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-medium gap-1 py-0.5"
          >
            <ArrowLeftRight className="h-3 w-3" />
            <span>Mixta</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-4 shadow-sm hover:border-[#2E2E2E]/80 hover:shadow-md transition-all group flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${color}18`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            <CategoryIcon iconName={category.icon} className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#10B981] transition-colors">
              {category.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              {getTypeBadge()}

              {isGlobal ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Badge
                        variant="outline"
                        className="border-[#2E2E2E] bg-[#121212] text-[10px] text-muted-foreground gap-1 py-0.5 cursor-default"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        <span>Global</span>
                      </Badge>
                    }
                  />
                  <TooltipContent side="top" className="bg-[#27272A] text-white border-[#2E2E2E] text-xs">
                    Categoría predeterminada del sistema
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Badge
                  variant="outline"
                  className="border-[#10B981]/30 bg-[#10B981]/10 text-[10px] text-[#10B981] gap-1 py-0.5"
                >
                  <User className="h-2.5 w-2.5" />
                  <span>Personalizada</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right: Delete Action (only for non-global categories) */}
        {!isGlobal && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRequest(category)}
                  className="h-8 w-8 text-muted-foreground hover:bg-[#EF4444]/15 hover:text-[#EF4444] rounded-lg cursor-pointer shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top" className="bg-[#27272A] text-white border-[#2E2E2E] text-xs">
              Eliminar categoría
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Card>
  );
}
