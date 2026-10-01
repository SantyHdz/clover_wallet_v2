'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  ArrowLeftRight,
  HandCoins,
  Tags,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Navegación' | 'Acciones';
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard General',
    description: 'Vista principal con métricas y estado global',
    href: '/dashboard',
    icon: LayoutDashboard,
    category: 'Navegación',
  },
  {
    id: 'transactions',
    title: 'Transacciones',
    description: 'Historial de ingresos y gastos con filtros',
    href: '/dashboard/transactions',
    icon: ArrowLeftRight,
    category: 'Navegación',
  },
  {
    id: 'debts-loans',
    title: 'Deudas y Préstamos',
    description: 'Gestión de acreedores, deudores y amortizaciones',
    href: '/dashboard/debts-loans',
    icon: HandCoins,
    category: 'Navegación',
  },
  {
    id: 'categories',
    title: 'Categorías',
    description: 'Administrador de etiquetas de colores e íconos',
    href: '/dashboard/categories',
    icon: Tags,
    category: 'Navegación',
  },
  {
    id: 'reports',
    title: 'Reportes y Analíticas',
    description: 'Gráficos comparativos y balance mensual',
    href: '/dashboard/reports',
    icon: BarChart3,
    category: 'Navegación',
  },
  {
    id: 'settings',
    title: 'Ajustes del Perfil',
    description: 'Nombre, moneda de preferencia y cuenta',
    href: '/dashboard/settings',
    icon: Settings,
    category: 'Navegación',
  },
  {
    id: 'new-transaction',
    title: 'Nueva Transacción',
    description: 'Registrar un ingreso o gasto rápidamente',
    href: '/dashboard/transactions',
    icon: Plus,
    category: 'Acciones',
  },
];

export function SearchCommandDialog({
  open,
  onOpenChange,
}: SearchCommandDialogProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setQuery('');
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-[#2E2E2E] bg-[#1E1E1E] p-0 text-white shadow-2xl overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-[#2E2E2E]">
          <DialogTitle className="text-sm font-semibold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#10B981]" />
              Búsqueda Rápida
            </span>
            <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] text-[10px] text-muted-foreground font-mono">
              ESC para salir
            </Badge>
          </DialogTitle>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar vistas, transacciones o ajustes..."
              className="h-10 w-full rounded-xl border-[#2E2E2E] bg-[#121212] pl-9 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#10B981]"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No se encontraron resultados para "{query}"
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#27272A] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#121212] border border-[#2E2E2E] text-muted-foreground group-hover:text-[#10B981] group-hover:border-[#10B981]/40 transition-colors shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-[#10B981] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] text-[9px] text-muted-foreground">
                      {item.category}
                    </Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
