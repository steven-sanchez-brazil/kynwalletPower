import type {
  AuthResult,
  LoginCredentials,
  RegisterAccountInput,
  RegisterResult,
} from '@/domain/auth';

/** Puerto de autenticación y registro (contracts/auth-gateway.md, contracts/register-gateway.md). */
export interface AuthGateway {
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
  register?(input: RegisterAccountInput): Promise<RegisterResult>;
}
