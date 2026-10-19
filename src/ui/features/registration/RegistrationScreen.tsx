import type { RegisterAccount } from '@/application/registerAccount';
import { AuthScreen } from '@/ui/layout/AuthScreen/AuthScreen';
import { RegistrationForm } from './RegistrationForm';

type RegistrationScreenProps = {
  registerAccount: RegisterAccount;
  onRegistered: () => void;
};

export function RegistrationScreen({ registerAccount, onRegistered }: RegistrationScreenProps) {
  return (
    <AuthScreen brand="registration">
      <RegistrationForm registerAccount={registerAccount} onRegistered={onRegistered} />
    </AuthScreen>
  );
}
