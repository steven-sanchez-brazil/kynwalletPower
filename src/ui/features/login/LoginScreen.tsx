import type { ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './LoginScreen.module.css';

export function LoginScreen({
  children,
  variant = 'login',
}: {
  children: ReactNode;
  variant?: 'login' | 'registration';
}) {
  return (
    <div
      className={[styles.screen, variant === 'registration' && styles.registration]
        .filter(Boolean)
        .join(' ')}
    >
      <BrandPanel variant={variant} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
