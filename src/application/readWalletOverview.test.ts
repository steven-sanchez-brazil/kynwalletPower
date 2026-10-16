import { readWalletOverview } from './readWalletOverview';

describe('Inicio FR-003 · puerto de consulta', () => {
  it('devuelve el snapshot del puerto sin cambiar datos ni requerir credenciales', () => {
    const snapshot = {
      balance: '$1,922.90',
      currency: 'MXN' as const,
      indicators: [],
      movements: [],
      card: { maskedNumber: '', expiry: '' },
      categories: [],
    };
    const gateway = { getOverview: vi.fn(() => snapshot) };
    expect(readWalletOverview(gateway)).toBe(snapshot);
    expect(gateway.getOverview).toHaveBeenCalledExactlyOnceWith();
  });
});
