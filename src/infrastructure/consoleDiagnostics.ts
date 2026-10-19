import type { ReportDiagnostic } from '@/application/registerAccount';

/** Adaptador de diagnóstico: único punto autorizado a escribir en la consola (8.7). */
export const consoleDiagnostics: ReportDiagnostic = (event) => {
  console.error({ code: event.code });
};
