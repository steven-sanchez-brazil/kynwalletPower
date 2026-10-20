import type { ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthLayout.module.css';
export function AuthLayout({
  children,
  registration = false,
}: {
  children: ReactNode;
  registration?: boolean;
}) {
  return (
    <div className={[styles.screen, registration && styles.registration].filter(Boolean).join(' ')}>
      <div className={styles.brand}>
        <BrandPanel />
      </div>
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
