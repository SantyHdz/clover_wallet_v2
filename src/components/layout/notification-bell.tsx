'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  Receipt,
  PiggyBank,
  CreditCard,
  Coins,
  Tags,
  User,
  Info,
  ArrowRight,
  X,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotifications } from '@/contexts/notifications-context';
import { NotificationCategory, NotificationItem } from '@/types/notifications';
import { cn } from '@/lib/utils';

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Hace un momento';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays}d`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  } catch {
    return 'Reciente';
  }
}

function getCategoryIcon(type: NotificationCategory) {
  switch (type) {
    case 'transaction':
      return <Receipt className="h-4 w-4 text-[#10B981]" />;
    case 'saving':
      return <PiggyBank className="h-4 w-4 text-[#34D399]" />;
    case 'debt':
      return <CreditCard className="h-4 w-4 text-[#F97316]" />;
    case 'loan':
      return <Coins className="h-4 w-4 text-[#3B82F6]" />;
    case 'category':
      return <Tags className="h-4 w-4 text-[#A855F7]" />;
    case 'profile':
      return <User className="h-4 w-4 text-[#06B6D4]" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    soundEnabled,
    toggleSound,
  } = useNotifications();

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.link) {
      setOpen(false);
      router.push(item.link);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-[#1E1E1E] hover:text-white rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#10B981]"
        aria-label="Notificaciones"
      >
        <Bell className={cn('h-4.5 w-4.5', unreadCount > 0 && 'text-[#10B981]')} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#10B981] px-1 text-[10px] font-bold text-[#121212] shadow-sm animate-in zoom-in duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[390px] p-0 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] text-white shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2E2E2E] px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Notificaciones</h4>
            {unreadCount > 0 && (
              <Badge
                variant="outline"
                className="border-[#10B981]/30 bg-[#10B981]/15 text-[#10B981] text-[10px] px-1.5 py-0 font-semibold"
              >
                {unreadCount} nuevas
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                onClick={toggleSound}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-white hover:bg-[#27272A] cursor-pointer transition-colors',
                  !soundEnabled && 'text-muted-foreground/40'
                )}
                aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
              </TooltipContent>
            </Tooltip>

            {unreadCount > 0 && (
              <Tooltip>
                <TooltipTrigger
                  onClick={markAllAsRead}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-white hover:bg-[#27272A] cursor-pointer transition-colors"
                  aria-label="Marcar todas como leídas"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-[#10B981]" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Marcar todas como leídas
                </TooltipContent>
              </Tooltip>
            )}

            {notifications.length > 0 && (
              <Tooltip>
                <TooltipTrigger
                  onClick={clearAll}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/15 cursor-pointer transition-colors"
                  aria-label="Limpiar todo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Limpiar historial
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'all' | 'unread')} className="w-full">
          <div className="px-4 pt-2.5 pb-1 border-b border-[#2E2E2E]/60 bg-[#171717]">
            <TabsList className="grid grid-cols-2 h-8 w-full bg-[#1E1E1E] p-0.5 border border-[#2E2E2E] rounded-lg">
              <TabsTrigger
                value="all"
                className="text-xs rounded-md data-[state=active]:bg-[#27272A] data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground"
              >
                Todas ({notifications.length})
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-xs rounded-md data-[state=active]:bg-[#27272A] data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground"
              >
                No leídas ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0 focus-visible:outline-none">
            <NotificationList
              items={filteredNotifications}
              onItemClick={handleItemClick}
              onDeleteItem={deleteNotification}
            />
          </TabsContent>

          <TabsContent value="unread" className="m-0 focus-visible:outline-none">
            <NotificationList
              items={filteredNotifications}
              onItemClick={handleItemClick}
              onDeleteItem={deleteNotification}
              emptyMessage="No tienes notificaciones pendientes por leer"
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-[#2E2E2E] bg-[#121212]/60 px-4 py-2 text-center">
            <p className="text-[11px] text-muted-foreground">
              Historial de movimientos y alertas de Clover Wallet
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface NotificationListProps {
  items: NotificationItem[];
  onItemClick: (item: NotificationItem) => void;
  onDeleteItem: (id: string) => void;
  emptyMessage?: string;
}

function NotificationList({
  items,
  onItemClick,
  onDeleteItem,
  emptyMessage = 'No tienes notificaciones por el momento',
}: NotificationListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#27272A] text-muted-foreground mb-3 border border-[#2E2E2E]">
          <Bell className="h-6 w-6 opacity-40" />
        </div>
        <p className="text-xs font-semibold text-white mb-1">{emptyMessage}</p>
        <p className="text-[11px] text-muted-foreground max-w-[220px]">
          Tus registros de ingresos, gastos, deudas y metas aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[360px] overflow-y-auto divide-y divide-[#2E2E2E]/60">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick(item)}
          className={cn(
            'group relative flex items-start gap-3 p-3.5 transition-all cursor-pointer hover:bg-[#27272A]/70',
            !item.read ? 'bg-[#10B981]/5 hover:bg-[#10B981]/10' : 'bg-transparent'
          )}
        >
          {/* Category Icon Badge */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#27272A] border border-[#2E2E2E] shadow-xs">
            {getCategoryIcon(item.type)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-5">
            <div className="flex items-center gap-1.5 mb-0.5">
              {!item.read && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shrink-0" />
              )}
              <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.message}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-muted-foreground/70 font-medium">
                {formatRelativeTime(item.createdAt)}
              </span>
              {item.link && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-[#10B981] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver detalle</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </span>
              )}
            </div>
          </div>

          {/* Individual Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(item.id);
            }}
            className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground/40 hover:text-[#EF4444] hover:bg-[#EF4444]/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            aria-label="Eliminar notificación"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
