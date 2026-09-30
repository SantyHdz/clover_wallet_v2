import React from 'react';
import {
  Utensils,
  Coffee,
  ShoppingBag,
  Pizza,
  Apple,
  Beer,
  Wine,
  Home,
  Zap,
  Wifi,
  Tv,
  Droplet,
  Flame,
  Key,
  Wrench,
  Car,
  Bus,
  Plane,
  Fuel,
  Bike,
  Train,
  MapPin,
  Briefcase,
  Landmark,
  Wallet,
  CreditCard,
  TrendingUp,
  PiggyBank,
  DollarSign,
  Coins,
  Gamepad2,
  Film,
  Music,
  BookOpen,
  Camera,
  Ticket,
  Smile,
  HeartPulse,
  Dumbbell,
  Pill,
  Heart,
  Shield,
  Activity,
  GraduationCap,
  Book,
  Laptop,
  Smartphone,
  Gift,
  Shirt,
  Scissors,
  Tag,
  Package,
  LucideIcon,
} from 'lucide-react';

export interface IconDefinition {
  name: string;
  label: string;
  category: string;
  icon: LucideIcon;
}

export const CATEGORY_ICONS_MAP: Record<string, LucideIcon> = {
  // Alimentación
  utensils: Utensils,
  coffee: Coffee,
  shoppingbag: ShoppingBag,
  pizza: Pizza,
  apple: Apple,
  beer: Beer,
  wine: Wine,

  // Hogar & Servicios
  home: Home,
  zap: Zap,
  wifi: Wifi,
  tv: Tv,
  droplet: Droplet,
  flame: Flame,
  key: Key,
  wrench: Wrench,

  // Transporte & Viajes
  car: Car,
  bus: Bus,
  plane: Plane,
  fuel: Fuel,
  bike: Bike,
  train: Train,
  mappin: MapPin,

  // Finanzas & Trabajo
  briefcase: Briefcase,
  landmark: Landmark,
  wallet: Wallet,
  creditcard: CreditCard,
  trendingup: TrendingUp,
  piggybank: PiggyBank,
  dollarsign: DollarSign,
  coins: Coins,

  // Ocio & Entretenimiento
  gamepad2: Gamepad2,
  film: Film,
  music: Music,
  bookopen: BookOpen,
  camera: Camera,
  ticket: Ticket,
  smile: Smile,

  // Salud & Bienestar
  heartpulse: HeartPulse,
  dumbbell: Dumbbell,
  pill: Pill,
  heart: Heart,
  shield: Shield,
  activity: Activity,

  // Educación & Compras
  graduationcap: GraduationCap,
  book: Book,
  laptop: Laptop,
  smartphone: Smartphone,
  gift: Gift,
  shirt: Shirt,
  scissors: Scissors,
  tag: Tag,
  package: Package,
};

