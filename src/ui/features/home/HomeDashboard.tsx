import { useEffect, useRef, type FormEvent } from 'react';
import { MESSAGES } from '@/domain/messages';
import {
  buildUserAlias,
  formatCurrency,
  type QuickOperationKind,
  type TransactionFilterType,
} from '@/domain/wallet';
import { Button } from '@/ui/components/Button/Button';
import { TextField } from '@/ui/components/TextField/TextField';
import { Toast } from '@/ui/components/Toast/Toast';
import { useHomeDashboard } from './useHomeDashboard';
import styles from './HomeDashboard.module.css';

export type HomeDashboardProps = {
  name: string;
  onLogout: () => void;
};

const ACTION_FIELD_LABEL: Record<QuickOperationKind, string> = {
  topup: 'Concepto',
  send: 'Destinatario o concepto',
  pay: 'Servicio o concepto',
};

const ACTION_DRAWER_TITLE: Record<QuickOperationKind, string> = {
  topup: 'Recargar saldo a tu billetera',
  send: 'Enviar dinero a otro contacto',
  pay: 'Pagar un servicio o comercio',
};

const FILTER_OPTIONS: readonly { type: TransactionFilterType; label: string }[] = [
  { type: 'all', label: 'Todos' },
  { type: 'income', label: 'Ingresos' },
  { type: 'expense', label: 'Gastos' },
];

