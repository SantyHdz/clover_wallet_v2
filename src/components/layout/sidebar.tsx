'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  HandCoins,
  PiggyBank,
  Tags,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/auth-context';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Transacciones',
    href: '/dashboard/transactions',
    icon: ArrowLeftRight,
  },
  {
    title: 'Deudas y Préstamos',
    href: '/dashboard/debts-loans',
    icon: HandCoins,
  },
  {
    title: 'Ahorros & Metas',
    href: '/dashboard/savings',
    icon: PiggyBank,
  },
  {
    title: 'Categorías',
    href: '/dashboard/categories',
    icon: Tags,
  },
  {
    title: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Ajustes',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-[#2E2E2E] bg-[#1E1E1E] transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER: BRAND & COLLAPSE TOGGLE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#2E2E2E]">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 transition-opacity hover:opacity-90 overflow-hidden',
            isCollapsed && 'justify-center w-full'
          )}
        >
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              width={36}
              height={36}
              className="rounded-full ring-2 ring-[#10B981]/30 object-cover"
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-white truncate">
                Clover<span className="text-[#10B981]">Wallet</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase truncate">
                Finanzas Claras
              </span>
            </div>
          )}
        </Link>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#27272A] shrink-0"
            title="Colapsar menú"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Collapse button when sidebar is collapsed */}
      {isCollapsed && (
        <div className="flex justify-center pt-2 pb-1 border-b border-[#2E2E2E]/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-[#27272A]"
            title="Expandir menú"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION MENU ITEMS
      ───────────────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const active = isLinkActive(item.href);
          const Icon = item.icon;

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-11 w-full items-center justify-center rounded-xl transition-all',
                        active
                          ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/25 font-semibold'
                          : 'text-muted-foreground hover:bg-[#27272A] hover:text-white'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  }
                />
                <TooltipContent side="right" className="bg-[#27272A] text-white border-[#2E2E2E]">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/25 font-semibold'
                  : 'text-muted-foreground hover:bg-[#27272A] hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                  active ? 'text-white' : 'text-muted-foreground group-hover:text-white'
                )}
              />
              <span className="truncate">{item.title}</span>
              {active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          3. USER PROFILE FOOTER CARD & LOGOUT
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-[#2E2E2E] bg-[#1A1A1A]/80">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link href="/dashboard/settings">
                    <Avatar className="h-9 w-9 border border-[#2E2E2E] cursor-pointer hover:ring-2 hover:ring-[#10B981]/50 transition-all">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'Usuario'} />
                      <AvatarFallback className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                        {getInitials(user?.full_name || user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                }
              />
              <TooltipContent side="right" className="bg-[#27272A] text-white border-[#2E2E2E]">
                <div className="font-semibold">{user?.full_name || 'Usuario'}</div>
                <div className="text-[10px] text-muted-foreground">{user?.email}</div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                }
              />
              <TooltipContent side="right" className="bg-[#27272A] text-white border-[#2E2E2E]">
                Cerrar sesión
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] p-2.5">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity"
            >
              <Avatar className="h-9 w-9 border border-[#2E2E2E] shrink-0">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'Usuario'} />
                <AvatarFallback className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                  {getInitials(user?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.full_name || 'Usuario'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email || (user?.currency ? `Moneda: ${user.currency}` : 'Cuenta activa')}
                </span>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="h-8 w-8 text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
