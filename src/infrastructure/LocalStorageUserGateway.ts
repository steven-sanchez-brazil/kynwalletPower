import type { UserRegistrationGateway } from '@/application/ports/UserRegistrationGateway';
import type { DemoAccount } from '@/domain/auth';
import type {
  RegisteredUserRecord,
  RegistrationCommand,
  RegistrationResult,
} from '@/domain/registration';
import { FULL_NAME_MAX_LENGTH, isValidEmail, normalizeEmail } from '@/domain/validation';
import { hashPassword } from './passwordHash';

export const REGISTERED_USERS_STORAGE_KEY = 'kynwallet.registeredUsers';
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

function isValidRecord(value: unknown): value is RegisteredUserRecord {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.email !== 'string' ||
    typeof candidate.displayName !== 'string' ||
    typeof candidate.passwordDigest !== 'string' ||
    candidate.acceptedTerms !== true ||
    typeof candidate.createdAt !== 'string'
  ) {
    return false;
  }
  const name = candidate.displayName.trim();
  return (
    isValidEmail(candidate.email) &&
    name.length >= 1 &&
    name.length <= FULL_NAME_MAX_LENGTH &&
    SHA256_HEX_PATTERN.test(candidate.passwordDigest)
  );
}

/** Lee de forma segura los usuarios registrados en localStorage (FR-010, FR-017). */
export function loadRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecord);
  } catch {
    return [];
  }
}

/** Adaptador de registro en localStorage (contracts/registration-gateway.md). */
export class LocalStorageUserGateway implements UserRegistrationGateway {
  private readonly demoAccounts: readonly DemoAccount[];

  constructor(demoAccounts: readonly DemoAccount[] | null = []) {
    this.demoAccounts = demoAccounts ?? [];
  }

  async register(command: RegistrationCommand): Promise<RegistrationResult> {
    try {
      const email = normalizeEmail(command.email);
      const displayName = command.fullName.trim();
      const existingUsers = loadRegisteredUsers();

      const existsInDemo = this.demoAccounts.some(
        (account) => normalizeEmail(account.email) === email,
      );
      const existsInStorage = existingUsers.some((user) => normalizeEmail(user.email) === email);

      if (existsInDemo || existsInStorage) {
        return { kind: 'email-already-exists' };
      }

      const passwordDigest = await hashPassword(email, command.password);
      const record: RegisteredUserRecord = {
        email,
        displayName,
        passwordDigest,
        acceptedTerms: true,
        createdAt: new Date().toISOString(),
      };

      const nextUsers = [...existingUsers, record];
      window.localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
      return { kind: 'success' };
    } catch {
      return { kind: 'storage-error' };
    }
  }
}
