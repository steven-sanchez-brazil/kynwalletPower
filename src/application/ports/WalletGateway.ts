import type { WalletOverview } from '@/domain/wallet';

export interface WalletGateway {
  getOverview(): WalletOverview;
}
