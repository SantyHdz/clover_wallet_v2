'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  HandCoins,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  PieChart,
  BarChart3,
  Calendar,
  Star,
  Layers,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#F3F3F3]">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#2E2E2E] bg-[#121212]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo Oficial */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              width={42}
              height={42}
              className="rounded-full ring-2 ring-[#10B981]/30 shadow-lg shadow-[#10B981]/15"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Clover<span className="text-[#10B981]">Wallet</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Finanzas Claras
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#caracteristicas" className="transition-colors hover:text-white">
              Características
            </a>
            <a href="#deudas-prestamos" className="transition-colors hover:text-white">
              Deudas & Préstamos
            </a>
            <a href="#reportes" className="transition-colors hover:text-white">
              Reportes
            </a>
            <a href="#testimonios" className="transition-colors hover:text-white">
              Testimonios
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:bg-[#1E1E1E] hover:text-white"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#10B981] text-white hover:bg-[#059669] font-medium shadow-md shadow-[#10B981]/20">
                Crear Cuenta
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION (Estilo HomeLoanGurus + Mascota Oficial)
        ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#10B981]/15 blur-3xl" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Mascot Brand Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#2E2E2E] bg-[#1E1E1E] py-1.5 pr-4 pl-2 text-xs font-medium text-white shadow-sm mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Clover Mascot Icon"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-[#10B981] font-semibold">Clover Wallet:</span>
                <span>Control Financiero Total & Simplificado</span>
              </div>

              {/* Titular Principal */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Cuando administras tu dinero,{' '}
                <span className="text-[#10B981]">la claridad</span> lo cambia todo
              </h1>

              {/* Subtítulo */}
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Controla tus ingresos y gastos diarios, lleva la contabilidad exacta de lo que debes
                y lo que te deben, y alcanza tus metas con reportes en tiempo real.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 bg-[#10B981] hover:bg-[#059669] text-white text-base font-semibold shadow-lg shadow-[#10B981]/25 cursor-pointer"
                  >
                    Comenzar Ahora Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-8 border-[#2E2E2E] bg-[#1E1E1E] text-white hover:bg-[#27272A] hover:border-[#10B981]/50 text-base font-medium"
                  >
                    Explorar Dashboard
                  </Button>
                </Link>
              </div>

              {/* Mini Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span>Sin costo inicial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span>Base de datos segura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span>Modo oscuro nativo</span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                HERO INTERACTIVE DASHBOARD PREVIEW + OFFICIAL MASCOT
            ───────────────────────────────────────────────────────── */}
            <div className="relative mt-16 lg:mt-20">
              {/* Floating Mascot Badge 1: Top Left */}
              <div className="absolute -top-12 -left-4 sm:-left-8 z-30 hidden sm:flex items-center gap-3.5 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E]/95 p-3 shadow-2xl backdrop-blur-md">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
                  <Image
                    src="/images/mascot.png"
                    alt="Clover Mascot"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">¡Aliado Financiero!</div>
                  <div className="text-xs text-[#10B981] font-medium">39K+ Transacciones</div>
                </div>
              </div>

              {/* Floating Badge 2: Top Right */}
              <div className="absolute -top-6 -right-2 sm:-right-6 z-20 hidden sm:flex items-center gap-3.5 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E]/95 p-3.5 shadow-2xl backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6]">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Balance en Vivo</div>
                  <div className="text-xs text-muted-foreground">Sincronización instantánea</div>
                </div>
              </div>

              {/* Floating Badge 3: Bottom Left */}
              <div className="absolute -bottom-6 left-12 z-20 hidden md:flex items-center gap-3.5 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E]/95 p-3.5 shadow-2xl backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/15 text-[#F97316]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Control de Deudas</div>
                  <div className="text-xs text-muted-foreground">Alertas de vencimientos</div>
                </div>
              </div>

              {/* The Dashboard Mockup Canvas */}
              <div className="rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-4 sm:p-6 lg:p-8 shadow-2xl ring-1 ring-white/5">
                {/* Mockup Top Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="Clover Logo"
                      width={36}
                      height={36}
                      className="rounded-full ring-1 ring-[#2E2E2E]"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white">Panel Financiero</h2>
                      <p className="text-xs text-muted-foreground">
                        Resumen global consolidado — Septiembre 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3 text-[#10B981]" />
                      Mensual
                    </Badge>
                    <Badge className="bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30 border-0 text-xs">
                      En Línea
                    </Badge>
                  </div>
                </div>

                {/* 4 Financial KPI Cards Grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* KPI 1: Ingresos */}
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-4 transition-all hover:border-[#22C55E]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Total Ingresos</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">$5,420.00</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#22C55E]">
                      <span>+14.2%</span>
                      <span className="text-muted-foreground">vs mes anterior</span>
                    </div>
                  </div>

                  {/* KPI 2: Gastos */}
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-4 transition-all hover:border-[#EF4444]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Total Gastos</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]/15 text-[#EF4444]">
                        <TrendingDown className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">$2,180.50</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#22C55E]">
                      <span>-5.8%</span>
                      <span className="text-muted-foreground">menos gastos</span>
                    </div>
                  </div>

                  {/* KPI 3: Deudas */}
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-4 transition-all hover:border-[#F97316]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Deudas Pendientes</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/15 text-[#F97316]">
                        <CreditCard className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">$1,450.00</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Pagado: $850.00</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-1.5 bg-[#2E2E2E]" />
                    </div>
                  </div>

                  {/* KPI 4: Préstamos */}
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-4 transition-all hover:border-[#3B82F6]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Préstamos por Cobrar</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/15 text-[#3B82F6]">
                        <HandCoins className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">$800.00</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Recuperado: $500.00</span>
                        <span>62%</span>
                      </div>
                      <Progress value={62} className="h-1.5 bg-[#2E2E2E]" />
                    </div>
                  </div>
                </div>

                {/* Split Mockup Content: Mini Transactions & Breakdown */}
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Recent Transactions list */}
                  <div className="lg:col-span-2 rounded-xl border border-[#2E2E2E] bg-[#121212] p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E]">
                      <span className="text-sm font-semibold text-white">Transacciones Recientes</span>
                      <span className="text-xs text-[#10B981] hover:underline cursor-pointer">Ver todas</span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <div className="flex items-center justify-between rounded-lg bg-[#1E1E1E] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">Nómina / Salario Mensual</div>
                            <div className="text-[10px] text-muted-foreground">Trabajo Principal • Hoy</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#22C55E]">+$3,800.00</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-[#1E1E1E] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EF4444]/15 text-[#EF4444]">
                            <TrendingDown className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">Supermercado & Víveres</div>
                            <div className="text-[10px] text-muted-foreground">Alimentación • Ayer</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#EF4444]">-$184.20</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-[#1E1E1E] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]/15 text-[#F97316]">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">Abono Tarjeta Crédito</div>
                            <div className="text-[10px] text-muted-foreground">Deudas • Hace 2 días</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#F97316]">-$250.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Balance Summary Widget */}
                  <div className="rounded-xl border border-[#2E2E2E] bg-gradient-to-br from-[#1E1E1E] to-[#121212] p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Balance Neto Disponible</span>
                      <div className="mt-2 text-3xl font-extrabold text-[#10B981]">+$3,239.50</div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Tus ingresos superan tus gastos por un margen saludable del 60%.
                      </p>
                    </div>

                    <div className="mt-6 rounded-lg border border-[#2E2E2E] bg-[#121212]/80 p-3">
                      <div className="text-xs font-medium text-white mb-2">Salud Financiera</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ahorro Estimado</span>
                        <span className="text-white font-semibold">$1,200.00</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Capacidad de Pago</span>
                        <span className="text-[#10B981] font-semibold">Excelente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. "QUÉ HACEMOS" / FEATURES GRID (Estilo HomeLoanGurus)
        ───────────────────────────────────────────────────────────── */}
        <section id="caracteristicas" className="border-t border-[#2E2E2E] bg-[#161616] py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="border-[#2E2E2E] bg-[#1E1E1E] text-xs text-[#10B981] mb-3">
                Funcionalidades Principales
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Todo lo que necesitas para tu tranquilidad financiera
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Deja atrás las hojas de cálculo confusas y toma decisiones informadas con módulos especializados.
              </p>
            </div>

            {/* Grid 3 Cards: 2 Top Cards + 1 Wide Featured Card */}
            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Card 1: Gastos e Ingresos */}
              <div className="group rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-8 transition-all hover:border-[#10B981]/50 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] mb-6">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Control de Ingresos & Gastos</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Registra y categoriza cada movimiento con soporte para transacciones recurrentes.
                    Filtra fácilmente por categoría, mes y año para detectar patrones de gasto innecesarios.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#2E2E2E]/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Categorías dinámicas con iconos y colores</span>
                  <Link href="/register" className="inline-flex items-center text-xs font-semibold text-[#10B981] hover:underline">
                    Saber más <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Deudas y Préstamos */}
              <div id="deudas-prestamos" className="group rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] p-8 transition-all hover:border-[#3B82F6]/50 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] mb-6">
                    <HandCoins className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Módulo de Deudas & Préstamos</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Diferencia con claridad lo que debes (deudas con acreedores) de lo que prestaste (préstamos por recuperar).
                    Registra abonos parciales y monitorea el avance visual de liquidación.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#2E2E2E]/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Barras de amortización e historial de pagos</span>
                  <Link href="/register" className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline">
                    Saber más <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Featured Wide Card - Reportes Inteligentes */}
              <div id="reportes" className="lg:col-span-2 rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#1E1E1E] via-[#1A1A1A] to-[#1E1E1E] p-8 lg:p-10 transition-all hover:border-[#10B981]/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] mb-6">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      Reportes Visuales y Resumen Ejecutivo
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Visualiza gráficamente el desglose de tus finanzas por categorías, comparativas mensuales
                      y el balance neto global para planificar tu futuro con números reales.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] py-1 text-xs text-muted-foreground">
                        <PieChart className="mr-1.5 h-3.5 w-3.5 text-[#10B981]" />
                        Desglose de Gastos
                      </Badge>
                      <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] py-1 text-xs text-muted-foreground">
                        <Layers className="mr-1.5 h-3.5 w-3.5 text-[#3B82F6]" />
                        Histórico Anual
                      </Badge>
                      <Badge variant="outline" className="border-[#2E2E2E] bg-[#121212] py-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#22C55E]" />
                        Cálculo de Ahorro
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-5 shadow-inner">
                    <div className="text-xs font-semibold text-white mb-3">Distribución por Categorías</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Vivienda & Servicios</span>
                          <span className="text-white font-medium">42%</span>
                        </div>
                        <Progress value={42} className="h-1.5 bg-[#2E2E2E]" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Alimentación</span>
                          <span className="text-white font-medium">28%</span>
                        </div>
                        <Progress value={28} className="h-1.5 bg-[#2E2E2E]" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Transporte</span>
                          <span className="text-white font-medium">18%</span>
                        </div>
                        <Progress value={18} className="h-1.5 bg-[#2E2E2E]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. TESTIMONIOS SECTION (Estilo HomeLoanGurus)
        ───────────────────────────────────────────────────────────── */}
        <section id="testimonios" className="border-t border-[#2E2E2E] bg-[#121212] py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="border-[#2E2E2E] bg-[#1E1E1E] text-xs text-[#10B981] mb-3">
                Opiniones Reales
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                La experiencia de quienes confían en Clover
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Descubre cómo nuestros usuarios han recuperado el control de sus finanzas personales.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Testimonial 1 */}
              <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-md flex flex-col justify-between">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 text-[#10B981] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#10B981]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#E4E4E7] leading-relaxed italic">
                    "El módulo de deudas fue clave para mí. Poder registrar abonos parciales y ver la barra llegar al 100% liquidado me dio una motivación enorme para salir de deudas."
                  </p>
                </CardContent>
                <div className="mt-6 pt-4 border-t border-[#2E2E2E]">
                  <div className="text-sm font-semibold text-white">Carlos M.</div>
                  <div className="text-xs text-muted-foreground">Desarrollador Independiente</div>
                </div>
              </Card>

              {/* Testimonial 2 */}
              <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-md flex flex-col justify-between">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 text-[#10B981] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#10B981]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#E4E4E7] leading-relaxed italic">
                    "Siempre perdía la cuenta de los préstamos que hacía a conocidos. Con Clover Wallet sé exactamente cuánto me han pagado y cuánto falta por recuperar con un solo clic."
                  </p>
                </CardContent>
                <div className="mt-6 pt-4 border-t border-[#2E2E2E]">
                  <div className="text-sm font-semibold text-white">Elena R.</div>
                  <div className="text-xs text-muted-foreground">Emprendedora</div>
                </div>
              </Card>

              {/* Testimonial 3 */}
              <Card className="border-[#2E2E2E] bg-[#1E1E1E] p-6 shadow-md flex flex-col justify-between">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 text-[#10B981] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#10B981]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#E4E4E7] leading-relaxed italic">
                    "La interfaz en gris carbón es sumamente elegante y nada agotadora para la vista. Rápida, intuitiva y los reportes mensuales son claros y directos al punto."
                  </p>
                </CardContent>
                <div className="mt-6 pt-4 border-t border-[#2E2E2E]">
                  <div className="text-sm font-semibold text-white">David S.</div>
                  <div className="text-xs text-muted-foreground">Consultor Financiero</div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. FINAL CTA BANNER
        ───────────────────────────────────────────────────────────── */}
        <section className="border-t border-[#2E2E2E] bg-[#161616] py-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#2E2E2E] bg-gradient-to-b from-[#1E1E1E] to-[#121212] p-8 sm:p-12 text-center shadow-2xl">
              <div className="pointer-events-none absolute -bottom-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#10B981]/20 blur-3xl" />

              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                ¿Listo para transformar tus finanzas?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                Crea tu cuenta gratuita hoy y experimenta la tranquilidad de tener el control total de tus ingresos, gastos, deudas y préstamos.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-base shadow-lg shadow-[#10B981]/25"
                  >
                    Registrarme Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto h-12 px-8 text-white hover:bg-[#1E1E1E]"
                  >
                    Ya tengo una cuenta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          6. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#2E2E2E] bg-[#121212] py-10 text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-semibold text-white">Clover Wallet</span>
            <span>© {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#caracteristicas" className="hover:text-white transition-colors">
              Características
            </a>
            <a href="#deudas-prestamos" className="hover:text-white transition-colors">
              Deudas
            </a>
            <a href="#reportes" className="hover:text-white transition-colors">
              Reportes
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Acceso
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
