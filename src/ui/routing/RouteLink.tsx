import type { MouseEvent, ReactNode } from 'react';
import { navigate } from './router';
import styles from './RouteLink.module.css';

type RouteLinkProps = {
  to: string;
  children: ReactNode;
};

/** Enlace interno: conserva la semántica de <a> y navega sin recargar en clics simples. */
export function RouteLink({ to, children }: RouteLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.button !== 0 || modified) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} className={styles.link} onClick={handleClick}>
      {children}
    </a>
  );
}
