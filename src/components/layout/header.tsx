'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  LogOut,
  User as UserIcon,
  Tags,
  Coins,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/auth-context';
import { SearchCommandDialog } from '@/components/layout/search-command-dialog';

interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transacciones',
  'debts-loans': 'Deudas y Préstamos',
  categories: 'Categorías',
  reports: 'Reportes',
  settings: 'Ajustes',
};

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Build breadcrumbs dynamically from current pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1];
  const currentTitle = ROUTE_LABELS[currentSegment] || 'Dashboard';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#2E2E2E] bg-[#121212]/90 px-3 sm:px-6 backdrop-blur-md">
        {/* ─────────────────────────────────────────────────────────────
            1. LEFT: MOBILE MENU & BREADCRUMBS (DESKTOP)
        ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileDrawer}
            className="md:hidden h-9 w-9 text-muted-foreground hover:bg-[#1E1E1E] hover:text-white shrink-0"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Brand */}
          <Link href="/dashboard" className="flex md:hidden items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Clover Logo"
              width={28}
              height={28}
              className="rounded-full ring-1 ring-[#10B981]/40"
            />
            <span className="text-sm font-bold text-white">
              Clover<span className="text-[#10B981]">Wallet</span>
            </span>
          </Link>

          {/* Desktop Breadcrumbs with Shadcn */}
          <div className="hidden md:flex items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Inicio</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length > 1 && (
                  <>
                    <BreadcrumbSeparator className="text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs font-semibold text-white">
                        {currentTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. CENTER: SEARCH BUTTON (TRIGGERS COMMAND MODAL)
        ───────────────────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 w-64 lg:w-80 h-9 px-3 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] text-xs text-muted-foreground hover:border-[#10B981]/40 hover:text-white transition-all cursor-pointer shadow-inner"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">Buscar transacciones, deudas...</span>
            <div className="ml-auto pointer-events-none flex items-center gap-1 select-none">
              <kbd className="inline-flex h-5 items-center justify-center rounded-md border border-[#2E2E2E] bg-[#121212] px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-xs">
                Ctrl
              </kbd>
              <span className="text-[10px] text-muted-foreground/60">+</span>
              <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-[#2E2E2E] bg-[#121212] px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-xs">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. RIGHT: SEARCH (MOBILE ICON), CURRENCY & USER DROPDOWN
        ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Currency Badge */}
          {user?.currency && (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex border-[#2E2E2E] bg-[#1E1E1E] px-2.5 py-1 text-xs font-medium text-[#10B981] gap-1.5"
            >
              <Coins className="h-3.5 w-3.5" />
              <span>{user.currency.toUpperCase()}</span>
            </Badge>
          )}

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center gap-2.5 rounded-full p-1 hover:bg-[#1E1E1E] transition-colors focus:ring-1 focus:ring-[#10B981] outline-none cursor-pointer">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-[#2E2E2E]">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'Usuario'} />
                <AvatarFallback className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                  {getInitials(user?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block max-w-[130px]">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.full_name || 'Mi Cuenta'}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {user?.email || 'Usuario Activo'}
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-[#2E2E2E] bg-[#1E1E1E] p-1.5 text-white shadow-xl"
            >
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.full_name || 'Usuario'}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {user?.email || 'Usuario Activo'}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-[#2E2E2E] my-1" />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/settings')}
                  className="cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white focus:bg-[#27272A] focus:text-white"
                >
                  <UserIcon className="h-4 w-4 text-[#10B981]" />
                  <span>Mi Perfil & Ajustes</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/categories')}
                  className="cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-[#27272A] hover:text-white focus:bg-[#27272A] focus:text-white"
                >
                  <Tags className="h-4 w-4 text-[#3B82F6]" />
                  <span>Gestor de Categorías</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-[#2E2E2E] my-1" />

              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-xs text-[#EF4444] hover:bg-[#EF4444]/15 hover:text-[#EF4444] focus:bg-[#EF4444]/15 focus:text-[#EF4444]"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Quick Command Search Modal */}
      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
