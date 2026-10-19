import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Tras un cambio de ruta mueve el foco al encabezado principal de la vista nueva, para que el
 * teclado y los lectores de pantalla no queden en un elemento desmontado (WCAG 2.4.3).
 * No actúa en la carga inicial.
 */
export function useRouteFocus() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }, [pathname]);
}
