import logoDot from '@/ui/assets/register-logo-dot.svg';
import logoDot2 from '@/ui/assets/register-logo-dot-2.svg';
import logoMark from '@/ui/assets/logo-mark.svg';
import styles from './BrandPanel.module.css';

export type BrandVariant = 'login' | 'register';

const COPY = {
  login: {
    title: (
      <>
        Tu dinero,
        <br />
        sin fronteras.
      </>
    ),
    subtitle: 'Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.',
  },
  register: {
    title: (
      <>
        Comienza tu
        <br />
        camino financiero.
      </>
    ),
    subtitle:
      'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
  },
} as const;

/** Panel de marca del diseño (Figma, nodos 2:3 del login y 31:3 del registro). */
export function BrandPanel({ variant = 'login' }: { variant?: BrandVariant }) {
  const { title, subtitle } = COPY[variant];
  const isRegister = variant === 'register';
  return (
    <header
      className={[styles.panel, isRegister && styles.registerPanel].filter(Boolean).join(' ')}
    >
      <div className={[styles.logo, isRegister && styles.registerLogo].filter(Boolean).join(' ')}>
        {isRegister ? (
          <span className={styles.registerMark} aria-hidden="true">
            <img src={logoDot} alt="" width={10} height={28} />
            <img src={logoDot2} alt="" width={14} height={14} />
          </span>
        ) : (
          <img src={logoMark} alt="" width={20} height={44} />
        )}
        <span className={styles.logoText}>KynWallet</span>
      </div>

      <div className={styles.headline}>
        <p className={styles.title}>{title}</p>
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
