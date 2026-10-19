import type { DemoAccount } from '@/domain/auth';
import {
  isValidDisplayName,
  isValidEmail,
  isValidPasswordLength,
  normalizeDisplayName,
  normalizeEmail,
} from '@/domain/validation';

function toAccount(value: unknown): DemoAccount | null {
  if (typeof value !== 'object' || value === null) return null;
  const { email, password, displayName } = value as Record<string, unknown>;
  if (typeof email !== 'string' || typeof password !== 'string') return null;
  if (typeof displayName !== 'string') return null;

  if (
    !isValidEmail(email) ||
    !isValidPasswordLength(password) ||
    !isValidDisplayName(displayName)
  ) {
    return null;
  }

  return {
    email: normalizeEmail(email),
    password,
    displayName: normalizeDisplayName(displayName),
  };
}

/**
 * Lee las cuentas de demostración de la configuración externa (VITE_DEMO_USERS).
 * Devuelve null si la configuración falta o es inválida (contracts/auth-gateway.md).
 */
export function loadDemoAccounts(raw: string | undefined): DemoAccount[] | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  const accounts: DemoAccount[] = [];
  for (const item of parsed) {
    const account = toAccount(item);
    if (!account) return null;
    accounts.push(account);
  }
  const uniqueEmails = new Set(accounts.map((account) => account.email));
  return uniqueEmails.size === accounts.length ? accounts : null;
}
