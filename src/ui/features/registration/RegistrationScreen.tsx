import type { RegisterUser } from '@/application/registerUser';
import { AuthScreen } from '@/ui/layout/AuthScreen/AuthScreen';
import { RegistrationForm } from './RegistrationForm';

type RegistrationScreenProps = {
  registerUser: RegisterUser;
  onSuccess: () => void;
  onNavigateLogin: () => void;
};

export function RegistrationScreen(props: RegistrationScreenProps) {
  return (
    <AuthScreen
      brandVariant="registration"
      contentPosition="registration"
      brandTitle={'Comienza tu\ncamino financiero.'}
      brandSubtitle="Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."
    >
      <RegistrationForm {...props} />
    </AuthScreen>
  );
}
