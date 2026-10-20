import { describe, expect, it } from 'vitest';
import type { DemoAccount } from '@/domain/auth';
import { InMemoryAccountStore } from './InMemoryAccountStore';

const INITIAL_ACCOUNT: DemoAccount = {
  email: 'steven.luna@example.test',
  password: 'Password123!',
  displayName: 'Steven Luna',
};

describe('InMemoryAccountStore', () => {
  it('inicializa vacío si no se proporcionan cuentas iniciales', () => {
    const store = new InMemoryAccountStore();
    expect(store.getAccounts()).toEqual([]);
  });

  it('inicializa con las cuentas pasadas en el constructor', () => {
    const store = new InMemoryAccountStore([INITIAL_ACCOUNT]);
    expect(store.getAccounts()).toHaveLength(1);
    expect(store.getAccounts()[0]?.email).toBe('steven.luna@example.test');
  });

  it('busca cuentas por correo normalizado (minúsculas y sin espacios)', () => {
    const store = new InMemoryAccountStore([INITIAL_ACCOUNT]);
    const found = store.findByEmail('  STEVEN.LUNA@EXAMPLE.TEST  ');
    expect(found).toBeDefined();
    expect(found?.displayName).toBe('Steven Luna');
  });

  it('retorna undefined si el correo no existe', () => {
    const store = new InMemoryAccountStore([INITIAL_ACCOUNT]);
    expect(store.findByEmail('inexistente@example.test')).toBeUndefined();
  });

  it('permite registrar una nueva cuenta exitosamente', () => {
    const store = new InMemoryAccountStore([INITIAL_ACCOUNT]);
    const newAccount: DemoAccount = {
      email: 'carlos@example.test',
      password: 'Password123!',
      displayName: 'Carlos Mendoza',
    };
    store.saveAccount(newAccount);

    expect(store.getAccounts()).toHaveLength(2);
    expect(store.findByEmail('carlos@example.test')).toBeDefined();
  });

  it('lanza un error si se intenta registrar un correo ya existente', () => {
    const store = new InMemoryAccountStore([INITIAL_ACCOUNT]);
    const duplicate: DemoAccount = {
      email: 'STEVEN.LUNA@example.test',
      password: 'OtraPassword123!',
      displayName: 'Steven Duplicado',
    };

    expect(() => store.saveAccount(duplicate)).toThrow();
  });
});
