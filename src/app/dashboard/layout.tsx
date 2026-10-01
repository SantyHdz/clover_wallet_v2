'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { MobileDrawer } from '@/components/layout/mobile-drawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [showSlowLoadingMessage, setShowSlowLoadingMessage] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowSlowLoadingMessage(true);
      }, 2500);
    } else {
      setShowSlowLoadingMessage(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Auth Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16 animate-bounce">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              fill
              className="rounded-full ring-4 ring-[#10B981]/30 shadow-xl shadow-[#10B981]/20 object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
              <span>Cargando Clover Wallet...</span>
            </div>
            {showSlowLoadingMessage && (
              <p className="text-xs text-muted-foreground/80 animate-in fade-in duration-300">
                Conectando con el servidor... puede tardar unos segundos
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated fallback while router pushes to /login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-[#F3F3F3]">
      {/* 1. Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Mobile Drawer (Sheet) */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
      />

      {/* 3. Main Content Container */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* 4. Mobile Bottom Navigation Bar */}
        <BottomNav onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
      </div>
    </div>
  );
}
