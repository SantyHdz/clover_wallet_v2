# AGENTS.md — Clover Wallet Frontend Context & Architecture

Este archivo contiene la especificación técnica completa, directrices de diseño y contexto de integración del proyecto **Clover Wallet Frontend** para los agentes de IA y desarrolladores.

---

## 1. Información General del Proyecto

- **Nombre del Proyecto**: Clover Wallet (Frontend)
- **Ruta del Frontend**: `C:\Users\GIS_Soporte\Documents\clover_wallet_frontend`
- **Ruta del Backend**: `C:\Users\GIS_Soporte\Documents\Clover_Wallet_BACKEND` (FastAPI + Supabase)
- **Plataforma de Despliegue**: Vercel
- **URL Backend Producción (Render)**: `https://clover-wallet-backend.onrender.com`
- **URL Backend Local**: `http://localhost:8000`

---

## 2. Stack Tecnológico

| Capa / Herramienta | Versión / Librería | Propósito |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Enrutamiento, Server Components, renderizado cliente y optimización para Vercel. |
| **Lenguaje** | TypeScript 5.x | Tipado estricto alineado a los contratos del backend. |
| **Componentes UI** | shadcn/ui (Radix UI) | Sistema de componentes accesibles y personalizables. |
| **Estilos** | Tailwind CSS v4 | Motor de estilos y variables CSS para tema oscuro. |
| **Autenticación** | Better Auth | Autenticación híbrida (Credenciales + Google OAuth) con puente al backend. |
| **Estado & Data Fetching** | TanStack Query v5 (React Query) | Caché, revalidación automática, mutaciones y manejo de estados. |
| **Cliente HTTP** | Axios con Interceptors | Inyección de token `Bearer`, manejo de errores 401 y reintentos. |
| **Formularios & Validación** | React Hook Form + Zod | Validación de datos en cliente. |
| **Gráficos & Visualización** | Shadcn Charts (Recharts) | Gráficos financieros (balance, gastos por categoría, pagos). |
| **Iconos & Notificaciones** | Lucide React + Sonner | Iconos vectoriales y notificaciones toast. |

---

## 3. Sistema de Diseño Visual (Dark Theme Escandinavo / Material)

### 3.1. Filosofía
Fondo oscuro neutro `#121212` con superficies `#1E1E1E` para eliminar fatiga visual, contrastando con texto claro y acento de marca verde esmeralda (`#10B981` / Clover).

### 3.2. Insumos Oficiales de Marca (Brand Assets)
- **Logo Circular Oficial**: `/logo.png` y `/images/logo.png` (Avatar chibi de Asta con banda de trébol verde).
- **Mascota Oficial de Cuerpo Completo**: `/images/mascot.png` (Mascota chibi Asta con ropa oscura, líneas verde esmeralda, tréboles y monedas).
- **Ilustración Oficial Login**: `/images/login.png` (Asta con llave trébol dorada y tarjeta de seguridad digital).
- **Ilustración Oficial Register**: `/images/register.png` (Asta con pergamino de nuevo registro y pluma trébol).
- **Ilustración Oficial 404**: `/images/404.png` y `/images/404-asta.png` (Asta perdido con brújula y cubeta derramada).
- **Regla Estricta**: No utilizar iconos genéricos de chispas (`Sparkles`) ni referencias/emojis que simulen IA. Utilizar siempre los recursos gráficos e iconografía oficial de la marca. Si se requiere un nuevo asset, preguntar explícitamente al usuario.

### 3.3. Variables y Paleta de Colores
```css
:root {
  /* Fondo Principal Gris Carbón */
  --background: #121212;
  --foreground: #f3f3f3;

  /* Superficies (Cards, Modales, Drawers) */
  --card: #1e1e1e;
  --card-foreground: #f3f3f3;
  --popover: #1e1e1e;
  --popover-foreground: #f3f3f3;

  /* Acento de Marca (Clover Emerald) */
  --primary: #10b981;
  --primary-foreground: #ffffff;
  --primary-hover: #059669;

  /* Elementos Secundarios y Hover */
  --secondary: #27272a;
  --secondary-foreground: #f4f4f5;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #f4f4f5;

  /* Bordes e Inputs */
  --border: #2e2e2e;
  --input: #2e2e2e;
  --ring: #10b981;

  /* Semántica Financiera */
  --income: #22c55e;   /* + Ingresos (Verde) */
  --expense: #ef4444;  /* - Gastos (Rojo) */
  --debt: #f97316;     /* Deudas pendientes (Naranja) */
  --loan: #3b82f6;     /* Préstamos por recuperar (Azul) */
}
```

---

## 4. Estructura de Navegación & Vistas

- **Layout General**:
  - Desktop: Sidebar lateral colapsable + Header con búsqueda y menú de perfil.
  - Móvil: Bottom Navigation Bar + Drawer lateral.
