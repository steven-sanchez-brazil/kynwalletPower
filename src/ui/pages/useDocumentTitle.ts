import { useEffect } from 'react';

/** Título propio por ruta (WCAG 2.4.2, 002 FR-023). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
