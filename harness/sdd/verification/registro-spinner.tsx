import { createRoot } from 'react-dom/client';
import { createRegister } from '@/application/register';
import { SimulatedRegistrationGateway } from '@/infrastructure/SimulatedRegistrationGateway';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegistrationForm } from '@/ui/features/registration/RegistrationForm';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';

// Solo fixture visual del servidor de desarrollo. Prolonga el estado para capturarlo;
// main.tsx y la aplicación real conservan el envío de 1000 ms, probado por separado.
const register = createRegister(new SimulatedRegistrationGateway(10000));
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <LoginScreen variant="registration">
      <p>Verificación visual: envío extendido a 10 segundos para capturar el indicador.</p>
      <RegistrationForm register={register} onSuccess={() => undefined} />
    </LoginScreen>,
  );
}
