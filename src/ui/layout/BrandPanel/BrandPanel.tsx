import { Fragment } from 'react';
import logoDot from '@/ui/assets/logo-dot.svg';
import logoDot2 from '@/ui/assets/logo-dot-2.svg';
import logoMark from '@/ui/assets/logo-mark.svg';
import styles from './BrandPanel.module.css';

export type BrandPanelProps = {
  /** Líneas del titular; cada una va en su propio renglón. */
  title?: readonly string[];
  subtitle?: string;
  /** `register` usa el degradado y el logo del diseño de registro y se oculta en móvil. */
  tone?: 'login' | 'register';
};

const LOGIN_TITLE = ['Tu dinero,', 'sin fronteras.'] as const;
const LOGIN_SUBTITLE = 'Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.';

/** Panel de marca del diseño (Figma, nodos 2:3 del login y 31:3 del registro). */
export function BrandPanel({
  title = LOGIN_TITLE,
  subtitle = LOGIN_SUBTITLE,
  tone = 'login',
}: BrandPanelProps) {
  return (
    <header className={styles.panel} data-tone={tone}>
      {tone === 'register' ? (
        <div className={styles.logoRegister}>
          <img className={styles.dot} src={logoDot} alt="" width={10} height={28} />
          <img className={styles.dot2} src={logoDot2} alt="" width={14} height={14} />
          <span className={styles.logoRegisterText}>KynWallet</span>
        </div>
      ) : (
        <div className={styles.logo}>
          <img src={logoMark} alt="" width={20} height={44} />
          <span className={styles.logoText}>KynWallet</span>
        </div>
      )}

      <div className={styles.headline}>
        <p className={styles.title}>
          {title.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.card} aria-hidden="true">
        <div className={styles.cardTop}>
          <span className={styles.cardName}>Kyn Card</span>
          <span className={styles.chip} />
        </div>
        <span className={styles.cardNumber}>{'5294  ••••  ••••  4827'}</span>
        <div className={styles.cardBottom}>
          <span>STEVEN LUNA</span>
          <span>12/29</span>
        </div>
      </div>
    </header>
  );
}