export const AVAILABLE_ICONS: IconDefinition[] = [
  // Alimentación
  { name: 'utensils', label: 'Restaurante / Comida', category: 'Alimentación', icon: Utensils },
  { name: 'coffee', label: 'Café & Bebidas', category: 'Alimentación', icon: Coffee },
  { name: 'shoppingbag', label: 'Supermercado', category: 'Alimentación', icon: ShoppingBag },
  { name: 'pizza', label: 'Comida Rápida', category: 'Alimentación', icon: Pizza },
  { name: 'apple', label: 'Frutas & Salud', category: 'Alimentación', icon: Apple },
  { name: 'beer', label: 'Bar & Salidas', category: 'Alimentación', icon: Beer },
  { name: 'wine', label: 'Eventos & Vinos', category: 'Alimentación', icon: Wine },

  // Hogar & Servicios
  { name: 'home', label: 'Vivienda / Alquiler', category: 'Hogar', icon: Home },
  { name: 'zap', label: 'Electricidad / Luz', category: 'Hogar', icon: Zap },
  { name: 'wifi', label: 'Internet & Telefonía', category: 'Hogar', icon: Wifi },
  { name: 'tv', label: 'Suscripciones & TV', category: 'Hogar', icon: Tv },
  { name: 'droplet', label: 'Agua & Aseo', category: 'Hogar', icon: Droplet },
  { name: 'flame', label: 'Gas Natural', category: 'Hogar', icon: Flame },
  { name: 'key', label: 'Alquiler & Claves', category: 'Hogar', icon: Key },
  { name: 'wrench', label: 'Mantenimiento', category: 'Hogar', icon: Wrench },

  // Transporte
  { name: 'car', label: 'Vehículo / Auto', category: 'Transporte', icon: Car },
  { name: 'bus', label: 'Transporte Público', category: 'Transporte', icon: Bus },
  { name: 'plane', label: 'Viajes & Vuelos', category: 'Transporte', icon: Plane },
  { name: 'fuel', label: 'Gasolina / Combustible', category: 'Transporte', icon: Fuel },
  { name: 'bike', label: 'Bicicleta / Movilidad', category: 'Transporte', icon: Bike },
  { name: 'train', label: 'Tren / Metro', category: 'Transporte', icon: Train },
  { name: 'mappin', label: 'Ubicación / Viajes', category: 'Transporte', icon: MapPin },

  // Finanzas & Ingresos
  { name: 'briefcase', label: 'Salario / Empleo', category: 'Finanzas', icon: Briefcase },
  { name: 'landmark', label: 'Banco / Inversión', category: 'Finanzas', icon: Landmark },
  { name: 'wallet', label: 'Efectivo / Billetera', category: 'Finanzas', icon: Wallet },
  { name: 'creditcard', label: 'Tarjetas de Crédito', category: 'Finanzas', icon: CreditCard },
  { name: 'trendingup', label: 'Rendimientos', category: 'Finanzas', icon: TrendingUp },
  { name: 'piggybank', label: 'Ahorro / Alcancía', category: 'Finanzas', icon: PiggyBank },
  { name: 'dollarsign', label: 'Ingresos Extra', category: 'Finanzas', icon: DollarSign },
  { name: 'coins', label: 'Monedas / Dividendos', category: 'Finanzas', icon: Coins },

  // Ocio & Entretenimiento
  { name: 'gamepad2', label: 'Videojuegos / Gaming', category: 'Ocio', icon: Gamepad2 },
  { name: 'film', label: 'Cine & Streaming', category: 'Ocio', icon: Film },
  { name: 'music', label: 'Música & Conciertos', category: 'Ocio', icon: Music },
  { name: 'bookopen', label: 'Lectura & Libros', category: 'Ocio', icon: BookOpen },
  { name: 'camera', label: 'Fotografía / Hobby', category: 'Ocio', icon: Camera },
  { name: 'ticket', label: 'Boletos & Eventos', category: 'Ocio', icon: Ticket },
  { name: 'smile', label: 'Diversión & Fiestas', category: 'Ocio', icon: Smile },

  // Salud & Cuidado
  { name: 'heartpulse', label: 'Médico & Salud', category: 'Salud', icon: HeartPulse },
  { name: 'dumbbell', label: 'Gimnasio & Deporte', category: 'Salud', icon: Dumbbell },
  { name: 'pill', label: 'Farmacia / Medicinas', category: 'Salud', icon: Pill },
  { name: 'heart', label: 'Cuidado Personal', category: 'Salud', icon: Heart },
  { name: 'shield', label: 'Seguros & Pólizas', category: 'Salud', icon: Shield },
  { name: 'activity', label: 'Actividad Física', category: 'Salud', icon: Activity },

  // Educación & Compras
  { name: 'graduationcap', label: 'Cursos & Universidad', category: 'Educación', icon: GraduationCap },
  { name: 'laptop', label: 'Tecnología & Gadgets', category: 'Compras', icon: Laptop },
  { name: 'smartphone', label: 'Celulares & Apps', category: 'Compras', icon: Smartphone },
  { name: 'gift', label: 'Regalos & Donaciones', category: 'Compras', icon: Gift },
  { name: 'shirt', label: 'Ropa & Moda', category: 'Compras', icon: Shirt },
  { name: 'scissors', label: 'Peluquería & Belleza', category: 'Compras', icon: Scissors },
  { name: 'package', label: 'Envíos & Paquetes', category: 'Compras', icon: Package },
];

export const CATEGORY_COLORS = [
  { name: 'Esmeralda', hex: '#10B981' },
  { name: 'Verde Éxito', hex: '#22C55E' },
  { name: 'Azul Real', hex: '#3B82F6' },
  { name: 'Índigo', hex: '#6366F1' },
  { name: 'Púrpura', hex: '#8B5CF6' },
  { name: 'Rosa Vibrante', hex: '#EC4899' },
  { name: 'Rojo Carmesí', hex: '#EF4444' },
  { name: 'Naranja Fuego', hex: '#F97316' },
  { name: 'Ámbar Cálido', hex: '#F59E0B' },
  { name: 'Lima', hex: '#84CC16' },
  { name: 'Cian Fresco', hex: '#06B6D4' },
  { name: 'Gris Neutro', hex: '#71717A' },
];

export interface CategoryIconProps {
  iconName?: string | null;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function CategoryIcon({ iconName, className, color, style }: CategoryIconProps) {
  if (!iconName) {
    return <Tag className={className} style={{ color, ...style }} />;
  }

  const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const IconComponent = CATEGORY_ICONS_MAP[normalized] || Tag;

  return <IconComponent className={className} style={{ color, ...style }} />;
}
