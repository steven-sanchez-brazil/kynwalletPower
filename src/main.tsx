import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAuthenticate } from '@/application/authenticate';
import { createRegister } from '@/application/register';
import { InMemoryAccountStore } from '@/infrastructure/InMemoryAccountStore';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { InMemoryRegistrationGateway } from '@/infrastructure/InMemoryRegistrationGateway';
import { loadDemoAccounts } from '@/infrastructure/loadDemoAccounts';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import { App } from './App';

// Raíz de composición: único lugar que conoce las implementaciones concretas (Constitución 2.5).
const demoAccounts = loadDemoAccounts(import.meta.env.VITE_DEMO_USERS);
const accountStore = new InMemoryAccountStore(demoAccounts ?? []);
const authGateway = new InMemoryAuthGateway(accountStore);
const registrationGateway = new InMemoryRegistrationGateway(accountStore);

const authenticate = createAuthenticate(authGateway);
const register = createRegister(registrationGateway);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App authenticate={authenticate} register={register} />
    </StrictMode>,
  );
}
