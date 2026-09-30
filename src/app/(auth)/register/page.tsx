'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { getApiErrorMessage } from '@/lib/api-client';

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm_password: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      toast.success('¡Cuenta creada exitosamente!', {
        description: 'Bienvenido a Clover Wallet.',
      });
    } catch (error) {
      const message = getApiErrorMessage(error, 'No se pudo completar el registro.');
      toast.error('Error al registrar usuario', {
        description: message,
      });
    } finally {
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
      <CardHeader className="space-y-1 text-center py-3.5 px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Crear Cuenta
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Empieza a gestionar tus finanzas personales gratis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 px-6 pb-5 pt-0">
        {/* Botón de Google OAuth */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full h-9.5 border-[#2E2E2E] bg-[#121212] text-white hover:bg-[#27272A] hover:border-[#10B981]/40 font-medium cursor-pointer text-xs"
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
          Registrarse con Google
        </Button>

        {/* Divisor */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2E2E2E]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#1E1E1E] px-2 text-muted-foreground font-medium">
              o con tus datos
            </span>
          </div>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          {/* Nombre Completo */}
          <div className="space-y-1">
            <Label htmlFor="full_name" className="text-[11px] font-semibold text-white">
              Nombre Completo
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="full_name"
                placeholder="Ej. Juan Pérez"
                className={`pl-8.5 h-9.5 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                  errors.full_name ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                }`}
                {...register('full_name')}
              />
            </div>
            {errors.full_name && (
              <p className="text-[10px] text-red-400 font-medium">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[11px] font-semibold text-white">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className={`pl-8.5 h-9.5 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                  errors.email ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Fila Doble para Contraseñas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Contraseña */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[11px] font-semibold text-white">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`pl-8.5 pr-8 h-9.5 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                    errors.password ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <Label htmlFor="confirm_password" className="text-[11px] font-semibold text-white">
                Confirmar
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`pl-8.5 pr-8 h-9.5 border-[#2E2E2E] bg-[#121212] text-white text-xs placeholder:text-muted-foreground focus-visible:ring-[#10B981] ${
                    errors.confirm_password ? 'border-red-500/70 focus-visible:ring-red-500' : ''
                  }`}
                  {...register('confirm_password')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-[10px] text-red-400 font-medium">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full h-9.5 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-md shadow-[#10B981]/20 cursor-pointer mt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta en Clover'
            )}
          </Button>
        </form>

        {/* Link a Login */}
        <div className="text-center text-[11px] text-muted-foreground pt-0.5">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#10B981] hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
