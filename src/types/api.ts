// Contratos y modelos de TypeScript para Clover Wallet Backend & Base de Datos Supabase

export type TransactionType = 'income' | 'expense';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type DebtStatus = 'pending' | 'partial' | 'paid' | 'overdue';
export type LoanStatus = 'pending' | 'partial' | 'recovered' | 'overdue' | 'defaulted';

export type CategoryType = 'income' | 'expense' | 'both';
export type SavingStatus = 'active' | 'completed' | 'paused' | 'cancelled' | string;

// --- Auth ---
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

// --- Usuario & Perfil (`profiles`) ---
export interface User {
  id: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  provider: string;
  currency: string;
  created_at: string;
  updated_at?: string;
}

export interface UpdateUserPayload {
  full_name?: string;
  currency?: string;
}

// --- Categorías (`categories`) ---
export interface Category {
  id: string;
  user_id?: string | null;
  is_global: boolean;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: CategoryType;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  color?: string;
  type: CategoryType;
}

// --- Transacciones (`transactions`) ---
export interface Transaction {
  id: string;
  user_id: string;
  category_id?: string | null;
  category?: Category | null;
  amount: number;
  type: TransactionType;
  description?: string | null;
  notes?: string | null;
  transaction_date: string;
  is_recurring: boolean;
  recurrence?: RecurrenceType | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  category_id?: string | null;
  amount: number;
  type: TransactionType;
  description?: string;
  notes?: string;
  transaction_date: string;
  is_recurring?: boolean;
  recurrence?: RecurrenceType;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

export interface TransactionFilterParams {
  type?: TransactionType;
  category_id?: string;
  year?: number;
  month?: number;
  limit?: number;
  offset?: number;
}

// --- Deudas (`debts`) ---
export interface Debt {
  id: string;
  user_id: string;
  creditor_name: string;
  description?: string | null;
  total_amount: number;
  paid_amount: number;
  remaining_amount?: number;
  interest_rate?: number | null;
  due_date?: string | null;
  status: DebtStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateDebtPayload {
  creditor_name: string;
  description?: string;
  total_amount: number;
  interest_rate?: number;
  due_date?: string;
}

export interface UpdateDebtPayload extends Partial<CreateDebtPayload> {
  status?: DebtStatus;
  paid_amount?: number;
}

// --- Abonos a Deudas (`debt_payments`) ---
export interface DebtPayment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  notes?: string | null;
  created_at: string;
}

export interface CreateDebtPaymentPayload {
  amount: number;
  payment_date: string;
  notes?: string;
}

// --- Préstamos (`loans`) ---
export interface Loan {
  id: string;
  user_id: string;
  debtor_name: string;
  description?: string | null;
  total_amount: number;
  recovered_amount: number;
  remaining_amount?: number;
  interest_rate?: number | null;
  due_date?: string | null;
  status: LoanStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateLoanPayload {
  debtor_name: string;
  description?: string;
  total_amount: number;
  interest_rate?: number;
  due_date?: string;
}

export interface UpdateLoanPayload extends Partial<CreateLoanPayload> {
  status?: LoanStatus;
  recovered_amount?: number;
}

// --- Cobros / Pagos de Préstamos (`loan_payments`) ---
export interface LoanPayment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  notes?: string | null;
  created_at: string;
}

export interface CreateLoanPaymentPayload {
  amount: number;
  payment_date: string;
  notes?: string;
}

// --- Ahorros & Metas (`savings`) ---
export interface Saving {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  target_amount?: number | null;
  current_amount: number;
  target_date?: string | null;
  type: string;
  status: SavingStatus;
  icon?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSavingPayload {
  name: string;
  description?: string;
  target_amount?: number;
  current_amount?: number;
  target_date?: string;
  type: string;
  icon?: string;
  color?: string;
}

export interface UpdateSavingPayload extends Partial<CreateSavingPayload> {
  status?: SavingStatus;
}

// --- Aportes a Ahorros (`saving_contributions`) ---
export interface SavingContribution {
  id: string;
  saving_id: string;
  user_id: string;
  amount: number;
  contribution_date: string;
  note?: string | null;
  created_at: string;
}

export interface CreateSavingContributionPayload {
  amount: number;
  contribution_date: string;
  note?: string;
}

// --- Reportes & Analíticas ---
export interface ReportSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  total_debt: number;
  total_debt_paid: number;
  total_debt_pending: number;
  total_loan: number;
  total_loan_recovered: number;
  total_loan_pending: number;
  total_savings?: number;
}

export interface MonthlyReport {
  month: number;
  month_name?: string;
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category_id: string;
  category_name: string;
  category_icon?: string | null;
  category_color?: string | null;
  total_amount: number;
  count: number;
  percentage?: number;
}

// --- Errores API ---
export interface ApiErrorResponse {
  detail?: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
  message?: string;
}
