import type { ReactNode } from 'react';
import { AuthScreen } from '@/ui/layout/AuthScreen/AuthScreen';

export function LoginScreen({ children }: { children: ReactNode }) {
  return <AuthScreen>{children}</AuthScreen>;
}
