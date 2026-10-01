'use client';

import { useEffect, useRef } from 'react';
import apiClient from '@/lib/api-client';

/**
 * Componente cliente ligero que envía una petición no bloqueante a /health
 * una sola vez al montarse la aplicación para despertar el backend en frío.
 */
export function BackendWakeUp() {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      apiClient.get('/health').catch(() => {
        // Silenciar errores en segundo plano
      });
    }
  }, []);

  return null;
}
