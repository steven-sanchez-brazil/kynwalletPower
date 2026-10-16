import type { WalletGateway } from './ports/WalletGateway';

export function readWalletOverview(gateway: WalletGateway) {
  return gateway.getOverview();
}
