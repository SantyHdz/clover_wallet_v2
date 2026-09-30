'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ChevronRight,
  Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { NAV_ITEMS } from './sidebar';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
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

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[82vw] max-w-xs border-r border-[#2E2E2E] bg-[#1E1E1E] p-0 text-white flex flex-col justify-between h-full"
      >
        <div>
          {/* Brand Header */}
          <SheetHeader className="border-b border-[#2E2E2E] p-4 text-left">
            <SheetTitle className="flex items-center gap-3 text-white">
              <Image
                src="/logo.png"
                alt="Clover Wallet Logo"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-[#10B981]/30"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white">
                  Clover<span className="text-[#10B981]">Wallet</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Navegación
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* User Profile Summary */}
          <div className="p-4 border-b border-[#2E2E2E] bg-[#161616]/60">
            <Link
              href="/dashboard/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 p-2 rounded-xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#10B981]/40 transition-colors"
            >
              <Avatar className="h-10 w-10 border border-[#2E2E2E] shrink-0">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'Usuario'} />
                <AvatarFallback className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                  {getInitials(user?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-white truncate">
                  {user?.full_name || 'Mi Perfil'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email || 'Gestionar cuenta'}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>

            {user?.currency && (
              <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Moneda Principal</span>
                <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] text-[#10B981] text-[11px] gap-1 py-0.5">
                  <Coins className="h-3 w-3" />
                  {user.currency.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-[#10B981] text-white font-semibold shadow-md shadow-[#10B981]/20'
                      : 'text-muted-foreground hover:bg-[#27272A] hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-muted-foreground')} />
                    <span>{item.title}</span>
                  </div>
                  {active && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[#2E2E2E] bg-[#161616]">
          <Button
            variant="outline"
            onClick={async () => {
              handleLinkClick();
              await logout();
            }}
            className="w-full border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white justify-center gap-2 h-10 font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
