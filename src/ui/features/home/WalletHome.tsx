import { useEffect, useRef, useState } from 'react';
import type { WalletOverview } from '@/domain/wallet';
import { Alert } from '@/ui/components/Alert/Alert';
import homeMark from '@/ui/assets/logo-home.svg';
import styles from './WalletHome.module.css';

type Props = { name: string; wallet: WalletOverview; onLogout: () => void };
type Announce = (action: string) => void;

function WalletNavigation({ mobile = false, announce }: { mobile?: boolean; announce: Announce }) {
  const items = mobile
    ? ['Inicio', 'Historial', 'QR', 'Perfil']
    : ['Inicio', 'Historial', 'Tarjetas', 'Pagos', 'Perfil'];
  return (
    <nav
      aria-label={mobile ? 'Navegación móvil' : 'Navegación principal'}
      className={mobile ? styles.mobileNav : styles.desktopNav}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          aria-current={item === 'Inicio' ? 'page' : undefined}
          onClick={() => {
            if (item !== 'Inicio') announce(item);
          }}
        >
          {!mobile && <span aria-hidden="true" className={styles.navDot} />}
          {item}
        </button>
      ))}
    </nav>
  );
}

function QuickActions({ announce }: { announce: Announce }) {
  const actions = [
    { label: 'Enviar', detail: 'Transferir dinero' },
    { label: 'Recibir', detail: 'Compartir QR' },
    { label: 'Recargar', detail: 'Añadir saldo' },
    { label: 'Pagar', detail: 'Servicios y más' },
  ];
  return (
    <section className={styles.quickActions} aria-label="Acciones rápidas">
      <h2>Acciones rápidas</h2>
      <div className={styles.actions}>
        {actions.map((action, index) => (
          <div key={action.label} className={styles.actionSlot}>
            <button
              type="button"
              aria-label={action.label}
              className={index === 3 ? styles.desktopAction : undefined}
              onClick={() => announce(action.label)}
            >
              <span className={styles.actionIcon} aria-hidden="true">
                <span />
              </span>
              <span className={styles.actionText}>
                <strong>{action.label}</strong>
                <small>{action.detail}</small>
              </span>
            </button>
            {index === 3 && (
              <button type="button" className={styles.mobileAction} onClick={() => announce('Más')}>
                <span className={styles.actionIcon} aria-hidden="true">
                  <span />
                </span>
                <strong>Más</strong>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Movements({ wallet, announce }: { wallet: WalletOverview; announce: Announce }) {
  return (
    <section className={styles.movements} aria-labelledby="movement-heading">
      <div className={styles.sectionHeading}>
        <h2 id="movement-heading">
          <span className={styles.desktopText}>Movimientos recientes</span>
          <span className={styles.mobileText}>Movimientos</span>
        </h2>
        <button type="button" onClick={() => announce('ver todo →')}>
          ver todo →
        </button>
      </div>
      <ul aria-label="Movimientos recientes" className={styles.movementList}>
        {wallet.movements.map((movement, index) => (
          <li
            key={movement.id}
            className={`${index > 3 ? styles.extraMovement : ''} ${movement.direction === 'in' ? styles.income : styles.expense}`}
          >
            <span className={styles.movementIcon} aria-hidden="true">
              {movement.direction === 'in' ? '↙' : '↗'}
            </span>
            <div className={styles.movementText}>
              <strong>{movement.name}</strong>
              <small>
                <span className={styles.desktopText}>{movement.category} · </span>
                {movement.date}
              </small>
            </div>
            <strong className={styles.amount}>{movement.amount}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CardAndSummary({ name, wallet }: Pick<Props, 'name' | 'wallet'>) {
  return (
    <aside className={styles.details} aria-label="Tarjeta y resumen">
      <section aria-labelledby="card-heading">
        <h2 id="card-heading">Mi tarjeta</h2>
        <div className={styles.card}>
          <strong>Kyn Card</strong>
          <span className={styles.chip} aria-hidden="true" />
          <p className={styles.cardNumber}>{wallet.card.maskedNumber}</p>
          <div className={styles.cardBottom}>
            <span>{name.toLocaleUpperCase('es')}</span>
            <span>{wallet.card.expiry}</span>
          </div>
        </div>
      </section>
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading">Resumen del mes</h2>
        <ul className={styles.categories}>
          {wallet.categories.map((category) => (
            <li key={category.label} className={styles[category.tone]}>
              <span className={styles.categoryDot} aria-hidden="true" />
              <span>{category.label}</span>
              <strong>{category.amount}</strong>
              <span className={styles.bar} aria-hidden="true">
                <span style={{ width: `${category.indicator}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export function WalletHome({ name, wallet, onLogout }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const content = useRef<HTMLElement>(null);
  const [notice, setNotice] = useState({ action: '', sequence: 0 });
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const announce: Announce = (action) =>
    setNotice((previous) => ({ action, sequence: previous.sequence + 1 }));
  return (
    <div className={styles.shell}>
      <a
        className={styles.skipLink}
        href="#wallet-content"
        onClick={(event) => {
          event.preventDefault();
          content.current?.focus();
        }}
      >
        Ir al contenido
      </a>
      <aside className={styles.sidebar} aria-label="KynWallet">
        <div className={styles.logo}>
          <img src={homeMark} alt="" width={20} height={22} />
          KynWallet
        </div>
        <WalletNavigation announce={announce} />
        <div className={styles.profile}>
          <span className={styles.avatar} aria-hidden="true">
            {name.slice(0, 1).toLocaleUpperCase('es')}
          </span>
          <div>
            <strong>{name}</strong>
            <small>Cuenta de demostración</small>
          </div>
        </div>
      </aside>
      <div className={styles.workspace}>
        <main ref={content} id="wallet-content" className={styles.content} tabIndex={-1}>
          <div className={styles.overview}>
            <header className={styles.header}>
              <div className={styles.greeting}>
                <h1 ref={heading} tabIndex={-1}>
                  <span className={styles.desktopText}>Inicio</span>
                  <span className={styles.mobileText}>
                    HOLA <strong>{name}</strong>
                  </span>
                </h1>
                <p className={styles.desktopText}>Bienvenido de nuevo, {name}</p>
              </div>
              <div className={styles.headerActions}>
                <button
                  type="button"
                  aria-label="Notificaciones"
                  className={styles.notifications}
                  onClick={() => announce('Notificaciones')}
                >
                  <span aria-hidden="true" />
                </button>
                <span className={styles.topAvatar} aria-hidden="true">
                  {name.slice(0, 1).toLocaleUpperCase('es')}
                </span>
              </div>
            </header>
            <section aria-label="Resumen de billetera" className={styles.indicators}>
              <div className={styles.balance}>
                <h2>Saldo disponible</h2>
                <strong>{wallet.balance}</strong>
                <p>
                  <span>{wallet.currency}</span>
                  <span> · cuenta principal</span>
                </p>
              </div>
              {wallet.indicators.map((indicator) => (
                <div className={styles.indicator} key={indicator.label}>
                  <h2>{indicator.label}</h2>
                  <strong>{indicator.value}</strong>
                  <p>{indicator.detail}</p>
                </div>
              ))}
            </section>
          </div>
          <QuickActions announce={announce} />
          <div className={styles.mainGrid}>
            <Movements wallet={wallet} announce={announce} />
            <CardAndSummary name={name} wallet={wallet} />
          </div>
          <div className={styles.noticeArea}>
            {notice.action && (
              <Alert key={notice.sequence} tone="info">
                {notice.action}: Próximamente. Esta acción no está disponible en la demostración.
              </Alert>
            )}
          </div>
          <footer className={styles.footer}>
            <p>Demostración · datos ficticios. No se realizan operaciones reales.</p>
            <button type="button" onClick={onLogout}>
              Cerrar sesión
            </button>
          </footer>
        </main>
        <WalletNavigation mobile announce={announce} />
      </div>
    </div>
  );
}
