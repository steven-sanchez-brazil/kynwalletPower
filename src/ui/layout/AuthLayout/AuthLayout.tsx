import type { ReactNode } from 'react';
import { BrandPanel, type BrandVariant } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  children: ReactNode;
  variant?: BrandVariant;
};

/** Layout de dos paneles (marca + formulario) compartido por login y registro. */
export function AuthLayout({ children, variant = 'login' }: AuthLayoutProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel variant={variant} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
