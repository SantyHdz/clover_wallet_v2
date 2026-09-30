'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { ReportSummary, MonthlyReport, CategoryBreakdown, Transaction } from '@/types';

interface ExportReportDialogProps {
  currentYear: number;
  currentMonth: number;
  summary?: ReportSummary;
  monthlyData?: MonthlyReport[];
  breakdown?: CategoryBreakdown[];
  transactions?: Transaction[];
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function ExportReportDialog({
  currentYear,
  currentMonth,
  summary,
  monthlyData = [],
  breakdown = [],
  transactions = [],
}: ExportReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<'monthly' | 'annual'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [isGenerating, setIsGenerating] = useState(false);

  const { user } = useAuth();

  const handleDownload = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Generando documento PDF con Puppeteer...');

    try {
      const payload = {
        reportType,
        year: selectedYear,
        month: reportType === 'monthly' ? selectedMonth : undefined,
        userName: user?.full_name || 'Usuario Clover',
        userEmail: user?.email,
        currency: user?.currency || 'USD',
        summary,
        monthlyData,
        breakdown,
        transactions,
      };

      const response = await fetch('/api/reports/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || 'Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        reportType === 'monthly'
          ? `Reporte_Clover_${selectedYear}_${selectedMonth}.pdf`
          : `Reporte_Anual_Clover_${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Reporte PDF descargado exitosamente', { id: toastId });
      setOpen(false);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Error al procesar el archivo PDF', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold gap-2 shadow-lg shadow-[#10B981]/20 cursor-pointer"
      >
        <Download className="h-4 w-4" />
        <span>Exportar PDF</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md border-[#2E2E2E] bg-[#1E1E1E] text-white">
          <DialogHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] mb-1">
              <FileText className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              Descargar Reporte Financiero PDF
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Genera un informe con diseño profesional, gráficos y tablas completas listo para imprimir o archivar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Tipo de Reporte */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white">Tipo de Informe</Label>
              <Select
                value={reportType}
                onValueChange={(val) => {
                  if (val === 'monthly' || val === 'annual') {
                    setReportType(val);
                  }
                }}
              >
                <SelectTrigger className="border-[#2E2E2E] bg-[#121212] text-white">
                  <SelectValue placeholder="Selecciona tipo de reporte" />
                </SelectTrigger>
                <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
                  <SelectItem value="monthly">
                    📄 Reporte Mensual (Desglose de categorías y movimientos)
                  </SelectItem>
                  <SelectItem value="annual">
                    📊 Reporte Anual Consolidado (12 meses y balance global)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Año */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white">Año Fiscal</Label>
                <Select
                  value={String(selectedYear)}
                  onValueChange={(val) => {
                    if (val) setSelectedYear(Number(val));
                  }}
                >
                  <SelectTrigger className="border-[#2E2E2E] bg-[#121212] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mes (si es mensual) */}
              {reportType === 'monthly' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white">Mes</Label>
                  <Select
                    value={String(selectedMonth)}
                    onValueChange={(val) => {
                      if (val) setSelectedMonth(Number(val));
                    }}
                  >
                    <SelectTrigger className="border-[#2E2E2E] bg-[#121212] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#2E2E2E] bg-[#1E1E1E] text-white">
                      {MONTH_NAMES.map((name, idx) => (
                        <SelectItem key={idx + 1} value={String(idx + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3 text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center gap-2 text-white font-medium">
                <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Incluye en el documento:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                <li>Resumen de Ingresos, Gastos y Balance Neto</li>
                <li>Estado de Deudas y Préstamos vigentes</li>
                {reportType === 'annual' ? (
                  <li>Evolución mensual comparativa (12 meses)</li>
                ) : (
                  <li>Desglose por categoría y detalle de transacciones</li>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isGenerating}
              className="text-muted-foreground hover:text-white cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generando con Puppeteer...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Descargar PDF</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
