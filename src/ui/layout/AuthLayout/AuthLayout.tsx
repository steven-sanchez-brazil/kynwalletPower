import type { ReactNode } from 'react';
import { BrandPanel, type BrandPanelProps } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = BrandPanelProps & {
  children: ReactNode;
};

/** Maqueta de dos paneles (marca y formulario) del login y del registro (002 FR-016). */
export function AuthLayout({ children, ...brand }: AuthLayoutProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel {...brand} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
