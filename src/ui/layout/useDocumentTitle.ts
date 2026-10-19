import { useEffect } from 'react';

/** Mantiene `document.title` acorde con la vista actual (WCAG 2.4.2). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
