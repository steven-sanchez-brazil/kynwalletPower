import type { ReactNode } from 'react';
import styles from './Alert.module.css';

export type AlertProps = {
  tone: 'error' | 'info';
  role?: 'alert' | 'status';
  children: ReactNode;
};

/** Mensaje global anunciado por tecnologías de asistencia (FR-015). */
export function Alert({ tone, role, children }: AlertProps) {
  const computedRole = role ?? (tone === 'error' ? 'alert' : 'status');
  return (
    <div role={computedRole} className={`${styles.alert} ${styles[tone]}`}>
      {children}
    </div>
  );
}
