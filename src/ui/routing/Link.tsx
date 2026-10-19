import type { MouseEvent, ReactNode } from 'react';
import { navigate } from './router';
import styles from './Link.module.css';

type LinkProps = {
  to: string;
  children: ReactNode;
};

/** Enlace interno: un `<a href>` real que navega sin recargar la página (FR-016). */
export function Link({ to, children }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Con teclas modificadoras o botón no principal, el navegador decide (p. ej., nueva pestaña).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} className={styles.link} onClick={handleClick}>
      {children}
    </a>
  );
}
