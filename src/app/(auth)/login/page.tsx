'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { getApiErrorMessage } from '@/lib/api-client';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSlowLogin, setIsSlowLogin] = useState(false);
  const slowTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setIsSlowLogin(false);
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    slowTimerRef.current = setTimeout(() => {
      setIsSlowLogin(true);
    }, 3000);

    try {
      await login(data);
      toast.success('¡Bienvenido de vuelta a Clover Wallet!');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Credenciales incorrectas o problema de conexión.');
      toast.error('Error al iniciar sesión', {
        description: message,
      });
    } finally {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
      setIsSlowLogin(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      const message = getApiErrorMessage(error, 'No se pudo iniciar sesión con Google.');
      toast.error('Error de Google OAuth', {
        description: message,
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-2xl">
      <CardHeader className="space-y-1 text-center py-4 px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Ingresa tus credenciales para acceder a tu panel financiero
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6 pt-0">
        {/* Botón de Google OAuth */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full h-10 border-[#2E2E2E] bg-[#121212] text-white hover:bg-[#27272A] hover:border-[#10B981]/40 font-medium cursor-pointer text-xs"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#10B981]" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continuar con Google
        </Button>

        {/* Divisor */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2E2E2E]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#1E1E1E] px-2 text-muted-foreground font-medium">
              o con correo
            </span>
          </div>
        </div>

        {/* Formulario de Correo & Contraseña */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Campo Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[11px] font-semibold text-white">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className={`pl-9 h-10 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                  errors.email ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-[11px] font-semibold text-white">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pl-9 pr-9 h-10 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                  errors.password ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full h-10 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-md shadow-[#10B981]/20 cursor-pointer mt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSlowLogin ? 'Despertando servidor...' : 'Ingresando...'}
              </>
            ) : (
              'Ingresar al Dashboard'
            )}
          </Button>
        </form>

        {/* Link a Registro */}
        <div className="text-center text-[11px] text-muted-foreground pt-1">
          ¿Aún no tienes una cuenta?{' '}
          <Link
            href="/register"
            className="font-semibold text-[#10B981] hover:underline"
          >
            Regístrate gratis
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
