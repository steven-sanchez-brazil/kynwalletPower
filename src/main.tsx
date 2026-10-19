import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import { consoleDiagnostics } from '@/infrastructure/consoleDiagnostics';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { loadDemoAccounts } from '@/infrastructure/loadDemoAccounts';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import { App } from './App';

// Raíz de composición: único lugar que conoce las implementaciones concretas (Constitución 2.5).
// Una sola instancia comparte la colección de cuentas entre el login y el registro; recargar la
// página la descarta, junto con las cuentas registradas.
const accounts = loadDemoAccounts(import.meta.env.VITE_DEMO_USERS);
const gateway = new InMemoryAuthGateway(accounts);
const authenticate = createAuthenticate(gateway);
const registerAccount = createRegisterAccount(gateway, consoleDiagnostics);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <App authenticate={authenticate} registerAccount={registerAccount} />
      </BrowserRouter>
    </StrictMode>,
  );
}
