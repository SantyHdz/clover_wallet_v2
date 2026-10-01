'use client';

import React from 'react';
import Image from 'next/image';
import { Compass, ArrowRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTour: () => void;
  onSkipTour: () => void;
}

export function WelcomeOnboardingDialog({
  open,
  onOpenChange,
  onStartTour,
  onSkipTour,
}: WelcomeOnboardingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md w-[92vw] bg-[#1E1E1E] border-[#2E2E2E] text-white p-6 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Official Clover Mascot Illustration */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 my-1">
            <Image
              src="/images/mascot.png"
              alt="Clover Wallet Mascot"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bienvenido a Clover Wallet
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Plataforma integral para el control de tus finanzas personales, flujos de caja y metas de ahorro.
            </DialogDescription>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-[#121212] border border-[#2E2E2E] rounded-xl p-3.5 w-full text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#10B981]">
              <Compass className="h-4 w-4 shrink-0" />
              <span className="font-semibold text-white">Recorrido Guiado (1 minuto)</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-normal">
              Conoce los módulos clave: balance en tiempo real, registro de transacciones, amortización de deudas, metas con proyección y exportación de reportes.
            </p>
          </div>

          <DialogFooter className="w-full flex flex-col sm:flex-col gap-2 pt-2 sm:space-x-0">
            <Button
              onClick={onStartTour}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs sm:text-sm h-10 gap-2 shadow-sm"
            >
              <span>Iniciar recorrido guiado</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={onSkipTour}
              className="w-full text-xs text-muted-foreground hover:text-white hover:bg-[#27272A] h-9"
            >
              Explorar por mi cuenta
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
