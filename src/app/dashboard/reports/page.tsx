'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-[#10B981]" />
          <span>Reportes & Analíticas</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Evolución mensual, comparativas de gastos e ingresos y análisis de salud financiera.
        </p>
      </div>

      <Card className="border-[#2E2E2E] bg-[#1E1E1E]">
        <CardHeader>
          <CardTitle className="text-base text-white">Informes Financieros</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Gráficos interactivos con Recharts / Shadcn Charts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 text-[#2E2E2E] mb-3" />
          <p className="text-sm">Generando analíticas financieras...</p>
        </CardContent>
      </Card>
    </div>
  );
}
