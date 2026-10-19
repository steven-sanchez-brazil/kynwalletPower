import { MESSAGES } from '@/domain/messages';
import { INITIAL_TRANSACTIONS, calculateWalletSummary } from '@/domain/wallet';
import { homeReducer, initialHomeState } from './homeReducer';

describe('homeReducer (US1, US2, US3, US4)', () => {
  it('US1-1 y US1-3: estado inicial y toggleBalancePrivacy alternan balanceHidden', () => {
    expect(initialHomeState.balanceHidden).toBe(false);
    expect(initialHomeState.filterType).toBe('all');
    expect(initialHomeState.searchQuery).toBe('');
    expect(initialHomeState.transactions).toEqual(INITIAL_TRANSACTIONS);

    const hidden = homeReducer(initialHomeState, { type: 'toggleBalancePrivacy' });
    expect(hidden.balanceHidden).toBe(true);

    const visible = homeReducer(hidden, { type: 'toggleBalancePrivacy' });
    expect(visible.balanceHidden).toBe(false);
  });

  it('US2-2, US2-3 y US2-4: setFilterType y setSearchQuery actualizan los criterios de filtrado', () => {
    const incomeOnly = homeReducer(initialHomeState, {
      type: 'setFilterType',
      filterType: 'income',
    });
    expect(incomeOnly.filterType).toBe('income');

    const withSearch = homeReducer(incomeOnly, {
      type: 'setSearchQuery',
      query: 'Nómina',
    });
    expect(withSearch.searchQuery).toBe('Nómina');

    const reset = homeReducer(withSearch, { type: 'resetFilters' });
    expect(reset.filterType).toBe('all');
    expect(reset.searchQuery).toBe('');
  });

  it('US3-1, US3-2 y US3-3: openQuickAction, validación y submitQuickOperation actualizan transacciones y saldo', () => {
    const opened = homeReducer(initialHomeState, { type: 'openQuickAction', action: 'topup' });
    expect(opened.activeAction).toBe('topup');

    // Intento inválido con campos vacíos
    const invalidAttempt = homeReducer(opened, { type: 'submitQuickOperation' });
    expect(invalidAttempt.activeAction).toBe('topup');
    expect(invalidAttempt.operationForm.errors.title).toBe(MESSAGES.OPERATION_DESCRIPTION_REQUIRED);
    expect(invalidAttempt.operationForm.errors.amount).toBe(MESSAGES.OPERATION_AMOUNT_INVALID);

    // Completar datos válidos de recarga
    let editing = homeReducer(invalidAttempt, {
      type: 'changeOperationField',
      field: 'title',
      value: 'Depósito extra',
    });
    editing = homeReducer(editing, {
      type: 'changeOperationField',
      field: 'amount',
      value: '500',
    });

    const submitted = homeReducer(editing, { type: 'submitQuickOperation' });
    expect(submitted.activeAction).toBeNull();
    expect(submitted.toastMessage).toBe(MESSAGES.OPERATION_SUCCESS);
    expect(submitted.transactions[0]?.title).toBe('Depósito extra');
    expect(calculateWalletSummary(submitted.transactions).availableBalance).toBe(2950);
  });

  it('US4-3: showToast y dismissToast gestionan avisos informativos', () => {
    const withToast = homeReducer(initialHomeState, {
      type: 'showToast',
      message: MESSAGES.COMING_SOON,
    });
    expect(withToast.toastMessage).toBe('Próximamente');

    const cleared = homeReducer(withToast, { type: 'dismissToast' });
    expect(cleared.toastMessage).toBeNull();
  });
});
