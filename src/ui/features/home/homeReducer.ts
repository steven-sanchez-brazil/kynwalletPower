import { MESSAGES } from '@/domain/messages';
import {
  INITIAL_TRANSACTIONS,
  calculateWalletSummary,
  createQuickTransaction,
  validateQuickOperation,
  type QuickActionType,
  type QuickOperationErrors,
  type TransactionFilterType,
  type WalletTransaction,
} from '@/domain/wallet';

export type OperationFormState = {
  readonly title: string;
  readonly amount: string;
  readonly errors: QuickOperationErrors;
};

export type HomeState = {
  readonly transactions: readonly WalletTransaction[];
  readonly balanceHidden: boolean;
  readonly filterType: TransactionFilterType;
  readonly searchQuery: string;
  readonly activeAction: QuickActionType | null;
  readonly operationForm: OperationFormState;
  readonly toastMessage: string | null;
};

export type HomeAction =
  | { type: 'toggleBalancePrivacy' }
  | { type: 'setFilterType'; filterType: TransactionFilterType }
  | { type: 'setSearchQuery'; query: string }
  | { type: 'resetFilters' }
  | { type: 'openQuickAction'; action: QuickActionType }
  | { type: 'closeQuickAction' }
  | { type: 'changeOperationField'; field: 'title' | 'amount'; value: string }
  | { type: 'submitQuickOperation' }
  | { type: 'showToast'; message: string }
  | { type: 'dismissToast' };

const EMPTY_OPERATION_FORM: OperationFormState = {
  title: '',
  amount: '',
  errors: {},
};

export const initialHomeState: HomeState = {
  transactions: INITIAL_TRANSACTIONS,
  balanceHidden: false,
  filterType: 'all',
  searchQuery: '',
  activeAction: null,
  operationForm: EMPTY_OPERATION_FORM,
  toastMessage: null,
};

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'toggleBalancePrivacy':
      return {
        ...state,
        balanceHidden: !state.balanceHidden,
      };

    case 'setFilterType':
      return {
        ...state,
        filterType: action.filterType,
      };

    case 'setSearchQuery':
      return {
        ...state,
        searchQuery: action.query,
      };

    case 'resetFilters':
      return {
        ...state,
        filterType: 'all',
        searchQuery: '',
      };

    case 'openQuickAction':
      return {
        ...state,
        activeAction: state.activeAction === action.action ? null : action.action,
        operationForm: EMPTY_OPERATION_FORM,
      };

    case 'closeQuickAction':
      return {
        ...state,
        activeAction: null,
        operationForm: EMPTY_OPERATION_FORM,
      };

    case 'changeOperationField': {
      const nextErrors: QuickOperationErrors =
        action.field === 'title'
          ? { amount: state.operationForm.errors.amount }
          : { title: state.operationForm.errors.title };
      return {
        ...state,
        operationForm: {
          ...state.operationForm,
          [action.field]: action.value,
          errors: nextErrors,
        },
      };
    }

    case 'submitQuickOperation': {
      if (!state.activeAction || state.activeAction === 'receive') {
        return state;
      }

      const summary = calculateWalletSummary(state.transactions);
      const input = {
        kind: state.activeAction,
        title: state.operationForm.title,
        amountRaw: state.operationForm.amount,
      };
      const errors = validateQuickOperation(input, summary.availableBalance);

      if (errors.title || errors.amount) {
        return {
          ...state,
          operationForm: {
            ...state.operationForm,
            errors,
          },
        };
      }

      const newTx = createQuickTransaction(input, `tx-${state.transactions.length + 1}`);

      return {
        ...state,
        transactions: [newTx, ...state.transactions],
        activeAction: null,
        operationForm: EMPTY_OPERATION_FORM,
        toastMessage: MESSAGES.OPERATION_SUCCESS,
      };
    }

    case 'showToast':
      return {
        ...state,
        toastMessage: action.message,
      };

    case 'dismissToast':
      return {
        ...state,
        toastMessage: null,
      };
  }
}
