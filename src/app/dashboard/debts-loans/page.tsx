'use client';

import React from 'react';
import { HandCoins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebtsLoansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <HandCoins className="h-6 w-6 text-[#3B82F6]" />
            <span>Deudas y Préstamos</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de pasivos pendientes y préstamos otorgados por recuperar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-[#10B981] text-white hover:bg-[#059669]">
            <Plus className="mr-1.5 h-4 w-4" />
            Nueva Deuda / Préstamo
          </Button>
        </div>
      </div>

      <Card className="border-[#2E2E2E] bg-[#1E1E1E]">
        <CardHeader>
          <CardTitle className="text-base text-white">Estado de Obligaciones</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Módulo con barras de amortización y registro de abonos parciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <HandCoins className="h-12 w-12 text-[#2E2E2E] mb-3" />
          <p className="text-sm">No tienes deudas ni préstamos activos registrados</p>
        </CardContent>
      </Card>
    </div>
  );
}
