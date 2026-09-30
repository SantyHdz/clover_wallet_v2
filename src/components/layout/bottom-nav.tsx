'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  HandCoins,
  BarChart3,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenMobileDrawer: () => void;
}

export function BottomNav({ onOpenMobileDrawer }: BottomNavProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const navItems = [
    {
      title: 'Inicio',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Movimientos',
      href: '/dashboard/transactions',
      icon: ArrowLeftRight,
    },
    {
      title: 'Deudas',
      href: '/dashboard/debts-loans',
      icon: HandCoins,
    },
    {
      title: 'Reportes',
      href: '/dashboard/reports',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#2E2E2E] bg-[#1E1E1E]/95 px-2 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const active = isLinkActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors',
              active ? 'text-[#10B981] font-semibold' : 'text-muted-foreground hover:text-white'
            )}
          >
            <div className="relative">
              <Icon className={cn('h-5 w-5', active && 'stroke-[2.5px]')} />
              {active && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#10B981]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">{item.title}</span>
          </Link>
        );
      })}

      {/* Button to open mobile drawer */}
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 text-muted-foreground hover:text-white transition-colors cursor-pointer"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] tracking-tight">Menú</span>
      </button>
    </nav>
  );
}
