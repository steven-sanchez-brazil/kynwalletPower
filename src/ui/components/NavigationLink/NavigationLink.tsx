import type { AnchorHTMLAttributes } from 'react';
import { navigateTo } from '@/ui/navigation';

/** Enlace real: conserva abrir en otra pestaña y evita recargar en navegación ordinaria. */
export function NavigationLink({
  href,
  onClick,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}
