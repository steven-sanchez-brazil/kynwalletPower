import type { ReactNode } from 'react';
import { BrandPanel, type BrandVariant } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthScreen.module.css';

type AuthScreenProps = {
  children: ReactNode;
  brand?: BrandVariant;
};

/** Pantalla de dos paneles (marca y formulario) compartida por login y registro. */
export function AuthScreen({ children, brand = 'login' }: AuthScreenProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel variant={brand} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
