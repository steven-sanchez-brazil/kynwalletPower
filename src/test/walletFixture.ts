import { DemoWalletGateway } from '@/infrastructure/DemoWalletGateway';

export const WALLET_FIXTURE = new DemoWalletGateway().getOverview();
