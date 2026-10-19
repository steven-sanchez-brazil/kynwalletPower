import { useMemo, useReducer } from 'react';
import {
  calculateWalletSummary,
  filterTransactions,
  type QuickActionType,
  type TransactionFilterType,
} from '@/domain/wallet';
import { homeReducer, initialHomeState } from './homeReducer';

export function useHomeDashboard() {
  const [state, dispatch] = useReducer(homeReducer, initialHomeState);

  const summary = useMemo(() => calculateWalletSummary(state.transactions), [state.transactions]);

  const visibleTransactions = useMemo(
    () =>
      filterTransactions(state.transactions, {
        type: state.filterType,
        query: state.searchQuery,
      }),
    [state.transactions, state.filterType, state.searchQuery],
  );

  return {
    state,
    summary,
    visibleTransactions,
    toggleBalancePrivacy: () => dispatch({ type: 'toggleBalancePrivacy' }),
    setFilterType: (filterType: TransactionFilterType) =>
      dispatch({ type: 'setFilterType', filterType }),
    setSearchQuery: (query: string) => dispatch({ type: 'setSearchQuery', query }),
    resetFilters: () => dispatch({ type: 'resetFilters' }),
    openQuickAction: (action: QuickActionType) => dispatch({ type: 'openQuickAction', action }),
    closeQuickAction: () => dispatch({ type: 'closeQuickAction' }),
    changeOperationField: (field: 'title' | 'amount', value: string) =>
      dispatch({ type: 'changeOperationField', field, value }),
    submitQuickOperation: () => dispatch({ type: 'submitQuickOperation' }),
    showToast: (message: string) => dispatch({ type: 'showToast', message }),
    dismissToast: () => dispatch({ type: 'dismissToast' }),
  };
}
