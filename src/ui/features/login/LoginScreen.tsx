import type { ReactNode } from 'react';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
export function LoginScreen({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
