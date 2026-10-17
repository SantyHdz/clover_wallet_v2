import { createElement, type ReactElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { ReportDocument, ReportDocumentProps } from '@/lib/pdf/report-document';

export const runtime = 'nodejs';

type ExportPdfPayload = Partial<ReportDocumentProps> & Pick<ReportDocumentProps, 'reportType' | 'year'>;

export async function POST(req: NextRequest) {
  try {
    const payload: ExportPdfPayload = await req.json();
    const { reportType, year, month } = payload;

    const buffer = await renderToBuffer(
      createElement(ReportDocument, {
        reportType,
        year,
        month,
        userName: payload.userName || 'Usuario',
        userEmail: payload.userEmail,
        currency: payload.currency || 'USD',
        summary: payload.summary,
        monthlyData: payload.monthlyData ?? [],
        breakdown: payload.breakdown ?? [],
        transactions: payload.transactions ?? [],
      }) as unknown as ReactElement<DocumentProps>
    );

    const fileName =
      reportType === 'monthly'
        ? `Reporte_Clover_${year}_${month || 1}.pdf`
        : `Reporte_Anual_Clover_${year}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar el reporte en PDF', detail: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}
