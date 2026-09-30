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
      .map((item) => {
        const mName = MONTH_NAMES[item.month - 1] || `Mes ${item.month}`;
        const bal = Number(item.balance || 0);
        const balColor = bal >= 0 ? '#10B981' : '#EF4444';
        return `
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; font-weight: 600; color: #FFFFFF;">${mName}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: #22C55E; font-family: monospace;">+${currencySymbol}${formatAmount(item.total_income)}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: #EF4444; font-family: monospace;">-${currencySymbol}${formatAmount(item.total_expense)}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: ${balColor}; font-family: monospace; font-weight: 700;">${bal >= 0 ? '+' : ''}${currencySymbol}${formatAmount(bal)}</td>
          </tr>
        `;
      })
      .join('');

    // Generate HTML for Breakdown Table
    const breakdownRowsHtml = breakdown
      .map((cat) => {
        const color = cat.category_color || '#10B981';
        return `
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; color: #FFFFFF;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; display: inline-block;"></span>
                <span style="font-weight: 500;">${cat.category_name}</span>
              </div>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: center; color: #A1A1AA;">${cat.count} movs</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: #FFFFFF; font-family: monospace; font-weight: 700;">${currencySymbol}${formatAmount(cat.total_amount)}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: #10B981; font-weight: 600;">${cat.percentage || 0}%</td>
          </tr>
        `;
      })
      .join('');

    // Generate HTML for Transactions Table
    const transactionsRowsHtml = transactions
      .slice(0, 30) // top 30 transactions
      .map((tx) => {
        const isInc = tx.type === 'income';
        const color = isInc ? '#22C55E' : '#EF4444';
        return `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2E2E2E; color: #A1A1AA; font-size: 11px;">${tx.transaction_date}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2E2E2E; color: #FFFFFF; font-weight: 500;">${tx.description || 'Sin concepto'}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2E2E2E; color: #A1A1AA; font-size: 11px;">${tx.category?.name || 'General'}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2E2E2E; text-align: right; color: ${color}; font-family: monospace; font-weight: 700;">
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
            margin: 14mm 12mm 14mm 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #121212;
            color: #F3F3F3;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
          }
          .header {
            border-bottom: 2px solid #10B981;
            padding-bottom: 14px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .logo-badge {
            background-color: #10B981;
            color: #FFFFFF;
            font-weight: 900;
            font-size: 16px;
            padding: 6px 12px;
            border-radius: 8px;
            letter-spacing: -0.5px;
          }
          .brand-title {
            font-size: 18px;
            font-weight: 800;
            color: #FFFFFF;
            margin: 0;
          }
          .brand-sub {
            font-size: 11px;
            color: #10B981;
            margin: 2px 0 0 0;
            font-weight: 600;
          }
          .meta-info {
            text-align: right;
            font-size: 10px;
            color: #A1A1AA;
          }
          .meta-info strong {
            color: #FFFFFF;
          }
          .report-heading {
            margin-bottom: 18px;
          }
          .report-heading h1 {
            font-size: 20px;
            font-weight: 800;
            color: #FFFFFF;
            margin: 0 0 4px 0;
          }
          .report-heading p {
            color: #A1A1AA;
            font-size: 12px;
            margin: 0;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 22px;
          }
          .kpi-card {
            background-color: #1E1E1E;
            border: 1px solid #2E2E2E;
            border-radius: 10px;
            padding: 12px;
          }
          .kpi-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #A1A1AA;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .kpi-value {
            font-size: 18px;
            font-weight: 800;
            font-family: monospace;
          }
          .kpi-sub {
            font-size: 9px;
            color: #71717A;
            margin-top: 4px;
          }
          .section {
            margin-bottom: 22px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 10px 0;
            padding-bottom: 6px;
            border-bottom: 1px solid #2E2E2E;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #1E1E1E;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #2E2E2E;
          }
          th {
            background-color: #27272A;
            color: #A1A1AA;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #2E2E2E;
          }
          .debts-loans-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 22px;
          }
          .dl-card {
            background-color: #1E1E1E;
            border: 1px solid #2E2E2E;
            border-radius: 10px;
            padding: 12px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #2E2E2E;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #71717A;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <div class="brand">
            <div class="logo-badge">☘ CLOVER</div>
            <div>
              <h2 class="brand-title">Clover Wallet</h2>
              <p class="brand-sub">Sistema de Gestión & Salud Financiera</p>
            </div>
          </div>
          <div class="meta-info">
            <div>Usuario: <strong>${userName}</strong></div>
            ${userEmail ? `<div>Email: ${userEmail}</div>` : ''}
            <div>Fecha: ${generationDate}</div>
            <div>Moneda: <strong>${currency}</strong></div>
          </div>
        </div>

        <!-- Title -->
        <div class="report-heading">
          <h1>${reportTitle}</h1>
          <p>Informe financiero detallado generado automáticamente con tecnología Clover Wallet.</p>
        </div>

        <!-- Main KPIs -->
        <div class="kpi-grid">
          <div class="kpi-card" style="border-left: 3px solid #22C55E;">
            <div class="kpi-label">Total Ingresos</div>
            <div class="kpi-value" style="color: #22C55E;">+${currencySymbol}${formatAmount(totalIncome)}</div>
            <div class="kpi-sub">Entradas registradas</div>
          </div>

          <div class="kpi-card" style="border-left: 3px solid #EF4444;">
            <div class="kpi-label">Total Gastos</div>
            <div class="kpi-value" style="color: #EF4444;">-${currencySymbol}${formatAmount(totalExpense)}</div>
            <div class="kpi-sub">Egresos computados</div>
          </div>

          <div class="kpi-card" style="border-left: 3px solid ${balance >= 0 ? '#10B981' : '#EF4444'};">
            <div class="kpi-label">Balance Neto</div>
            <div class="kpi-value" style="color: ${balance >= 0 ? '#10B981' : '#EF4444'};">
              ${balance >= 0 ? '+' : ''}${currencySymbol}${formatAmount(balance)}
            </div>
            <div class="kpi-sub">Diferencial neto</div>
          </div>

          <div class="kpi-card" style="border-left: 3px solid #3B82F6;">
            <div class="kpi-label">Tasa de Ahorro</div>
            <div class="kpi-value" style="color: #3B82F6;">${savingsRate}%</div>
            <div class="kpi-sub">Capacidad retenida</div>
          </div>
        </div>

        <!-- Deudas y Préstamos Summary -->
        <div class="debts-loans-grid">
          <div class="dl-card">
            <div style="font-size: 11px; font-weight: 700; color: #F97316; text-transform: uppercase; margin-bottom: 8px;">
              💳 Estado de Deudas
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #A1A1AA;">Total Deuda:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${currencySymbol}${formatAmount(totalDebt)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #A1A1AA;">Amortizado / Pagado:</span>
              <strong style="color: #22C55E; font-family: monospace;">${currencySymbol}${formatAmount(totalDebtPaid)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #A1A1AA;">Saldo Pendiente:</span>
              <strong style="color: #F97316; font-family: monospace;">${currencySymbol}${formatAmount(totalDebtPending)}</strong>
            </div>
          </div>

          <div class="dl-card">
            <div style="font-size: 11px; font-weight: 700; color: #3B82F6; text-transform: uppercase; margin-bottom: 8px;">
              🤝 Estado de Préstamos
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #A1A1AA;">Total Prestado:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${currencySymbol}${formatAmount(totalLoan)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #A1A1AA;">Cobrado / Recuperado:</span>
              <strong style="color: #22C55E; font-family: monospace;">${currencySymbol}${formatAmount(totalLoanRecovered)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #A1A1AA;">Saldo por Recuperar:</span>
              <strong style="color: #3B82F6; font-family: monospace;">${currencySymbol}${formatAmount(totalLoanPending)}</strong>
            </div>
          </div>
        </div>

        ${
          reportType === 'annual' && monthlyData.length > 0
            ? `
          <div class="section">
            <div class="section-title">
              <span>Evolución Mensual del Año ${year}</span>
              <span style="font-size: 11px; color: #A1A1AA; font-weight: normal;">12 Meses Consolidados</span>
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
              <span style="font-size: 11px; color: #A1A1AA; font-weight: normal;">${breakdown.length} Categorías con Movimiento</span>
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
              <span>Movimientos de ${monthName} ${year} (Muestra de hasta 30 registros)</span>
              <span style="font-size: 11px; color: #A1A1AA; font-weight: normal;">Total: ${transactions.length} transacciones</span>
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

        <!-- Footer -->
        <div class="footer">
          <div>☘ Clover Wallet — Control Financiero Inteligente</div>
          <div>Documento Confidencial generado por ${userName}</div>
          <div>Página 1 de 1</div>
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
        top: '12mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm',
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
