import type { ReactNode } from 'react';
import { BrandPanel, type BrandPanelProps } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthScreen.module.css';

type AuthScreenProps = BrandPanelProps & { children: ReactNode };

/** Layout de dos paneles compartido por el login y el registro. */
export function AuthScreen({ children, ...brand }: AuthScreenProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel {...brand} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
