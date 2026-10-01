'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { CloverTourController } from '@/lib/onboarding-tour';
import { WelcomeOnboardingDialog } from '@/components/onboarding/welcome-onboarding-dialog';
import { useAuth } from '@/contexts/auth-context';
import { useUserProfile, useUpdateProfile } from '@/hooks/use-users';

interface OnboardingContextType {
  startTour: (startIndex?: number) => void;
  isTourCompleted: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const hasTriggeredWelcome = useRef(false);

  const currentUser = userProfile || authUser;

  // Si has_completed_onboarding es false (o null/undefined), significa que aún debe realizar el tour
  const isTourCompleted = currentUser?.has_completed_onboarding === true;

  const markTourCompletedInDB = () => {
    if (!currentUser?.has_completed_onboarding) {
      updateProfileMutation.mutate(
        { has_completed_onboarding: true },
        {
          onSuccess: () => {
            toast.success('¡Bienvenido a Clover Wallet!');
          },
        }
      );
    }
  };

  // Initialize tour controller
  const tourController = useMemo(() => {
    return new CloverTourController(router, () => {
      markTourCompletedInDB();
    });
  }, [router, currentUser?.has_completed_onboarding]);

  useEffect(() => {
    const isLoading = isAuthLoading || isProfileLoading;
    if (!isLoading && isAuthenticated && currentUser) {
      // Si el usuario aún no ha completado el onboarding y está en la vista /dashboard
      if (currentUser.has_completed_onboarding === false && !hasTriggeredWelcome.current) {
        if (pathname === '/dashboard') {
          hasTriggeredWelcome.current = true;
          const timer = setTimeout(() => {
            setWelcomeDialogOpen(true);
          }, 600);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isAuthLoading, isProfileLoading, isAuthenticated, currentUser, pathname]);

  const startTour = (startIndex = 0) => {
    setWelcomeDialogOpen(false);
    tourController.startTour(startIndex);
  };

  const handleSkipTour = () => {
    setWelcomeDialogOpen(false);
    markTourCompletedInDB();
  };

  return (
    <OnboardingContext.Provider value={{ startTour, isTourCompleted }}>
      {children}
      <WelcomeOnboardingDialog
        open={welcomeDialogOpen}
        onOpenChange={setWelcomeDialogOpen}
        onStartTour={() => startTour(0)}
        onSkipTour={handleSkipTour}
      />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding debe ser utilizado dentro de un OnboardingProvider');
  }
  return context;
}
