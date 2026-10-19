import { useEffect, type ReactNode } from 'react';
import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  pageTitle: string;
  brandTitle: ReactNode;
  brandSubtitle: string;
  children: ReactNode;
};

/** Layout de dos paneles compartido por login y registro (FR-018 de 001, FR-021 de 002). */
export function AuthLayout({ pageTitle, brandTitle, brandSubtitle, children }: AuthLayoutProps) {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className={styles.screen}>
      <BrandPanel title={brandTitle} subtitle={brandSubtitle} />
      <main className={styles.formPanel}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
