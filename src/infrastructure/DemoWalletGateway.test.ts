import { DemoWalletGateway } from './DemoWalletGateway';

describe('Inicio FR-003 · datos ficticios de Figma', () => {
  it('conserva importes y orden de ambas variantes, sin datos de acceso', () => {
    const gateway = new DemoWalletGateway();
    const overview = gateway.getOverview();
    expect(overview.balance).toBe('$1,922.90');
    expect(overview.currency).toBe('MXN');
    expect(overview.indicators.map((item) => item.value)).toEqual([
      '+$4,250.00',
      '-$1,840.50',
      '24',
    ]);
    expect(overview.movements.map((item) => [item.name, item.amount])).toEqual([
      ['María González', '+$250.00'],
      ['Netflix', '-$35.90'],
      ['Recarga BBVA', '+$500.00'],
      ['Spotify', '-$19.90'],
      ['Carlos Méndez', '+$1,200.00'],
    ]);
    expect(overview.card).toEqual({ maskedNumber: '5294 •••• •••• 4827', expiry: '12/29' });
    expect(overview.categories.map((item) => item.amount)).toEqual([
      '$55.80',
      '$1,450.00',
      '$500.00',
    ]);
    expect(JSON.stringify(overview)).not.toMatch(/password|email|diego@/i);
    expect(gateway.getOverview()).toEqual(overview);
  });
});
