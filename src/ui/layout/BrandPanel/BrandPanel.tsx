import logoMark from '@/ui/assets/logo-mark.svg';
import styles from './BrandPanel.module.css';

/** Panel de marca del diseño (Figma, nodo 2:3). */
export function BrandPanel({ variant = 'login' }: { variant?: 'login' | 'registration' }) {
  return (
    <header className={`${styles.panel} ${variant === 'registration' ? styles.registration : ''}`}>
      <div className={styles.logo}>
        <img src={logoMark} alt="" width={20} height={44} />
        <span className={styles.logoText}>KynWallet</span>
      </div>

      <div className={styles.headline}>
        {variant === 'registration' ? (
          <>
            <p className={styles.title}>
              Comienza tu
              <br />
              camino financiero.
            </p>
            <p className={styles.subtitle}>
              Crea tu cuenta en minutos y empieza a enviar, recibir y
              <br />
              administrar tu dinero desde cualquier lugar.
            </p>
          </>
        ) : (
          <>
            <p className={styles.title}>
              Tu dinero,
              <br />
              sin fronteras.
            </p>
            <p className={styles.subtitle}>
              Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.
            </p>
          </>
        )}
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
