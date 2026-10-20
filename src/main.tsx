import { createDemoDiagnostics } from '@/infrastructure/demoDiagnostics';
import { createRegister } from '@/application/register';
import {
  FakeRegistrationGateway,
  registrationMode,
} from '@/infrastructure/FakeRegistrationGateway';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAuthenticate } from '@/application/authenticate';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { loadDemoAccounts } from '@/infrastructure/loadDemoAccounts';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import { App } from './App';

// Raíz de composición: único lugar que conoce las implementaciones concretas (Constitución 2.5).
const accounts = loadDemoAccounts(import.meta.env.VITE_DEMO_USERS);
const authenticate = createAuthenticate(new InMemoryAuthGateway(accounts));

const register = createRegister(
  new FakeRegistrationGateway(registrationMode(import.meta.env.VITE_DEMO_REGISTRATION_MODE)),
  createDemoDiagnostics(),
);
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App authenticate={authenticate} register={register} />
    </StrictMode>,
  );
}
