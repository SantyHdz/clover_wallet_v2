'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegister = pathname.startsWith('/register');

  // Seleccionar la ilustración y textos según la ruta
  const authVisual = isRegister
    ? {
        image: '/images/register.png',
        title: 'Registra tu camino al éxito financiero',
        subtitle:
          'Crea tu cuenta gratis en segundos y toma el control total de tus ingresos, gastos, deudas y metas.',
        badge: 'Registro Rápido & Seguro',
      }
    : {
        image: '/images/login.png',
        title: 'Acceso seguro a tu panel financiero',
        subtitle:
          'Inicia sesión para gestionar tus movimientos diarios, liquidar deudas y ver tus métricas en tiempo real.',
        badge: 'Acceso Protegido',
      };

  return (
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#121212] text-[#F3F3F3]">
      {/* Columna Izquierda: Formulario sin scroll innecesario */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8 lg:overflow-y-auto">
        {/* Header superior */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Image
              src="/logo.png"
              alt="Clover Wallet"
              width={30}
              height={30}
              className="rounded-full ring-1 ring-[#10B981]/30"
            />
            <span className="font-bold text-white text-sm">
              Clover<span className="text-[#10B981]">Wallet</span>
            </span>
          </Link>
        </div>

        {/* Contenedor del Formulario Centrado */}
        <div className="mx-auto w-full max-w-md my-auto py-4">
          {children}
        </div>

        {/* Footer legal */}
        <div className="text-center text-[11px] text-muted-foreground pt-2">
          <span>
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </span>
        </div>
      </div>

      {/* Columna Derecha: Panel Visual de Marca ajustado a 100vh */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between border-l border-[#2E2E2E] bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#121212] p-8 lg:p-10 h-full overflow-hidden">
        {/* Glow de fondo verde esmeralda */}
        <div className="pointer-events-none absolute top-1/3 -right-20 -z-0 h-96 w-96 rounded-full bg-[#10B981]/15 blur-3xl" />

        {/* Logo superior */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-[#10B981]/40 shadow-lg shadow-[#10B981]/20"
            />
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white">
                Clover<span className="text-[#10B981]">Wallet</span>
              </div>
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Finanzas Claras
              </div>
            </div>
          </div>

          <div className="rounded-full border border-[#2E2E2E] bg-[#121212] px-3 py-1 text-[11px] font-medium text-[#10B981]">
            {authVisual.badge}
          </div>
        </div>

        {/* Ilustración de Asta específica por modo */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center">
          <div className="relative h-60 w-60 xl:h-72 xl:w-72 transition-transform duration-500 hover:scale-105">
            <Image
              src={authVisual.image}
              alt="Ilustración Oficial Clover Wallet"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <div className="mt-5 max-w-sm">
            <h3 className="text-xl xl:text-2xl font-bold text-white">
              {authVisual.title}
            </h3>
            <p className="mt-2 text-xs xl:text-sm text-muted-foreground leading-relaxed">
              {authVisual.subtitle}
            </p>
          </div>
        </div>

        {/* Badges de Confianza */}
        <div className="relative z-10 flex items-center justify-center gap-6 text-[11px] text-muted-foreground border-t border-[#2E2E2E]/60 pt-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Datos Cifrados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Supabase Seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
            <span>100% Gratuito</span>
          </div>
        </div>
      </div>
    </div>
  );
}