- **Rutas Principales**:
  - `/(auth)/login` y `/(auth)/register`: Autenticación con formulario y botón Google.
  - `/dashboard`: Dashboard general con métricas KPI, gráficos y transacciones recientes.
  - `/dashboard/transactions`: Tabla completa con filtros por tipo, categoría, mes/año y modal CRUD.
  - `/dashboard/debts-loans`: Gestión de Deudas (lo que debes) y Préstamos (lo que te deben), barras de progreso y registro de abonos.
  - `/dashboard/categories`: Administrador visual de categorías con selector de icono y color.
  - `/dashboard/reports`: Informes mensuales, desglose de categorías y balance comparativo.
  - `/dashboard/settings`: Perfil del usuario, moneda preferida y subida de avatar.

---

## 5. Mapeo Completo del Backend (`Clover_Wallet_BACKEND`)

### 5.1. Autenticación (`/auth`)
- `POST /auth/register` -> Body: `{ full_name, email, password }` -> Retorna: `{ access_token, token_type }`
- `POST /auth/login` -> Body: `{ email, password }` -> Retorna: `{ access_token, token_type }`
- `POST /auth/login/google` -> Header: `Authorization: Bearer <supabase_token>` -> Retorna: `{ access_token, token_type }`

### 5.2. Usuario & Perfil (`/users`)
- `GET /users/me` -> Retorna: `{ id, full_name, avatar_url, provider, currency, created_at }`
- `PATCH /users/me` -> Body: `{ full_name?, currency? }`
- `POST /users/me/avatar` -> Multipart Form: `file`

### 5.3. Transacciones (`/transactions`)
- `GET /transactions/?type=&category_id=&year=&month=` -> Lista de transacciones
- `GET /transactions/{id}` -> Detalle
- `POST /transactions/` -> Body: `{ category_id?, type: 'income'|'expense', amount, description?, notes?, transaction_date, is_recurring, recurrence? }`
- `PATCH /transactions/{id}` -> Body con campos a actualizar
- `DELETE /transactions/{id}` -> 204 No Content

### 5.4. Deudas (`/debts`)
- `GET /debts/?status=` -> Lista (`status`: pending, partial, paid, overdue)
- `POST /debts/` -> Body: `{ creditor_name, description?, total_amount, interest_rate?, due_date? }`
- `PATCH /debts/{id}` / `DELETE /debts/{id}`
- `GET /debts/{id}/payments` -> Lista de abonos
- `POST /debts/{id}/payments` -> Body: `{ amount, payment_date, notes? }`
- `DELETE /debts/{id}/payments/{payment_id}`

### 5.5. Préstamos (`/loans`)
- `GET /loans/?status=` -> Lista (`status`: pending, partial, recovered, overdue, defaulted)
- `POST /loans/` -> Body: `{ debtor_name, description?, total_amount, interest_rate?, due_date? }`
- `PATCH /loans/{id}` / `DELETE /loans/{id}`
- `GET /loans/{id}/payments` -> Lista de cobros
- `POST /loans/{id}/payments` -> Body: `{ amount, payment_date, notes? }`
- `DELETE /loans/{id}/payments/{payment_id}`

### 5.6. Categorías (`/categories`)
- `GET /categories/` -> Lista de categorías (globales + del usuario)
- `POST /categories/` -> Body: `{ name, icon?, color?, type: 'income'|'expense'|'both' }`
- `DELETE /categories/{id}` -> Eliminar categoría personalizada

### 5.7. Reportes (`/reports`)
- `GET /reports/summary` -> Retorna resumen global:
  ```json
  {
    "total_income": 0,
    "total_expense": 0,
    "balance": 0,
    "total_debt": 0,
    "total_debt_paid": 0,
    "total_debt_pending": 0,
    "total_loan": 0,
    "total_loan_recovered": 0,
    "total_loan_pending": 0
  }
  ```
- `GET /reports/monthly?year=2026` -> Lista de meses con income, expense y balance.
- `GET /reports/breakdown?type=expense&year=2026&month=9` -> Desglose por categoría con total y conteo.

### 5.8. Ahorros & Metas (`/savings`)
- `GET /savings/?status=` -> Lista de ahorros / metas
- `POST /savings/` -> Body: `{ name, description?, target_amount?, current_amount?, target_date?, type, icon?, color? }`
- `PATCH /savings/{id}` / `DELETE /savings/{id}`
- `GET /savings/{id}/contributions` -> Historial de aportes
- `POST /savings/{id}/contributions` -> Body: `{ amount, contribution_date, note? }`
- `DELETE /savings/{id}/contributions/{contribution_id}`

---

### 5.9. Esquema Real de Base de Datos (Supabase / PostgreSQL)

