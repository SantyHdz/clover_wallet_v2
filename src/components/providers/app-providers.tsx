'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { OnboardingProvider } from '@/contexts/onboarding-context';

export { useAuth, AuthProvider };

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
      <AuthProvider>
        <OnboardingProvider>
          <TooltipProvider delay={200}>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              duration={3500}
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1E1E1E',
                  border: '1px solid #2E2E2E',
                  color: '#F3F3F3',
                },
              }}
            />
          </TooltipProvider>
        </OnboardingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
