import logoMark from '@/ui/assets/logo-mark.svg';
import styles from './BrandPanel.module.css';

/** Panel de marca compartido entre inicio de sesión y registro. */
export function BrandPanel({ registration = false }: { registration?: boolean }) {
  return (
    <header className={styles.panel}>
      <div className={styles.logo}>
        <img src={logoMark} alt="" width={20} height={44} />
        <span className={styles.logoText}>KynWallet</span>
      </div>
      <div className={styles.headline}>
        <p className={styles.title}>
          {registration ? <>Comienza tu<br />camino financiero.</> : <>Tu dinero,<br />sin fronteras.</>}
        </p>
        <p className={styles.subtitle}>
          {registration
            ? 'Crea tu cuenta y empieza a manejar tu dinero, recibir y enviar sin límites.'
            : 'Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.'}
        </p>
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
