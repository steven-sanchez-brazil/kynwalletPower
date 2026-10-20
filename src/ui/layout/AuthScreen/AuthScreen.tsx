import type { ReactNode } from 'react';
import { BrandPanel, type BrandPanelVariant } from '../BrandPanel/BrandPanel';
import styles from './AuthScreen.module.css';

type AuthScreenProps = {
  children: ReactNode;
  brandTitle?: string;
  brandSubtitle?: string;
  brandVariant?: BrandPanelVariant;
  contentPosition?: 'center' | 'registration';
};

export function AuthScreen({
  children,
  brandTitle,
  brandSubtitle,
  brandVariant,
  contentPosition = 'center',
}: AuthScreenProps) {
  return (
    <div className={styles.screen}>
      <BrandPanel title={brandTitle} subtitle={brandSubtitle} variant={brandVariant} />
      <main
        className={`${styles.formPanel} ${contentPosition === 'registration' ? styles.registrationPanel : ''}`}
      >
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
