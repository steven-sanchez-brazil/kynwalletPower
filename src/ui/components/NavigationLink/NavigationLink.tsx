import type { MouseEvent, ReactNode } from 'react';
import styles from './NavigationLink.module.css';

export type Destination = '/login' | '/registro';
export type Navigate = (path: Destination) => void;

export function NavigationLink({
  href,
  onNavigate,
  children,
}: {
  href: Destination;
  onNavigate?: Navigate;
  children: ReactNode;
}) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !onNavigate ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    event.preventDefault();
    onNavigate(href);
  };
  return (
    <a className={styles.link} href={href} onClick={follow}>
      {children}
    </a>
  );
}