| Tabla | Columnas Principales | Tipos de Datos & Nullability |
| :--- | :--- | :--- |
| **`profiles`** | `id` (PK, uuid, NOT NULL), `full_name` (text, NULL), `avatar_url` (text, NULL), `provider` (text, NOT NULL), `currency` (text, NOT NULL), `created_at` (timestamptz, NOT NULL), `updated_at` (timestamptz, NOT NULL) |
| **`categories`** | `id` (PK, uuid, NOT NULL), `user_id` (FK, uuid, NULL), `is_global` (bool, NOT NULL), `name` (text, NOT NULL), `icon` (text, NULL), `color` (text, NULL), `type` (text, NOT NULL), `created_at` (timestamptz, NOT NULL) |
| **`transactions`** | `id` (PK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `category_id` (FK, uuid, NULL), `amount` (numeric, NOT NULL), `type` (text, NOT NULL), `description` (text, NULL), `notes` (text, NULL), `transaction_date` (date, NOT NULL), `is_recurring` (bool, NOT NULL), `recurrence` (text, NULL), `created_at` (timestamptz, NOT NULL), `updated_at` (timestamptz, NOT NULL) |
| **`debts`** | `id` (PK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `creditor_name` (text, NOT NULL), `description` (text, NULL), `total_amount` (numeric, NOT NULL), `paid_amount` (numeric, NOT NULL), `interest_rate` (numeric, NULL), `due_date` (date, NULL), `status` (text, NOT NULL), `created_at` (timestamptz, NOT NULL), `updated_at` (timestamptz, NOT NULL) |
| **`debt_payments`** | `id` (PK, uuid, NOT NULL), `debt_id` (FK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `amount` (numeric, NOT NULL), `payment_date` (date, NOT NULL), `notes` (text, NULL), `created_at` (timestamptz, NOT NULL) |
| **`loans`** | `id` (PK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `debtor_name` (text, NOT NULL), `description` (text, NULL), `total_amount` (numeric, NOT NULL), `recovered_amount` (numeric, NOT NULL), `interest_rate` (numeric, NULL), `due_date` (date, NULL), `status` (text, NOT NULL), `created_at` (timestamptz, NOT NULL), `updated_at` (timestamptz, NOT NULL) |
| **`loan_payments`** | `id` (PK, uuid, NOT NULL), `loan_id` (FK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `amount` (numeric, NOT NULL), `payment_date` (date, NOT NULL), `notes` (text, NULL), `created_at` (timestamptz, NOT NULL) |
| **`savings`** | `id` (PK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `name` (text, NOT NULL), `description` (text, NULL), `target_amount` (numeric, NULL), `current_amount` (numeric, NOT NULL), `target_date` (date, NULL), `type` (text, NOT NULL), `status` (text, NOT NULL), `icon` (text, NULL), `color` (text, NULL), `created_at` (timestamptz, NOT NULL), `updated_at` (timestamptz, NOT NULL) |
| **`saving_contributions`** | `id` (PK, uuid, NOT NULL), `saving_id` (FK, uuid, NOT NULL), `user_id` (FK, uuid, NOT NULL), `amount` (numeric, NOT NULL), `contribution_date` (date, NOT NULL), `note` (text, NULL), `created_at` (timestamptz, NOT NULL) |

---

## 6. Reglas de Flujo de Trabajo y Bitácora de Persistencia

> [!IMPORTANT]
> **Directrices de interacción y desarrollo:**
> 1. **Paso a paso (Un solo avance a la vez):** No avanzar a la siguiente tarea hasta que la actual esté completada, verificada y aprobada.
> 2. **Autorización explícita:** Solo se pueden crear o modificar archivos cuando el usuario lo autorice explícitamente en el chat.
> 3. **Bitácora continua:** `AGENTS.md` funciona como la fuente de verdad y registro de estado en cada iteración para garantizar persistencia y contexto.

---

## 7. Roadmap y Estado de Avance

- [x] **Paso 0: Inicialización del Proyecto**
  - Proyecto Next.js (App Router, Tailwind v4, TypeScript).
  - Instalación de dependencias base (`@tanstack/react-query`, `axios`, `better-auth`, `recharts`, `lucide-react`, `sonner`, `zod`, `react-hook-form`).
  - Inicialización básica de shadcn con componente `button`.
- [x] **Paso 1: Instalación de componentes UI de Shadcn**
  - Añadidos componentes: `card`, `dialog`, `dropdown-menu`, `select`, `table`, `tabs`, `badge`, `progress`, `calendar`, `popover`, `avatar`, `sonner`, `sheet`, `separator`, `tooltip`, `input`, `label`, `textarea`, `checkbox`.
- [x] **Paso 2: Sistema de Diseño y Estilos Globales**
  - Configuración de tokens de diseño y variables de tema oscuro Gris Carbón (#121212 / #1E1E1E / #10B981) en `src/app/globals.css`.
- [x] **Paso 3: Cliente API y Tipado**
  - Configuración del cliente Axios con interceptores de autenticación y manejo de errores en `src/lib/api-client.ts`.
  - Definición de tipos e interfaces TypeScript para todas las entidades del backend en `src/types/api.ts` y `src/types/index.ts`.
- [x] **Paso 4: Proveedores Globales (Providers)**
  - Configuración de QueryClientProvider (TanStack Query), TooltipProvider y Toaster (Sonner) en `src/components/providers/app-providers.tsx` y `src/app/layout.tsx`.
- [x] **Paso 5: Módulo de Autenticación**
  - Servicio `authService` con login, registro y Google OAuth (vía Supabase y puente backend).
  - Contexto global `AuthProvider` y hook `useAuth`.
  - Vistas `/(auth)/login`, `/(auth)/register` y `/(auth)/auth-callback` con React Hook Form, Zod y notificaciones toast Sonner.
- [x] **Paso 6: Layout Principal y Navegación**
  - Sidebar desktop colapsable (`src/components/layout/sidebar.tsx`) con enlaces a Dashboard, Transacciones, Deudas y Préstamos, Categorías, Reportes y Ajustes, logo oficial y estado colapsado/expandido.
  - Header superior (`src/components/layout/header.tsx`) con buscador rápido, atajo ⌘K, badge de moneda del usuario y Dropdown de perfil con `Avatar` de shadcn (usando `user.avatar_url`).
  - Drawer móvil lateral (`src/components/layout/mobile-drawer.tsx`) basado en Sheet de shadcn con navegación completa y cierre de sesión.
  - Bottom Navigation Bar móvil (`src/components/layout/bottom-nav.tsx`) con accesos directos a Inicio, Movimientos, Deudas, Reportes y Menú.
  - Layout autenticado (`src/app/dashboard/layout.tsx`) con protección de sesión, pantalla de carga y vista base `src/app/dashboard/page.tsx`.
- [x] **Paso 7: Vistas del Dashboard y Módulos Financieros**
  - [x] **Categorías (`/dashboard/categories`)**: Gestor visual completo con servicio `categoriesService`, hooks `useCategories`, `useCreateCategory`, `useDeleteCategory`, selector visual de iconos de Lucide, paleta de colores y modales `CreateCategoryDialog` y `DeleteCategoryDialog` en shadcn.
  - [x] **Transacciones (`/dashboard/transactions`)**: Módulo completo con servicio `transactionsService`, hooks `useTransactions`, `useCreateTransaction`, `useUpdateTransaction`, `useDeleteTransaction`, filtros avanzados (tipo, categoría, mes, año, buscador), tabla interactiva de movimientos con badges semánticos y modales `TransactionFormDialog` y `DeleteTransactionDialog` en shadcn con feedback Sonner.
  - [x] **Dashboard KPIs y gráficos en vivo**: Conexión reactiva con `reportsService.getSummary()` (`/reports/summary`), cálculo de métricas financieras en tiempo real, balance disponible, progreso de amortización y cobranzas, y tabla de movimientos recientes.
  - [x] **Deudas y Préstamos (`/dashboard/debts-loans`)**: Módulo completo con servicios `debtsService` y `loansService`, hooks `useDebts`, `useLoans`, `useDebtPayments`, `useLoanPayments`, pestañas ("Lo que debo" y "Lo que me deben"), KPIs de amortización/recuperación en tiempo real, filtros por estado (`pending`, `partial`, `paid`/`recovered`, `overdue`, `defaulted`), vista alternable Grid/Tabla, y modales atómicos `DebtFormDialog`, `LoanFormDialog`, `DebtPaymentDialog`, `LoanPaymentDialog`, `DeleteDebtDialog` y `DeleteLoanDialog` con Sonner toasts.
  - [x] **Reportes y Estadísticas (`/dashboard/reports`)**: Módulo completo con gráficos oficiales de Shadcn (Recharts: `BarChart` para evolución mensual de 12 meses y `PieChart` tipo dona para desglose por categorías), KPIs de flujo neto y tasa de ahorro, filtros por año/mes, tablas detalladas de participación y generador de reportes en PDF de alta fidelidad vía API Route con Puppeteer (`/api/reports/export-pdf`) y diálogo modal `ExportReportDialog`. Formateo unificado de valores monetarios con separador de miles (`,`) y decimales.
  - [x] **Configuración y Perfil de Usuario (`/dashboard/settings`)**: Módulo completo con servicio `usersService`, hooks `useUserProfile`, `useUpdateProfile`, `useUploadAvatar`, formulario reactivo con React Hook Form + Zod, selector de moneda con vista previa en tiempo real, subida de foto de perfil (avatar multipart), tarjeta de seguridad de cuenta con ID copiable, estado de proveedor de autenticación y cierre de sesión.

