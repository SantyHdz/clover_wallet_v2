'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { OnboardingProvider } from '@/contexts/onboarding-context';
import { NotificationsProvider, useNotifications } from '@/contexts/notifications-context';
import { BackendWakeUp } from '@/components/common/backend-wake-up';

export { useAuth, AuthProvider, useNotifications, NotificationsProvider };

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutos de caché por defecto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BackendWakeUp />
      <AuthProvider>
        <NotificationsProvider>
          <OnboardingProvider>
            <TooltipProvider delay={200}>
              {children}
              <Toaster
                position="bottom-right"
                richColors
                duration={3500}
                theme="dark"
              />
            </TooltipProvider>
          </OnboardingProvider>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
