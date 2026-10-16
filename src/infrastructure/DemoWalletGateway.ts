import type { WalletGateway } from '@/application/ports/WalletGateway';
import type { WalletOverview } from '@/domain/wallet';

/** Muestras ficticias transcritas de los frames 13:2 y 11:2; sin operaciones. */
export class DemoWalletGateway implements WalletGateway {
  getOverview(): WalletOverview {
    return {
      balance: '$1,922.90',
      currency: 'MXN',
      indicators: [
        { label: 'Ingresos del mes', value: '+$4,250.00', detail: 'vs mes anterior ↑12%' },
        { label: 'Gastos del mes', value: '-$1,840.50', detail: 'vs mes anterior ↑5%' },
        { label: 'Movimientos', value: '24', detail: 'Este mes' },
      ],
      movements: [
        {
          id: 'maria',
          name: 'María González',
          category: 'Transferencia',
          date: 'Hoy 14:23',
          amount: '+$250.00',
          direction: 'in',
        },
        {
          id: 'netflix',
          name: 'Netflix',
          category: 'Suscripción',
          date: 'Hoy 09:15',
          amount: '-$35.90',
          direction: 'out',
        },
        {
          id: 'bbva',
          name: 'Recarga BBVA',
          category: 'Depósito',
          date: 'Ayer 18:42',
          amount: '+$500.00',
          direction: 'in',
        },
        {
          id: 'spotify',
          name: 'Spotify',
          category: 'Suscripción',
          date: 'Ayer 08:00',
          amount: '-$19.90',
          direction: 'out',
        },
        {
          id: 'carlos',
          name: 'Carlos Méndez',
          category: 'Transferencia',
          date: '29 May',
          amount: '+$1,200.00',
          direction: 'in',
        },
      ],
      card: { maskedNumber: '5294 •••• •••• 4827', expiry: '12/29' },
      categories: [
        { label: 'Suscripciones', amount: '$55.80', indicator: 30, tone: 'expense' },
        { label: 'Transferencias', amount: '$1,450.00', indicator: 65, tone: 'income' },
        { label: 'Recargas', amount: '$500.00', indicator: 18, tone: 'neutral' },
      ],
    };
  }
}
