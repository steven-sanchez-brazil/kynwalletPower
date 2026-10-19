import { MESSAGES } from './messages';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  'Ingresos' | 'Transferencia' | 'Servicios' | 'Compras' | 'Recarga';

export type WalletTransaction = {
  readonly id: string;
  readonly title: string;
  readonly category: TransactionCategory;
  readonly type: TransactionType;
  readonly amount: number;
  readonly dateLabel: string;
};

export type WalletSummary = {
  readonly availableBalance: number;
  readonly totalIncome: number;
  readonly totalExpenses: number;
  readonly incomeSharePercent: number;
};

export type TransactionFilterType = 'all' | 'income' | 'expense';

export type TransactionFilterCriteria = {
  readonly type: TransactionFilterType;
  readonly query: string;
};

export type QuickOperationKind = 'topup' | 'send' | 'pay';

export type QuickActionType = QuickOperationKind | 'receive';

export type QuickOperationInput = {
  readonly kind: QuickOperationKind;
  readonly title: string;
  readonly amountRaw: string;
};

export type QuickOperationErrors = {
  title?: string;
  amount?: string;
};

const MAX_DESCRIPTION_LENGTH = 60;
const MAX_OPERATION_AMOUNT = 999999.99;
const AMOUNT_FORMAT_REGEX = /^\d+(\.\d{1,2})?$/;

export const INITIAL_TRANSACTIONS: readonly WalletTransaction[] = [
  {
    id: 'tx-1',
    title: 'Pago de Nómina',
    category: 'Ingresos',
    type: 'income',
    amount: 2500,
    dateLabel: 'Hoy, 09:00',
  },
  {
    id: 'tx-2',
    title: 'Transferencia recibida',
    category: 'Transferencia',
    type: 'income',
    amount: 700,
    dateLabel: 'Ayer, 18:15',
  },
  {
    id: 'tx-3',
    title: 'Supermercado Central',
    category: 'Compras',
    type: 'expense',
    amount: 320,
    dateLabel: '15 oct 2026',
  },
  {
    id: 'tx-4',
    title: 'Pago de Electricidad',
    category: 'Servicios',
    type: 'expense',
    amount: 180,
    dateLabel: '14 oct 2026',
  },
  {
    id: 'tx-5',
    title: 'Envío a familiar',
    category: 'Transferencia',
    type: 'expense',
    amount: 250,
    dateLabel: '12 oct 2026',
  },
];

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function calculateWalletSummary(transactions: readonly WalletTransaction[]): WalletSummary {
  let income = 0;
  let expenses = 0;

  for (const tx of transactions) {
    if (tx.type === 'income') {
      income += tx.amount;
    } else {
      expenses += tx.amount;
    }
  }

  const totalIncome = roundCurrency(income);
  const totalExpenses = roundCurrency(expenses);
  const availableBalance = roundCurrency(totalIncome - totalExpenses);
  const volume = totalIncome + totalExpenses;
  const incomeSharePercent = volume > 0 ? Math.round((totalIncome / volume) * 100) : 0;

  return {
    availableBalance,
    totalIncome,
    totalExpenses,
    incomeSharePercent,
  };
}

export function formatCurrency(
  amount: number,
  options?: { sign?: 'positive' | 'negative' | 'none'; hidden?: boolean },
): string {
  if (options?.hidden) {
    return '••••••';
  }

  const absoluteFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (options?.sign === 'positive') {
    return `+${absoluteFormatted}`;
  }
  if (options?.sign === 'negative') {
    return `-${absoluteFormatted}`;
  }
  return absoluteFormatted;
}

export function filterTransactions(
  transactions: readonly WalletTransaction[],
  criteria: TransactionFilterCriteria,
): WalletTransaction[] {
  const normalizedQuery = normalizeSearchText(criteria.query);

  return transactions.filter((tx) => {
    if (criteria.type !== 'all' && tx.type !== criteria.type) {
      return false;
    }
    if (normalizedQuery.length === 0) {
      return true;
    }
    const searchable = normalizeSearchText(`${tx.title} ${tx.category}`);
    return searchable.includes(normalizedQuery);
  });
}

export function validateQuickOperation(
  input: QuickOperationInput,
  availableBalance: number,
): QuickOperationErrors {
  const errors: QuickOperationErrors = {};
  const trimmedTitle = input.title.trim();

  if (trimmedTitle.length === 0) {
    errors.title = MESSAGES.OPERATION_DESCRIPTION_REQUIRED;
  } else if (trimmedTitle.length > MAX_DESCRIPTION_LENGTH) {
    errors.title = MESSAGES.OPERATION_DESCRIPTION_TOO_LONG;
  }

  const trimmedAmount = input.amountRaw.trim();
  if (!AMOUNT_FORMAT_REGEX.test(trimmedAmount)) {
    errors.amount = MESSAGES.OPERATION_AMOUNT_INVALID;
    return errors;
  }

  const parsedAmount = Number(trimmedAmount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    errors.amount = MESSAGES.OPERATION_AMOUNT_INVALID;
  } else if (parsedAmount > MAX_OPERATION_AMOUNT) {
    errors.amount = MESSAGES.OPERATION_AMOUNT_TOO_HIGH;
  } else if (input.kind !== 'topup' && parsedAmount > availableBalance) {
    errors.amount = MESSAGES.INSUFFICIENT_BALANCE;
  }

  return errors;
}

const CATEGORY_BY_KIND: Record<QuickOperationKind, TransactionCategory> = {
  topup: 'Recarga',
  send: 'Transferencia',
  pay: 'Servicios',
};

export function createQuickTransaction(
  input: QuickOperationInput,
  id = `tx-${Date.now()}`,
): WalletTransaction {
  return {
    id,
    title: input.title.trim(),
    category: CATEGORY_BY_KIND[input.kind],
    type: input.kind === 'topup' ? 'income' : 'expense',
    amount: roundCurrency(Number(input.amountRaw.trim())),
    dateLabel: 'Ahora mismo',
  };
}

export function buildUserAlias(name: string): string {
  const slug = normalizeSearchText(name)
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `${slug || 'usuario'}.kyn`;
}
