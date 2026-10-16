import type { ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  brandTitle: ReactNode;
  brandSubtitle: string;
  children: ReactNode;
};

/** Layout de dos paneles compartido por inicio de sesión y registro (FR-022). */
export function AuthLayout({ brandTitle, brandSubtitle, children }: AuthLayoutProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel title={brandTitle} subtitle={brandSubtitle} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
