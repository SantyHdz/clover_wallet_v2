'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import authService from '@/lib/auth-service';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        // Obtener la sesión de Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.access_token) {
          // Intercambiar el token de Supabase con el backend de Clover Wallet (Render)
          await authService.exchangeSupabaseGoogleToken(session.access_token);
          await refetchUser();
          toast.success('¡Sesión iniciada con Google exitosamente!');
          router.replace('/dashboard');
        } else {
          // Si no hay sesión inmediata, escuchamos el cambio de estado de auth
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession?.access_token) {
              try {
                await authService.exchangeSupabaseGoogleToken(currentSession.access_token);
                await refetchUser();
                toast.success('¡Sesión iniciada con Google exitosamente!');
                router.replace('/dashboard');
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error al vincular sesión con el backend';
                setError(message);
                toast.error('Error de autenticación', { description: message });
              }
            }
          });

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al procesar la autenticación de Google';
        setError(message);
        toast.error('Error de inicio de sesión', {
          description: message,
        });
      }
    }

    handleAuth();
  }, [router, refetchUser]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      <Image
        src="/logo.png"
        alt="Clover Wallet"
        width={64}
        height={64}
        className="rounded-full ring-2 ring-[#10B981]/40 animate-pulse shadow-lg"
      />

      {error ? (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-red-400">Error de Autenticación</h2>
          <p className="text-xs text-muted-foreground max-w-sm">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#10B981] hover:underline cursor-pointer"
          >
            ← Volver a Iniciar Sesión
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-white font-semibold">
            <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
            <span>Verificando tu cuenta con Clover Wallet...</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Estamos configurando tu sesión segura, un momento por favor.
          </p>
        </div>
      )}
    </div>
  );
}