export function HomeDashboard({ name, onLogout }: HomeDashboardProps) {
  const {
    state,
    summary,
    visibleTransactions,
    toggleBalancePrivacy,
    setFilterType,
    setSearchQuery,
    resetFilters,
    openQuickAction,
    closeQuickAction,
    changeOperationField,
    submitQuickOperation,
    showToast,
    dismissToast,
  } = useHomeDashboard();

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleOperationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuickOperation();
  };

  const handleCopyAlias = () => {
    const alias = buildUserAlias(name);
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(alias).catch(() => undefined);
    }
    showToast(MESSAGES.ALIAS_COPIED);
  };

  const alias = buildUserAlias(name);

  return (
    <div className={styles.dashboard} data-view="home">
      <nav className={styles.nav} aria-label="Navegación principal">
        <div className={styles.brandHeader}>
          <span className={styles.brandMark} aria-hidden="true">
            K
          </span>
          <span className={styles.brandName}>KynWallet</span>
        </div>
        <ul className={styles.navList}>
          <li>
            <button type="button" className={styles.navItemActive} aria-current="page">
              Inicio
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => showToast(MESSAGES.COMING_SOON)}
            >
              Movimientos
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => showToast(MESSAGES.COMING_SOON)}
            >
              Tarjetas
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => showToast(MESSAGES.COMING_SOON)}
            >
              Mi Perfil
            </button>
          </li>
        </ul>
      </nav>

      <div className={styles.workspace}>
        <header className={styles.topBar}>
          <div className={styles.greeting}>
            <h1 ref={headingRef} tabIndex={-1} className={styles.greetingTitle}>
              ¡Bienvenido, {name}!
            </h1>
            <p className={styles.greetingSubtitle}>
              Resumen y control financiero de tu billetera digital
            </p>
          </div>
          <div className={styles.topBarActions}>
            <Button variant="secondary" className={styles.logoutButton} onClick={onLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <section className={styles.overviewGrid} aria-label="Resumen financiero">
          <div className={styles.kynCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.balanceLabel}>Saldo disponible</span>
                <strong className={styles.balanceValue}>
                  {formatCurrency(summary.availableBalance, {
                    hidden: state.balanceHidden,
                  })}
                </strong>
              </div>
              <button
                type="button"
                className={styles.privacyToggle}
                aria-pressed={state.balanceHidden}
                aria-label={state.balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
                onClick={toggleBalancePrivacy}
              >
                {state.balanceHidden ? 'Mostrar' : 'Ocultar'}
              </button>
            </div>

            <div className={styles.cardFooter}>
              <div>
                <span className={styles.cardMetaLabel}>Titular Kyn Card</span>
                <span className={styles.cardHolder}>{name.toUpperCase()}</span>
              </div>
              <span className={styles.cardNumber}>•••• •••• •••• 4829</span>
            </div>
          </div>

          <div className={styles.metricsCard}>
            <div className={styles.metricsRow}>
              <div className={styles.metricBox}>
                <span className={styles.metricLabel}>Ingresos del mes</span>
                <strong className={styles.metricIncome}>
                  {formatCurrency(summary.totalIncome, {
                    sign: 'positive',
                    hidden: state.balanceHidden,
                  })}
                </strong>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricLabel}>Gastos del mes</span>
                <strong className={styles.metricExpense}>
                  {formatCurrency(summary.totalExpenses, {
                    sign: 'negative',
                    hidden: state.balanceHidden,
                  })}
                </strong>
              </div>
            </div>

            <div className={styles.ratioBlock}>
              <div className={styles.ratioHeader}>
                <span>Balance de flujo positivo</span>
                <span>{summary.incomeSharePercent}% ingresos</span>
              </div>
              <div className={styles.ratioTrack} aria-hidden="true">
                <div
                  className={styles.ratioFill}
                  style={{ width: `${summary.incomeSharePercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionCard} aria-label="Acciones rápidas">
          <h2 className={styles.sectionTitle}>Acciones rápidas</h2>
          <div className={styles.quickActionsGrid}>
            {(
              [
                { id: 'topup', label: 'Recargar' },
                { id: 'send', label: 'Enviar' },
                { id: 'receive', label: 'Recibir' },
                { id: 'pay', label: 'Pagar' },
              ] as const
            ).map((item) => {
              const isActive = state.activeAction === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={isActive ? styles.quickActionButtonActive : styles.quickActionButton}
                  aria-pressed={isActive}
                  onClick={() => openQuickAction(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {state.activeAction === 'receive' && (
            <div className={styles.actionDrawer}>
              <div className={styles.drawerHeader}>
                <h3 className={styles.drawerTitle}>
                  Comparte tu alias KynWallet para recibir transferencias al instante
                </h3>
              </div>
              <div className={styles.receiveBox}>
                <code className={styles.aliasCode}>{alias}</code>
                <Button
                  variant="secondary"
                  className={styles.drawerButton}
                  onClick={handleCopyAlias}
                >
                  Copiar alias
                </Button>
              </div>
            </div>
          )}

          {state.activeAction && state.activeAction !== 'receive' && (
            <form className={styles.actionDrawer} noValidate onSubmit={handleOperationSubmit}>
              <div className={styles.drawerHeader}>
                <h3 className={styles.drawerTitle}>{ACTION_DRAWER_TITLE[state.activeAction]}</h3>
              </div>
              <div className={styles.operationFormGrid}>
                <TextField
                  label={ACTION_FIELD_LABEL[state.activeAction]}
                  name="operationTitle"
                  placeholder="Ej. Transferencia o servicio"
                  value={state.operationForm.title}
                  error={state.operationForm.errors.title}
                  onChange={(e) => changeOperationField('title', e.target.value)}
                />
                <TextField
                  label="Monto (USD)"
                  name="operationAmount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={state.operationForm.amount}
                  error={state.operationForm.errors.amount}
                  onChange={(e) => changeOperationField('amount', e.target.value)}
                />
              </div>
              <div className={styles.drawerActions}>
                <Button
                  variant="secondary"
                  className={styles.drawerButton}
                  onClick={closeQuickAction}
                >
                  Cancelar
                </Button>
                <Button type="submit" className={styles.drawerButton}>
                  Confirmar operación
                </Button>
              </div>
            </form>
          )}
        </section>

        <section className={styles.sectionCard} aria-label="Movimientos recientes">
          <div className={styles.transactionsHeader}>
            <h2 className={styles.sectionTitle}>Movimientos recientes</h2>
            <div className={styles.controlsBar}>
              <div
                className={styles.filterTabs}
                role="group"
                aria-label="Filtrar por tipo de movimiento"
              >
                {FILTER_OPTIONS.map((option) => {
                  const active = state.filterType === option.type;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      className={active ? styles.filterTabActive : styles.filterTab}
                      aria-pressed={active}
                      onClick={() => setFilterType(option.type)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <input
                type="search"
                className={styles.searchInput}
                aria-label="Buscar movimiento"
                placeholder="Buscar por concepto o categoría…"
                value={state.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {visibleTransactions.length > 0 ? (
            <ul className={styles.transactionList} aria-label="Lista de movimientos">
              {visibleTransactions.map((tx) => (
                <li key={tx.id} className={styles.transactionItem}>
                  <div className={styles.txInfo}>
                    <span className={styles.txTitle}>{tx.title}</span>
                    <span className={styles.txMeta}>
                      {tx.category} · {tx.dateLabel}
                    </span>
                  </div>
                  <strong
                    className={
                      tx.type === 'income' ? styles.txAmountIncome : styles.txAmountExpense
                    }
                  >
                    {formatCurrency(tx.amount, {
                      sign: tx.type === 'income' ? 'positive' : 'negative',
                      hidden: state.balanceHidden,
                    })}
                  </strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>{MESSAGES.EMPTY_TRANSACTIONS}</p>
              <Button variant="secondary" className={styles.drawerButton} onClick={resetFilters}>
                Restablecer filtros
              </Button>
            </div>
          )}
        </section>
      </div>

      {state.toastMessage && <Toast message={state.toastMessage} onDismiss={dismissToast} />}
    </div>
  );
}
