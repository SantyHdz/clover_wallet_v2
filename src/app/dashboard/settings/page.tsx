'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-[#10B981]" />
          <span>Ajustes & Perfil</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Configura tu información personal, avatar, moneda preferida y preferencias.
        </p>
      </div>

      <Card className="border-[#2E2E2E] bg-[#1E1E1E]">
        <CardHeader>
          <CardTitle className="text-base text-white">Perfil de Usuario</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {user?.email ? `Sesión iniciada con ${user.email}` : 'Datos de tu cuenta'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Nombre: <span className="text-white font-medium">{user?.full_name || 'No configurado'}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Moneda: <span className="text-[#10B981] font-semibold">{user?.currency?.toUpperCase() || 'USD'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
