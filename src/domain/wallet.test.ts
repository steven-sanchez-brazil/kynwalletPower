import { MESSAGES } from './messages';
import {
  INITIAL_TRANSACTIONS,
  calculateWalletSummary,
  createQuickTransaction,
  filterTransactions,
  formatCurrency,
  validateQuickOperation,
} from './wallet';

describe('calculateWalletSummary y formatCurrency (US1, FR-003, FR-004, FR-009)', () => {
  it('US1-2: calcula availableBalance, totalIncome, totalExpenses e incomeSharePercent sobre INITIAL_TRANSACTIONS', () => {
    const summary = calculateWalletSummary(INITIAL_TRANSACTIONS);
    expect(summary).toEqual({
      availableBalance: 2450,
      totalIncome: 3200,
      totalExpenses: 750,
      incomeSharePercent: 81,
    });
  });

  it('devuelve ceros cuando no hay transacciones', () => {
    expect(calculateWalletSummary([])).toEqual({
      availableBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      incomeSharePercent: 0,
    });
  });

  it('US1-2 y US1-3: formatCurrency formatea montos en USD o devuelve "••••••" cuando hidden es true', () => {
    expect(formatCurrency(2450)).toBe('$2,450.00');
    expect(formatCurrency(3200, { sign: 'positive' })).toBe('+$3,200.00');
    expect(formatCurrency(750, { sign: 'negative' })).toBe('-$750.00');
    expect(formatCurrency(2450, { hidden: true })).toBe('••••••');
    expect(formatCurrency(3200, { sign: 'positive', hidden: true })).toBe('••••••');
  });
});

describe('filterTransactions (US2, FR-007, FR-008)', () => {
  it('US2-1: type="all" y query vacía devuelve todas las transacciones', () => {
    expect(filterTransactions(INITIAL_TRANSACTIONS, { type: 'all', query: '' })).toHaveLength(
      INITIAL_TRANSACTIONS.length,
    );
  });

  it('US2-2: type="income" devuelve únicamente ingresos', () => {
    const result = filterTransactions(INITIAL_TRANSACTIONS, { type: 'income', query: '' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((tx) => tx.type === 'income')).toBe(true);
  });

  it('US2-3: type="expense" devuelve únicamente gastos', () => {
    const result = filterTransactions(INITIAL_TRANSACTIONS, { type: 'expense', query: '' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((tx) => tx.type === 'expense')).toBe(true);
  });

  it('US2-4: filtra por texto sin distinguir mayúsculas ni tildes en title o category', () => {
    const byNomina = filterTransactions(INITIAL_TRANSACTIONS, {
      type: 'all',
      query: '  nomina ',
    });
    expect(byNomina).toHaveLength(1);
    expect(byNomina[0]?.title).toContain('Nómina');

    const byEmpty = filterTransactions(INITIAL_TRANSACTIONS, {
      type: 'all',
      query: 'inexistente-xyz',
    });
    expect(byEmpty).toEqual([]);
  });
});

describe('validateQuickOperation y createQuickTransaction (US3, FR-005, FR-006)', () => {
  it('US3-1 / US3-2: operación válida devuelve {} y crea la transacción normalizada', () => {
    expect(
      validateQuickOperation(
        { kind: 'topup', title: '  Depósito extra ', amountRaw: '500.50' },
        2450,
      ),
    ).toEqual({});

    const tx = createQuickTransaction({
      kind: 'send',
      title: '  Carlos Ruiz ',
      amountRaw: '150.25',
    });
    expect(tx).toMatchObject({
      title: 'Carlos Ruiz',
      category: 'Transferencia',
      type: 'expense',
      amount: 150.25,
    });
  });

  it('FR-006: valida descripción vacía o mayor a 60 caracteres', () => {
    expect(
      validateQuickOperation({ kind: 'topup', title: '   ', amountRaw: '100' }, 2450).title,
    ).toBe(MESSAGES.OPERATION_DESCRIPTION_REQUIRED);

    expect(
      validateQuickOperation({ kind: 'topup', title: 'A'.repeat(61), amountRaw: '100' }, 2450)
        .title,
    ).toBe(MESSAGES.OPERATION_DESCRIPTION_TOO_LONG);
  });

  it.each(['', '   ', '0', '-50', 'abc', '12.345'])(
    'FR-006: monto inválido (%j) → OPERATION_AMOUNT_INVALID',
    (amountRaw) => {
      expect(
        validateQuickOperation({ kind: 'topup', title: 'Recarga', amountRaw }, 2450).amount,
      ).toBe(MESSAGES.OPERATION_AMOUNT_INVALID);
    },
  );

  it('FR-006: monto superior a 999999.99 → OPERATION_AMOUNT_TOO_HIGH', () => {
    expect(
      validateQuickOperation({ kind: 'topup', title: 'Recarga', amountRaw: '1000000' }, 2450)
        .amount,
    ).toBe(MESSAGES.OPERATION_AMOUNT_TOO_HIGH);
  });

  it('US3-3 / FR-006: en send o pay un monto superior al saldo disponible → INSUFFICIENT_BALANCE', () => {
    expect(
      validateQuickOperation({ kind: 'send', title: 'Carlos', amountRaw: '2500' }, 2450).amount,
    ).toBe(MESSAGES.INSUFFICIENT_BALANCE);

    expect(
      validateQuickOperation({ kind: 'pay', title: 'Luz', amountRaw: '2450.01' }, 2450).amount,
    ).toBe(MESSAGES.INSUFFICIENT_BALANCE);

    // En topup sí permite superar el saldo actual
    expect(
      validateQuickOperation({ kind: 'topup', title: 'Bono', amountRaw: '5000' }, 2450),
    ).toEqual({});
  });
});
