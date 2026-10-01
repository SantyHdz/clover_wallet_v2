import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { MonthlyReport, CategoryBreakdown, ReportSummary, Transaction } from '@/types';
import { formatAmount } from '@/lib/utils';

interface ExportPdfPayload {
  reportType: 'monthly' | 'annual';
  year: number;
  month?: number;
  userName?: string;
  userEmail?: string;
  currency?: string;
  summary?: ReportSummary;
  monthlyData?: MonthlyReport[];
  breakdown?: CategoryBreakdown[];
  transactions?: Transaction[];
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export async function POST(req: NextRequest) {
  let browser = null;

  try {
    const payload: ExportPdfPayload = await req.json();
    const {
      reportType,
      year,
      month,
      userName = 'Usuario',
      userEmail,
      currency = 'USD',
      summary,
      monthlyData = [],
      breakdown = [],
      transactions = [],
    } = payload;

    const currencySymbol = currency === 'COP' ? 'COL$' : currency === 'EUR' ? '€' : '$';
    const monthName = month ? MONTH_NAMES[month - 1] : '';
    const reportTitle =
      reportType === 'monthly'
        ? `Reporte Financiero Mensual — ${monthName} ${year}`
        : `Informe Financiero Anual Consolidado — ${year}`;

    const totalIncome = Number(summary?.total_income || 0);
    const totalExpense = Number(summary?.total_expense || 0);
    const balance = Number(summary?.balance || 0);
    const totalDebt = Number(summary?.total_debt || 0);
    const totalDebtPaid = Number(summary?.total_debt_paid || 0);
    const totalDebtPending = Number(summary?.total_debt_pending || 0);
    const totalLoan = Number(summary?.total_loan || 0);
    const totalLoanRecovered = Number(summary?.total_loan_recovered || 0);
    const totalLoanPending = Number(summary?.total_loan_pending || 0);

    const savingsRate =
      totalIncome > 0
        ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
        : 0;

    const generationDate = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date());

    // Generate HTML for Monthly Table (Annual report)
    const monthlyRowsHtml = monthlyData
      .map((item, idx) => {
        const mName = MONTH_NAMES[item.month - 1] || `Mes ${item.month}`;
        const bal = Number(item.balance || 0);
        const balColor = bal >= 0 ? '#059669' : '#DC2626';
        const bgStyle = idx % 2 === 1 ? 'background-color: #F8FAFC;' : 'background-color: #FFFFFF;';
        return `
          <tr style="${bgStyle}">
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #1E293B;">${mName}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #16A34A; font-family: monospace; font-weight: 600;">+${currencySymbol}${formatAmount(item.total_income)}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #DC2626; font-family: monospace; font-weight: 600;">-${currencySymbol}${formatAmount(item.total_expense)}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: ${balColor}; font-family: monospace; font-weight: 700;">${bal >= 0 ? '+' : ''}${currencySymbol}${formatAmount(bal)}</td>
          </tr>
        `;
      })
      .join('');

    // Generate HTML for Breakdown Table
    const totalBreakdownAmount = breakdown.reduce((sum, item) => sum + Number(item.total ?? item.total_amount ?? 0), 0);

    const breakdownRowsHtml = breakdown
      .map((cat, idx) => {
        const color = cat.category_color || '#10B981';
        const rawAmount = Number(cat.total ?? cat.total_amount ?? 0);
        const percent = cat.percentage ?? (totalBreakdownAmount > 0 ? Math.round((rawAmount / totalBreakdownAmount) * 100) : 0);
        const bgStyle = idx % 2 === 1 ? 'background-color: #F8FAFC;' : 'background-color: #FFFFFF;';
        return `
          <tr style="${bgStyle}">
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; color: #1E293B;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; display: inline-block; flex-shrink: 0;"></span>
                <span style="font-weight: 600; font-size: 11px;">${cat.category_name}</span>
              </div>
            </td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #64748B; font-size: 11px;">${cat.count} movs</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #0F172A; font-family: monospace; font-weight: 700; font-size: 11px;">${currencySymbol}${formatAmount(rawAmount)}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #059669; font-weight: 700; font-size: 11px;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                <div style="width: 45px; height: 6px; background-color: #E2E8F0; border-radius: 3px; overflow: hidden;">
                  <div style="width: ${percent}%; height: 100%; background-color: #10B981; border-radius: 3px;"></div>
                </div>
                <span>${percent}%</span>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    // Generate HTML for Transactions Table
    const transactionsRowsHtml = transactions
      .slice(0, 35) // top 35 transactions
      .map((tx, idx) => {
        const isInc = tx.type === 'income';
        const color = isInc ? '#16A34A' : '#DC2626';
        const bgStyle = idx % 2 === 1 ? 'background-color: #F8FAFC;' : 'background-color: #FFFFFF;';
        return `
          <tr style="${bgStyle}">
            <td style="padding: 7px 12px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 10px; font-family: monospace;">${tx.transaction_date}</td>
            <td style="padding: 7px 12px; border-bottom: 1px solid #E2E8F0; color: #1E293B; font-weight: 600; font-size: 11px;">${tx.description || 'Sin concepto'}</td>
            <td style="padding: 7px 12px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 10px;">
              <span style="background-color: #F1F5F9; border: 1px solid #E2E8F0; padding: 2px 6px; border-radius: 4px;">
                ${tx.category?.name || 'General'}
              </span>
            </td>
            <td style="padding: 7px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: ${color}; font-family: monospace; font-weight: 700; font-size: 11px;">
              ${isInc ? '+' : '-'}${currencySymbol}${formatAmount(tx.amount)}
            </td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FFFFFF;
            color: #0F172A;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.45;
            position: relative;
          }

          /* ── Marca de Agua Vectorizada de Clover ── */
          .watermark-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 460px;
            height: 460px;
            pointer-events: none;
            z-index: 0;
            opacity: 0.038;
          }

          .content-wrapper {
            position: relative;
            z-index: 1;
          }

          /* ── Cabecera Ejecutiva ── */
          .top-bar {
            height: 4px;
            background: linear-gradient(90deg, #10B981 0%, #059669 100%);
            border-radius: 2px;
            margin-bottom: 16px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 14px;
            border-bottom: 1.5px solid #E2E8F0;
            margin-bottom: 16px;
          }

          .brand-box {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .brand-logo {
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
          }

          .brand-title {
            font-size: 18px;
            font-weight: 800;
            color: #0F172A;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .brand-title span {
            color: #10B981;
          }

          .brand-sub {
            font-size: 10px;
            color: #64748B;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 2px 0 0 0;
          }

          .meta-box {
            text-align: right;
            font-size: 10px;
            color: #475569;
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            padding: 8px 12px;
            border-radius: 8px;
            line-height: 1.5;
          }
          .meta-box strong {
            color: #0F172A;
          }
          .meta-box .email {
            color: #10B981;
            font-weight: 600;
          }

          /* ── Título del Reporte ── */
          .report-heading {
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .report-heading h1 {
            font-size: 16px;
            font-weight: 800;
            color: #0F172A;
            margin: 0 0 3px 0;
          }
          .report-heading p {
            color: #64748B;
            font-size: 11px;
            margin: 0;
          }
          .badge-status {
            background-color: #ECFDF5;
            color: #059669;
            border: 1px solid #A7F3D0;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }

          /* ── KPIs Ejecutivos (4 Cards) ── */
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          .kpi-card {
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 10px 12px;
          }
          .kpi-label {
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748B;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .kpi-value {
            font-size: 16px;
            font-weight: 800;
            font-family: monospace;
          }
          .kpi-sub {
            font-size: 9px;
            color: #94A3B8;
            margin-top: 2px;
          }

          /* ── Deudas y Préstamos Summary ── */
          .debts-loans-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          .dl-card {
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 10px 12px;
          }

          /* ── Tablas ── */
          .section {
            margin-bottom: 16px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #E2E8F0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #FFFFFF;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #E2E8F0;
          }
          th {
            background-color: #F1F5F9;
            color: #475569;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 7px 12px;
            text-align: left;
            font-weight: 700;
            border-bottom: 1px solid #CBD5E1;
          }

          /* ── Footer ── */
          .footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #E2E8F0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9.5px;
            color: #94A3B8;
          }
        </style>
      </head>
      <body>
        <!-- Marca de Agua SVG de Clover en el Fondo -->
        <div class="watermark-container">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 85C88 50 45 50 45 85C45 115 90 130 100 160C110 130 155 115 155 85C155 50 112 50 100 85Z" fill="#10B981" />
            <path d="M85 100C50 88 50 45 85 45C115 45 130 90 160 100C130 110 115 155 85 155C50 155 50 112 85 100Z" fill="#10B981" />
            <circle cx="100" cy="100" r="18" fill="#059669" />
          </svg>
        </div>

        <div class="content-wrapper">
          <!-- Línea de Acento Superior -->
          <div class="top-bar"></div>

          <!-- Cabecera Oficial -->
          <div class="header">
            <div class="brand-box">
              <div class="brand-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z"/>
                  <path d="M6 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z"/>
                  <path d="M18 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z"/>
                  <path d="M12 14a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z"/>
                  <path d="M12 18v4"/>
                </svg>
              </div>
              <div>
                <h2 class="brand-title">Clover<span>Wallet</span></h2>
                <p class="brand-sub">Sistema de Gestión Financiera & Balances</p>
              </div>
            </div>

            <div class="meta-box">
              <div>Titular: <strong>${userName}</strong></div>
              <div>Correo: <span class="email">${userEmail || 'Cuenta Verificada'}</span></div>
              <div>Periodo: <strong>${reportType === 'monthly' ? `${monthName} ${year}` : `Año ${year}`}</strong></div>
              <div>Moneda: <strong>${currency.toUpperCase()}</strong> • Emisión: ${generationDate}</div>
            </div>
          </div>

          <!-- Título y Estado -->
          <div class="report-heading">
            <div>
              <h1>${reportTitle}</h1>
              <p>Informe financiero oficial consolidado con tecnología Clover Wallet.</p>
            </div>
            <div class="badge-status">
              ✓ Balance Verificado
            </div>
          </div>

          <!-- 4 KPIs Ejecutivos -->
          <div class="kpi-grid">
            <div class="kpi-card" style="border-top: 3px solid #16A34A;">
              <div class="kpi-label">Total Ingresos</div>
              <div class="kpi-value" style="color: #16A34A;">+${currencySymbol}${formatAmount(totalIncome)}</div>
              <div class="kpi-sub">Entradas acumuladas</div>
            </div>

            <div class="kpi-card" style="border-top: 3px solid #DC2626;">
              <div class="kpi-label">Total Gastos</div>
              <div class="kpi-value" style="color: #DC2626;">-${currencySymbol}${formatAmount(totalExpense)}</div>
              <div class="kpi-sub">Egresos computados</div>
            </div>

            <div class="kpi-card" style="border-top: 3px solid ${balance >= 0 ? '#10B981' : '#DC2626'};">
              <div class="kpi-label">Balance Neto</div>
              <div class="kpi-value" style="color: ${balance >= 0 ? '#059669' : '#DC2626'};">
                ${balance >= 0 ? '+' : ''}${currencySymbol}${formatAmount(balance)}
              </div>
              <div class="kpi-sub">Diferencial de flujo</div>
            </div>

            <div class="kpi-card" style="border-top: 3px solid #2563EB;">
              <div class="kpi-label">Tasa de Ahorro</div>
              <div class="kpi-value" style="color: #2563EB;">${savingsRate}%</div>
              <div class="kpi-sub">Retención neta</div>
            </div>
          </div>

          <!-- Deudas y Préstamos Summary -->
          <div class="debts-loans-grid">
            <div class="dl-card" style="border-left: 3px solid #EA580C;">
              <div style="font-size: 10.5px; font-weight: 700; color: #EA580C; text-transform: uppercase; margin-bottom: 6px;">
                💳 Estado de Deudas (Por Pagar)
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span style="color: #64748B;">Total Deuda Registrada:</span>
                <strong style="color: #0F172A; font-family: monospace;">${currencySymbol}${formatAmount(totalDebt)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span style="color: #64748B;">Amortizado / Pagado:</span>
                <strong style="color: #16A34A; font-family: monospace;">${currencySymbol}${formatAmount(totalDebtPaid)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Saldo Pendiente por Liquidar:</span>
                <strong style="color: #EA580C; font-family: monospace;">${currencySymbol}${formatAmount(totalDebtPending)}</strong>
              </div>
            </div>

            <div class="dl-card" style="border-left: 3px solid #2563EB;">
              <div style="font-size: 10.5px; font-weight: 700; color: #2563EB; text-transform: uppercase; margin-bottom: 6px;">
                🤝 Estado de Préstamos (Por Cobrar)
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span style="color: #64748B;">Total Prestado a Terceros:</span>
                <strong style="color: #0F172A; font-family: monospace;">${currencySymbol}${formatAmount(totalLoan)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span style="color: #64748B;">Cobrado / Recuperado:</span>
                <strong style="color: #16A34A; font-family: monospace;">${currencySymbol}${formatAmount(totalLoanRecovered)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Saldo por Recuperar:</span>
                <strong style="color: #2563EB; font-family: monospace;">${currencySymbol}${formatAmount(totalLoanPending)}</strong>
              </div>
            </div>
          </div>

          ${
            reportType === 'annual' && monthlyData.length > 0
              ? `
            <div class="section">
              <div class="section-title">
                <span>Evolución Mensual del Año ${year}</span>
                <span style="font-size: 10px; color: #64748B; font-weight: normal;">12 Meses Consolidados</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th style="text-align: right;">Ingresos</th>
                    <th style="text-align: right;">Gastos</th>
                    <th style="text-align: right;">Balance Neto</th>
                  </tr>
                </thead>
                <tbody>
                  ${monthlyRowsHtml}
                </tbody>
              </table>
            </div>
          `
              : ''
          }

          ${
            breakdown.length > 0
              ? `
            <div class="section">
              <div class="section-title">
                <span>Desglose por Categoría (${reportType === 'monthly' ? monthName : `Año ${year}`})</span>
                <span style="font-size: 10px; color: #64748B; font-weight: normal;">${breakdown.length} Categorías con Movimiento</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th style="text-align: center;">Transacciones</th>
                    <th style="text-align: right;">Monto Total</th>
                    <th style="text-align: right;">Participación</th>
                  </tr>
                </thead>
                <tbody>
                  ${breakdownRowsHtml}
                </tbody>
              </table>
            </div>
          `
              : ''
          }

          ${
            reportType === 'monthly' && transactions.length > 0
              ? `
            <div class="section">
              <div class="section-title">
                <span>Detalle de Movimientos — ${monthName} ${year}</span>
                <span style="font-size: 10px; color: #64748B; font-weight: normal;">${Math.min(transactions.length, 35)} registros</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Concepto / Descripción</th>
                    <th>Categoría</th>
                    <th style="text-align: right;">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  ${transactionsRowsHtml}
                </tbody>
              </table>
            </div>
          `
              : ''
          }

          <!-- Footer Oficial -->
          <div class="footer">
            <div>☘ <strong>Clover Wallet</strong> — Control Financiero Inteligente</div>
            <div>Documento Confidencial emitido para <strong>${userName}</strong> (${userEmail || 'Titular'})</div>
            <div>Página 1 de 1</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Launch Puppeteer headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm',
      },
    });

    await browser.close();
    browser = null;

    const fileName =
      reportType === 'monthly'
        ? `Reporte_Clover_${year}_${month || 1}.pdf`
        : `Reporte_Anual_Clover_${year}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF with Puppeteer:', error);
    if (browser) {
      await (browser as any).close().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Error al generar el reporte en PDF', detail: error?.message },
      { status: 500 }
    );
  }
}
