import type { ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './RegisterScreen.module.css';

export interface RegisterScreenProps {
  children: ReactNode;
}

export function RegisterScreen({ children }: RegisterScreenProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
