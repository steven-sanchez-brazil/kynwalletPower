import type { AccountStore } from '@/application/ports/AccountStore';
import type { DemoAccount } from '@/domain/auth';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class InMemoryAccountStore implements AccountStore {
  private accounts: DemoAccount[];

  constructor(initialAccounts: readonly DemoAccount[] = []) {
    this.accounts = [...initialAccounts];
  }

  getAccounts(): readonly DemoAccount[] {
    return [...this.accounts];
  }

  findByEmail(email: string): DemoAccount | undefined {
    const target = normalizeEmail(email);
    return this.accounts.find((acc) => normalizeEmail(acc.email) === target);
  }

  saveAccount(account: DemoAccount): void {
    const normalized = normalizeEmail(account.email);
    if (this.findByEmail(normalized)) {
      throw new Error(`Account with email ${normalized} already exists`);
    }
    this.accounts.push({
      ...account,
      email: normalized,
    });
  }
}
