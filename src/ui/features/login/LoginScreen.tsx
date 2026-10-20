import type { ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './LoginScreen.module.css';

export function LoginScreen({ children, registration = false }: {
  children: ReactNode;
  registration?: boolean;
}) {
  return (
    <div className={[styles.screen, registration && styles.registration].filter(Boolean).join(' ')}>
      <BrandPanel registration={registration} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
