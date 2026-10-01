'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Settings,
  User as UserIcon,
  Camera,
  Loader2,
  Save,
  Mail,
  Coins,
  Shield,
  Calendar,
  LogOut,
  CheckCircle2,
  Copy,
  Wallet,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useUserProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/use-users';
import { formatAmount } from '@/lib/utils';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede superar 80 caracteres'),
  currency: z.string().min(1, 'Selecciona una moneda'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CURRENCIES = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', example: '160,000.00' },
  { code: 'COP', name: 'Peso Colombiano', symbol: 'COL$', example: '1,500,000.00' },
  { code: 'EUR', name: 'Euro', symbol: '€', example: '160,000.00' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', example: '160,000.00' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/.', example: '160,000.00' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', example: '160,000.00' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', example: '160,000.00' },
];

export default function SettingsPage() {
  const { user: authUser, logout } = useAuth();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const updateMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState(false);

  const currentUser = userProfile || authUser;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: currentUser?.full_name || '',
      currency: currentUser?.currency || 'USD',
    },
  });

  const selectedCurrency = watch('currency') || 'USD';

  useEffect(() => {
    if (currentUser) {
      setValue('full_name', currentUser.full_name || '');
      setValue('currency', currentUser.currency || 'USD');
    }
  }, [currentUser, setValue]);

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate({
      full_name: data.full_name,
      currency: data.currency,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB de tamaño');
      return;
    }

    uploadAvatarMutation.mutate(file);
  };

  const copyUserId = () => {
    if (currentUser?.id) {
      navigator.clipboard.writeText(currentUser.id);
      setCopiedId(true);
      toast.success('ID de usuario copiado al portapapeles');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const initials = currentUser?.full_name
    ? currentUser.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CW';

  const memberSince = currentUser?.created_at
    ? new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'long',
      }).format(new Date(currentUser.created_at))
    : 'Fecha no disponible';

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="border-b border-[#2E2E2E] pb-5">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-[#10B981]" />
          <span>Ajustes & Perfil de Usuario</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personaliza tu perfil, avatar, moneda principal y preferencias de cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Tarjeta de Avatar y Formulario */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-[#10B981]" />
                <span>Información Personal</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Actualiza tu nombre y fotografía de perfil visible en la plataforma
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sección de Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl border border-[#2E2E2E] bg-[#121212]">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-[#10B981]/50 shadow-md">
                    <AvatarImage src={currentUser?.avatar_url || ''} alt={currentUser?.full_name || 'Avatar'} />
                    <AvatarFallback className="bg-[#27272A] text-lg font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {uploadAvatarMutation.isPending && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-[#10B981] animate-spin" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatarMutation.isPending}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-lg hover:bg-[#059669] transition-transform hover:scale-105 cursor-pointer"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-white">
                    {currentUser?.full_name || 'Usuario Clover'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Formatos recomendados: PNG, JPG o WEBP (máx. 5MB)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatarMutation.isPending}
                    className="mt-2 border-[#2E2E2E] bg-[#1E1E1E] text-white hover:bg-[#27272A] text-xs h-7 cursor-pointer"
                  >
                    <Camera className="mr-1.5 h-3 w-3 text-[#10B981]" />
                    Subir Nueva Imagen
                  </Button>
                </div>
              </div>

              {/* Formulario de Perfil */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre Completo */}
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-semibold text-white">
                    Nombre Completo
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Ej. Juan Pérez"
                    className="border-[#2E2E2E] bg-[#121212] text-white focus-visible:ring-[#10B981]"
                    {...register('full_name')}
                  />
                  {errors.full_name && (
                    <p className="text-[11px] text-[#EF4444]">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email (Solo lectura) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email" className="text-xs font-semibold text-white">
                      Correo Electrónico
                    </Label>
                    <Badge variant="outline" className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[10px]">
                      {currentUser?.provider === 'google' ? 'Google OAuth' : 'Verificado'}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="border-[#2E2E2E] bg-[#121212]/60 text-muted-foreground pl-9 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    El correo electrónico está vinculado a tu cuenta y no puede modificarse directamente.
                  </p>
                </div>

                {/* Moneda Preferida */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-[#10B981]" />
                    <span>Moneda Principal de la Billetera</span>
                  </Label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(val) => {
                      if (val) setValue('currency', val, { shouldDirty: true });
                    }}
                  >
                    <SelectTrigger className="border-[#2E2E2E] bg-[#121212] text-white">
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                    <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <div className="flex items-center justify-between w-full gap-3">
                            <span className="font-semibold text-white">{curr.code}</span>
                            <span className="text-muted-foreground text-xs">({curr.name} — {curr.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Preview de Formato Monetario */}
                  <div className="mt-2 p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Previsualización de formato:</span>
                    <span className="font-mono font-bold text-[#10B981]">
                      {selectedCurrency === 'COP' ? 'COL$' : selectedCurrency === 'EUR' ? '€' : '$'}
                      {formatAmount(160000)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || !isDirty}
                    className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold gap-2 shadow-lg shadow-[#10B981]/20 cursor-pointer"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Guardando cambios...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: Seguridad, Sesión e Información */}
        <div className="space-y-6">
          {/* Card de Cuenta & Seguridad */}
          <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#10B981]" />
                <span>Seguridad de la Cuenta</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Estado de sesión y proveedor de acceso
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121212] border border-[#2E2E2E]">
                <span className="text-muted-foreground">Proveedor:</span>
                <span className="font-semibold text-white uppercase">{currentUser?.provider || 'Email'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>ID de Usuario:</span>
                  <button
                    type="button"
                    onClick={copyUserId}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Copiar ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="font-mono text-[11px] text-white truncate">
                  {currentUser?.id || 'No disponible'}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121212] border border-[#2E2E2E]">
                <span className="text-muted-foreground">Miembro desde:</span>
                <span className="font-medium text-white">{memberSince}</span>
              </div>

              <Separator className="bg-[#2E2E2E]" />

              <Button
                type="button"
                variant="outline"
                onClick={() => logout()}
                className="w-full border-rose-500/30 bg-rose-500/10 text-[#EF4444] hover:bg-rose-500/20 hover:text-[#EF4444] font-semibold gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </CardContent>
          </Card>

          {/* Card de Información del Sistema */}
          <Card className="border-[#2E2E2E] bg-[#1E1E1E] shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#10B981]" />
                <span>Clover Wallet</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Versión y estado del sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Versión Frontend:</span>
                <Badge variant="outline" className="border-[#2E2E2E] text-white font-mono text-[10px]">
                  v1.0.0 (Next.js 16)
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span>Backend API:</span>
                <Badge variant="outline" className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[10px]">
                  FastAPI + Supabase
                </Badge>
              </div>

              <div className="p-3 rounded-xl border border-[#2E2E2E] bg-[#121212] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>Seguridad de Cifrado</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Tus datos están protegidos con cifrado SSL/TLS y autenticación por tokens JWT Bearer seguros.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
