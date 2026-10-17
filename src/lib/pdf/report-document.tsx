import path from 'path';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { CategoryBreakdown, MonthlyReport, ReportSummary, Transaction } from '@/types';
import { formatAmount } from '@/lib/utils';

export interface ReportDocumentProps {
  reportType: 'monthly' | 'annual';
  year: number;
  month?: number;
  userName: string;
  userEmail?: string;
  currency: string;
  summary?: ReportSummary;
  monthlyData: MonthlyReport[];
  breakdown: CategoryBreakdown[];
  transactions: Transaction[];
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const C = {
  ink: '#0F172A',
  text: '#1E293B',
  muted: '#64748B',
  faint: '#94A3B8',
  line: '#E2E8F0',
  soft: '#F8FAFC',
  head: '#F1F5F9',
  green: '#16A34A',
  emerald: '#10B981',
  emeraldDark: '#059669',
  red: '#DC2626',
  blue: '#2563EB',
  orange: '#EA580C',
};

const LOGO_PATH = path.join(process.cwd(), 'public', 'logo.png');

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 54, paddingHorizontal: 34, fontFamily: 'Helvetica', fontSize: 9, color: C.ink },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  watermarkImg: { width: 340, height: 340, opacity: 0.06 },
  topBar: { height: 4, backgroundColor: C.emerald, borderRadius: 2, marginBottom: 14 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottomWidth: 1.5, borderBottomColor: C.line, marginBottom: 14 },
  brandBox: { flexDirection: 'row', alignItems: 'center' },
  brandLogo: { width: 38, height: 38, marginRight: 10 },
  brandTitle: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: C.ink },
  brandSub: { fontSize: 7.5, color: C.muted, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.4 },
  metaBox: { backgroundColor: C.soft, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10, alignItems: 'flex-end' },
  metaLine: { fontSize: 8, color: '#475569', marginBottom: 1.5 },
  metaStrong: { fontFamily: 'Helvetica-Bold', color: C.ink },

  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  h1: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 3 },
  headingSub: { fontSize: 9, color: C.muted },
  badge: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.emeraldDark, textTransform: 'uppercase' },

  kpiRow: { flexDirection: 'row', marginBottom: 14 },
  kpi: { flex: 1, backgroundColor: C.soft, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 },
  kpiLabel: { fontSize: 7.5, textTransform: 'uppercase', color: C.muted, fontFamily: 'Helvetica-Bold', marginBottom: 4, letterSpacing: 0.4 },
  kpiValue: { fontSize: 13, fontFamily: 'Courier-Bold' },
  kpiSub: { fontSize: 7.5, color: C.faint, marginTop: 2 },

  dlRow: { flexDirection: 'row', marginBottom: 14 },
  dlCard: { flex: 1, backgroundColor: C.soft, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 },
  dlTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 6 },
  dlLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  dlLabel: { color: C.muted },
  mono: { fontFamily: 'Courier-Bold' },

  section: { marginBottom: 14 },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.line, paddingBottom: 4, marginBottom: 8 },
  sectionTitleText: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.ink },
  sectionMeta: { fontSize: 8, color: C.muted },

  table: { borderWidth: 1, borderColor: C.line, borderRadius: 6 },
  tr: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.line },
  th: { backgroundColor: C.head, borderBottomColor: '#CBD5E1' },
  thText: { fontSize: 7.5, textTransform: 'uppercase', color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 0.4 },
  td: { paddingVertical: 6, paddingHorizontal: 10 },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },

  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  barTrack: { width: 42, height: 5, backgroundColor: C.line, borderRadius: 3, marginRight: 6 },
  barFill: { height: 5, backgroundColor: C.emerald, borderRadius: 3 },
  chip: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: C.line, borderRadius: 4, paddingVertical: 1.5, paddingHorizontal: 5 },

  footer: { position: 'absolute', left: 34, right: 34, bottom: 22, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: C.faint },
});

function Row({ i, last, children }: { i: number; last: boolean; children: React.ReactNode }) {
  return (
    <View
      wrap={false}
      style={[s.tr, { backgroundColor: i % 2 === 1 ? C.soft : '#FFFFFF' }, last ? { borderBottomWidth: 0 } : {}]}
    >
      {children}
    </View>
  );
}

