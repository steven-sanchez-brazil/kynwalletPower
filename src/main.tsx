import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import { InMemoryAccountRegistry } from '@/infrastructure/InMemoryAccountRegistry';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { loadDemoAccounts } from '@/infrastructure/loadDemoAccounts';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import { App } from './App';

// Raíz de composición: único lugar que conoce las implementaciones concretas (Constitución 2.5).
// Login y registro comparten la misma lista en memoria (002, research.md R4).
const accounts = loadDemoAccounts(import.meta.env.VITE_DEMO_USERS);
const authenticate = createAuthenticate(new InMemoryAuthGateway(accounts));
const registerAccount = createRegisterAccount(new InMemoryAccountRegistry(accounts));

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App authenticate={authenticate} registerAccount={registerAccount} />
    </StrictMode>,
  );
}
