import logoMark from '@/ui/assets/logo-mark.svg';
import styles from './BrandPanel.module.css';

export type BrandVariant = 'login' | 'registration';

const CONTENT = {
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
  registration: {
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

/** Panel de marca del diseño (Figma, nodo 2:3 y frame 04 · Registro). */
export function BrandPanel({ variant = 'login' }: { variant?: BrandVariant }) {
  const { title, subtitle } = CONTENT[variant];
  // El registro omite el panel por completo en móvil (solo formulario, según el taller).
  const classes = [styles.panel, variant === 'registration' && styles.hiddenOnMobile]
    .filter(Boolean)
    .join(' ');
  return (
    <header className={classes}>
      <div className={styles.logo}>
        <img src={logoMark} alt="" width={20} height={44} />
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
