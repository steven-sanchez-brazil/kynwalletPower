import type { ReactNode } from 'react';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
export function RegistrationScreen({ children }: { children: ReactNode }) {
  return <AuthLayout registration>{children}</AuthLayout>;
}
