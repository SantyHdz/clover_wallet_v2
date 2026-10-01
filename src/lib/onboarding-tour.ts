import { driver, DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';

export interface TourStepConfig {
  route: string;
  element: string;
  title: string;
  description: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export const ONBOARDING_STEPS: TourStepConfig[] = [
  {
    route: '/dashboard',
    element: '[data-tour="dashboard-kpis"]',
    title: 'Balance y Métricas Financieras',
    description:
      'Visualiza tus ingresos, gastos, deudas y el saldo disponible calculado automáticamente en tiempo real.',
    side: 'bottom',
    align: 'start',
  },
  {
    route: '/dashboard',
    element: '[data-tour="dashboard-recent"]',
    title: 'Movimientos Recientes',
    description:
      'Revisa de un vistazo las últimas transacciones registradas en tu cuenta para un control inmediato.',
    side: 'top',
    align: 'center',
  },
  {
    route: '/dashboard/transactions',
    element: '[data-tour="tx-filters"]',
    title: 'Filtros y Búsqueda Multidimensional',
    description:
      'Explora tu historial con filtros por tipo, categorías o períodos, y alterna entre vista de tarjetas y tabla.',
    side: 'bottom',
    align: 'start',
  },
  {
    route: '/dashboard/transactions',
    element: '[data-tour="tx-add-btn"]',
    title: 'Registro Rápido de Movimientos',
    description:
      'Registra nuevos ingresos o gastos recurrentes y únicos con categorización automática en segundos.',
    side: 'bottom',
    align: 'end',
  },
  {
    route: '/dashboard/debts-loans',
    element: '[data-tour="debts-tabs"]',
    title: 'Deudas y Préstamos',
    description:
      'Gestiona compromisos financieros divididos entre lo que debes pagar y lo que tienes pendiente por cobrar con registro de abonos.',
    side: 'bottom',
    align: 'start',
  },
  {
    route: '/dashboard/savings',
    element: '[data-tour="savings-grid"]',
    title: 'Ahorros y Metas con Proyección',
    description:
      'Crea alcancías y metas con plazo. El sistema proyecta la fecha estimada de cumplimiento según tu ritmo real de ahorro.',
    side: 'top',
    align: 'start',
  },
  {
    route: '/dashboard/reports',
    element: '[data-tour="reports-export"]',
    title: 'Reportes y Exportación Oficial',
    description:
      'Analiza tu evolución financiera mediante gráficos interactivos y exporta informes ejecutivos en PDF de alta fidelidad.',
    side: 'bottom',
    align: 'end',
  },
];

/**
 * Espera a que un elemento aparezca en el DOM, se desplace al centro de la vista y esté listo
 */
async function waitForAndFocusElement(selector: string, timeout = 4000): Promise<HTMLElement | null> {
  const el = await new Promise<HTMLElement | null>((resolve) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const target = document.querySelector<HTMLElement>(selector);
      if (target) {
        observer.disconnect();
        resolve(target);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector<HTMLElement>(selector));
    }, timeout);
  });

  if (el) {
    // Scroll suave hacia el elemento objetivo
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
    // Pequeña pausa para que termine la animación de desplazamiento y el layout se estabilice
    await new Promise((r) => setTimeout(r, 300));
  }

  return el;
}

/**
 * Gestor del Tour Guiado Multipage para Clover Wallet
 */
export class CloverTourController {
  private currentStepIndex = 0;
  private router: any = null;
  private driverInstance: any = null;
  private onCompleteCallback?: () => void;

  constructor(router: any, onComplete?: () => void) {
    this.router = router;
    this.onCompleteCallback = onComplete;
  }

  public startTour(startIndex = 0): void {
    this.currentStepIndex = startIndex;
    this.showStep(this.currentStepIndex);
  }

  public destroy(): void {
    if (this.driverInstance) {
      this.driverInstance.destroy();
      this.driverInstance = null;
    }
  }

  private finishTour(): void {
    this.destroy();
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  private async showStep(index: number): Promise<void> {
    if (index < 0 || index >= ONBOARDING_STEPS.length) {
      this.finishTour();
      return;
    }

    const step = ONBOARDING_STEPS[index];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Si el paso pertenece a otra ruta, navegamos primero
    if (currentPath !== step.route && this.router) {
      this.router.push(step.route);
    }

    // Esperar a que el elemento objetivo esté disponible en el DOM y hacer scroll
    const targetElement = await waitForAndFocusElement(step.element, 4000);

    // Destruir instancia anterior si existe
    if (this.driverInstance) {
      this.driverInstance.destroy();
    }

    const isLastStep = index === ONBOARDING_STEPS.length - 1;
    const isFirstStep = index === 0;

    // Crear nueva instancia de driver para este paso
    this.driverInstance = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayColor: '#121212',
      overlayOpacity: 0.75,
      stagePadding: 6,
      stageRadius: 10,
      popoverClass: 'clover-driver-popover',
      nextBtnText: isLastStep ? 'Finalizar' : 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: `${index + 1} de ${ONBOARDING_STEPS.length}`,
      onNextClick: () => {
        this.currentStepIndex++;
        if (this.currentStepIndex >= ONBOARDING_STEPS.length) {
          this.finishTour();
        } else {
          this.showStep(this.currentStepIndex);
        }
      },
      onPrevClick: () => {
        if (this.currentStepIndex > 0) {
          this.currentStepIndex--;
          this.showStep(this.currentStepIndex);
        }
      },
      onDestroyStarted: () => {
        this.finishTour();
      },
    });

    if (targetElement) {
      this.driverInstance.highlight({
        element: targetElement,
        popover: {
          title: step.title,
          description: step.description,
          side: step.side || 'bottom',
          align: step.align || 'start',
          showButtons: isFirstStep
            ? ['next', 'close']
            : ['previous', 'next', 'close'],
        },
      });
    } else {
      // Fallback si por alguna razón no cargó el elemento, avanzar al siguiente
      console.warn(`Elemento ${step.element} no encontrado para el tour.`);
      this.currentStepIndex++;
      if (this.currentStepIndex < ONBOARDING_STEPS.length) {
        this.showStep(this.currentStepIndex);
      } else {
        this.finishTour();
      }
    }
  }
}