export function ReportDocument({
  reportType, year, month, userName, userEmail, currency,
  summary, monthlyData, breakdown, transactions,
}: ReportDocumentProps) {
  const sym = currency === 'COP' ? 'COL$' : currency === 'EUR' ? '€' : '$';
  const money = (n: number | string | null | undefined) => `${sym}${formatAmount(n)}`;
  const monthName = month ? MONTH_NAMES[month - 1] : '';
  const periodLabel = reportType === 'monthly' ? `${monthName} ${year}` : `Año ${year}`;
  const reportTitle =
    reportType === 'monthly'
      ? `Reporte Financiero Mensual — ${monthName} ${year}`
      : `Informe Financiero Anual Consolidado — ${year}`;

  const n = (v: unknown) => Number(v || 0);
  const totalIncome = n(summary?.total_income);
  const totalExpense = n(summary?.total_expense);
  const balance = n(summary?.balance);
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const generationDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(new Date());

  const totalBreakdown = breakdown.reduce((sum, b) => sum + n(b.total ?? b.total_amount), 0);
  const txs = transactions.slice(0, 35);

  const kpis = [
    { label: 'Total Ingresos', value: `+${money(totalIncome)}`, sub: 'Entradas acumuladas', color: C.green, accent: C.green },
    { label: 'Total Gastos', value: `-${money(totalExpense)}`, sub: 'Egresos computados', color: C.red, accent: C.red },
    { label: 'Balance Neto', value: `${balance >= 0 ? '+' : ''}${money(balance)}`, sub: 'Diferencial de flujo', color: balance >= 0 ? C.emeraldDark : C.red, accent: balance >= 0 ? C.emerald : C.red },
    { label: 'Tasa de Ahorro', value: `${savingsRate}%`, sub: 'Retención neta', color: C.blue, accent: C.blue },
  ];

  const debtLines = [
    ['Total Deuda Registrada', n(summary?.total_debt), C.ink],
    ['Amortizado / Pagado', n(summary?.total_debt_paid), C.green],
    ['Saldo Pendiente por Liquidar', n(summary?.total_debt_pending), C.orange],
  ] as const;
  const loanLines = [
    ['Total Prestado a Terceros', n(summary?.total_loan), C.ink],
    ['Cobrado / Recuperado', n(summary?.total_loan_recovered), C.green],
    ['Saldo por Recuperar', n(summary?.total_loan_pending), C.blue],
  ] as const;

  return (
    <Document title={reportTitle} author="Clover Wallet" creator="Clover Wallet">
      <Page size="A4" style={s.page}>
        {/* Marca de agua: se repite en todas las páginas */}
        <View style={s.watermark} fixed>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={LOGO_PATH} style={s.watermarkImg} />
        </View>

        <View style={s.topBar} />

        <View style={s.header}>
          <View style={s.brandBox}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_PATH} style={s.brandLogo} />
            <View>
              <Text style={s.brandTitle}>
                Clover<Text style={{ color: C.emerald }}>Wallet</Text>
              </Text>
              <Text style={s.brandSub}>Sistema de Gestión Financiera & Balances</Text>
            </View>
          </View>
          <View style={s.metaBox}>
            <Text style={s.metaLine}>Titular: <Text style={s.metaStrong}>{userName}</Text></Text>
            <Text style={s.metaLine}>Correo: <Text style={{ color: C.emerald, fontFamily: 'Helvetica-Bold' }}>{userEmail || 'Cuenta Verificada'}</Text></Text>
            <Text style={s.metaLine}>Periodo: <Text style={s.metaStrong}>{periodLabel}</Text></Text>
            <Text style={s.metaLine}>Moneda: <Text style={s.metaStrong}>{currency.toUpperCase()}</Text> • Emisión: {generationDate}</Text>
          </View>
        </View>

        <View style={s.heading}>
          <View>
            <Text style={s.h1}>{reportTitle}</Text>
            <Text style={s.headingSub}>Informe financiero oficial consolidado con tecnología Clover Wallet.</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeText}>Balance Verificado</Text>
          </View>
        </View>

        <View style={s.kpiRow}>
          {kpis.map((k, i) => (
            <View key={k.label} style={[s.kpi, { borderTopWidth: 3, borderTopColor: k.accent }, i < kpis.length - 1 ? { marginRight: 8 } : {}]}>
              <Text style={s.kpiLabel}>{k.label}</Text>
              <Text style={[s.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={s.kpiSub}>{k.sub}</Text>
            </View>
          ))}
        </View>

        <View style={s.dlRow} wrap={false}>
          {[
            { title: 'Estado de Deudas (Por Pagar)', color: C.orange, lines: debtLines, gap: true },
            { title: 'Estado de Préstamos (Por Cobrar)', color: C.blue, lines: loanLines, gap: false },
          ].map((card) => (
            <View key={card.title} style={[s.dlCard, { borderLeftWidth: 3, borderLeftColor: card.color }, card.gap ? { marginRight: 10 } : {}]}>
              <Text style={[s.dlTitle, { color: card.color }]}>{card.title}</Text>
              {card.lines.map(([label, value, color]) => (
                <View key={label} style={s.dlLine}>
                  <Text style={s.dlLabel}>{label}:</Text>
                  <Text style={[s.mono, { color }]}>{money(value)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {reportType === 'annual' && monthlyData.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitle}>
              <Text style={s.sectionTitleText}>Evolución Mensual del Año {year}</Text>
              <Text style={s.sectionMeta}>12 Meses Consolidados</Text>
            </View>
            <View style={s.table}>
              <View style={[s.tr, s.th]} fixed>
                <Text style={[s.td, s.thText, { width: '28%' }]}>Mes</Text>
                <Text style={[s.td, s.thText, s.right, { width: '24%' }]}>Ingresos</Text>
                <Text style={[s.td, s.thText, s.right, { width: '24%' }]}>Gastos</Text>
                <Text style={[s.td, s.thText, s.right, { width: '24%' }]}>Balance Neto</Text>
              </View>
              {monthlyData.map((m, i) => {
                const bal = n(m.balance);
                return (
                  <Row key={m.month} i={i} last={i === monthlyData.length - 1}>
                    <Text style={[s.td, { width: '28%', fontFamily: 'Helvetica-Bold', color: C.text }]}>{MONTH_NAMES[m.month - 1] || `Mes ${m.month}`}</Text>
                    <Text style={[s.td, s.right, s.mono, { width: '24%', color: C.green }]}>+{money(m.total_income)}</Text>
                    <Text style={[s.td, s.right, s.mono, { width: '24%', color: C.red }]}>-{money(m.total_expense)}</Text>
                    <Text style={[s.td, s.right, s.mono, { width: '24%', color: bal >= 0 ? C.emeraldDark : C.red }]}>{bal >= 0 ? '+' : ''}{money(bal)}</Text>
                  </Row>
                );
              })}
            </View>
          </View>
        )}

        {breakdown.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitle}>
              <Text style={s.sectionTitleText}>Desglose por Categoría ({reportType === 'monthly' ? monthName : `Año ${year}`})</Text>
              <Text style={s.sectionMeta}>{breakdown.length} Categorías con Movimiento</Text>
            </View>
            <View style={s.table}>
              <View style={[s.tr, s.th]} fixed>
                <Text style={[s.td, s.thText, { width: '38%' }]}>Categoría</Text>
                <Text style={[s.td, s.thText, s.center, { width: '18%' }]}>Transacciones</Text>
                <Text style={[s.td, s.thText, s.right, { width: '24%' }]}>Monto Total</Text>
                <Text style={[s.td, s.thText, s.right, { width: '20%' }]}>Participación</Text>
              </View>
              {breakdown.map((cat, i) => {
                const amount = n(cat.total ?? cat.total_amount);
                const percent = cat.percentage ?? (totalBreakdown > 0 ? Math.round((amount / totalBreakdown) * 100) : 0);
                return (
                  <Row key={`${cat.category_id ?? cat.category_name}-${i}`} i={i} last={i === breakdown.length - 1}>
                    <View style={[s.td, { width: '38%', flexDirection: 'row', alignItems: 'center' }]}>
                      <View style={[s.dot, { backgroundColor: cat.category_color || C.emerald }]} />
                      <Text style={{ fontFamily: 'Helvetica-Bold', color: C.text }}>{cat.category_name}</Text>
                    </View>
                    <Text style={[s.td, s.center, { width: '18%', color: C.muted }]}>{cat.count} movs</Text>
                    <Text style={[s.td, s.right, s.mono, { width: '24%' }]}>{money(amount)}</Text>
                    <View style={[s.td, { width: '20%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }]}>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, { width: `${Math.min(100, Math.max(0, percent))}%` }]} />
                      </View>
                      <Text style={{ fontFamily: 'Helvetica-Bold', color: C.emeraldDark }}>{percent}%</Text>
                    </View>
                  </Row>
                );
              })}
            </View>
          </View>
        )}

        {reportType === 'monthly' && txs.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitle}>
              <Text style={s.sectionTitleText}>Detalle de Movimientos — {monthName} {year}</Text>
              <Text style={s.sectionMeta}>{txs.length} registros</Text>
            </View>
            <View style={s.table}>
              <View style={[s.tr, s.th]} fixed>
                <Text style={[s.td, s.thText, { width: '16%' }]}>Fecha</Text>
                <Text style={[s.td, s.thText, { width: '38%' }]}>Concepto / Descripción</Text>
                <Text style={[s.td, s.thText, { width: '24%' }]}>Categoría</Text>
                <Text style={[s.td, s.thText, s.right, { width: '22%' }]}>Monto</Text>
              </View>
              {txs.map((tx, i) => {
                const income = tx.type === 'income';
                return (
                  <Row key={tx.id ?? i} i={i} last={i === txs.length - 1}>
                    <Text style={[s.td, { width: '16%', color: C.muted, fontFamily: 'Courier', fontSize: 8 }]}>{tx.transaction_date}</Text>
                    <Text style={[s.td, { width: '38%', fontFamily: 'Helvetica-Bold', color: C.text }]}>{tx.description || 'Sin concepto'}</Text>
                    <View style={[s.td, { width: '24%', flexDirection: 'row' }]}>
                      <View style={s.chip}>
                        <Text style={{ fontSize: 8, color: C.muted }}>{tx.category?.name || 'General'}</Text>
                      </View>
                    </View>
                    <Text style={[s.td, s.right, s.mono, { width: '22%', color: income ? C.green : C.red }]}>{income ? '+' : '-'}{money(tx.amount)}</Text>
                  </Row>
                );
              })}
            </View>
          </View>
        )}

        <View style={s.footer} fixed>
          <Text>Clover Wallet — Control Financiero Inteligente</Text>
          <Text>Documento confidencial emitido para {userName} ({userEmail || 'Titular'})</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
