import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAuthenticate } from '@/application/authenticate';
import { createRegister } from '@/application/register';
import { SimulatedRegistrationGateway } from '@/infrastructure/SimulatedRegistrationGateway';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { loadDemoAccounts } from '@/infrastructure/loadDemoAccounts';
import { DemoWalletGateway } from '@/infrastructure/DemoWalletGateway';
import { readWalletOverview } from '@/application/readWalletOverview';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import { App } from './App';

// Raíz de composición: único lugar que conoce las implementaciones concretas (Constitución 2.5).
const accounts = loadDemoAccounts(import.meta.env.VITE_DEMO_USERS);
const authenticate = createAuthenticate(new InMemoryAuthGateway(accounts));
const register = createRegister(new SimulatedRegistrationGateway());
const wallet = readWalletOverview(new DemoWalletGateway());

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App authenticate={authenticate} register={register} wallet={wallet} />
    </StrictMode>,
  );
}
