import { TEST_ACCOUNT } from '@/test/fixtures';
import {
  LocalStorageUserGateway,
  REGISTERED_USERS_STORAGE_KEY,
  loadRegisteredUsers,
} from './LocalStorageUserGateway';

describe('LocalStorageUserGateway (contracts/registration-gateway.md)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('R1 y R3: persiste RegisteredUserRecord en localStorage con passwordDigest y sin contraseña en texto plano', async () => {
    const gateway = new LocalStorageUserGateway([TEST_ACCOUNT]);
    const secret = 'KynWallet2026!';
    const result = await gateway.register({
      fullName: '  Ana Gómez  ',
      email: '  Ana.Gomez@Example.test ',
      password: secret,
      acceptedTerms: true,
    });

    expect(result).toEqual({ kind: 'success' });

    const raw = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(raw).not.toContain(secret);

    const records = loadRegisteredUsers();
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      email: 'ana.gomez@example.test',
      displayName: 'Ana Gómez',
      acceptedTerms: true,
    });
    expect(records[0]?.passwordDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(records[0]?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('R2: rechaza un correo que ya existe en localStorage (sin distinguir mayúsculas)', async () => {
    const gateway = new LocalStorageUserGateway([]);
    await gateway.register({
      fullName: 'Ana Gómez',
      email: 'ana@example.test',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });

    const duplicate = await gateway.register({
      fullName: 'Otra Ana',
      email: '  ANA@example.test ',
      password: 'OtraPassword2026!',
      acceptedTerms: true,
    });

    expect(duplicate).toEqual({ kind: 'email-already-exists' });
    expect(loadRegisteredUsers()).toHaveLength(1);
  });

  it('R2: rechaza un correo que ya pertenece a las cuentas de demostración (VITE_DEMO_USERS)', async () => {
    const gateway = new LocalStorageUserGateway([TEST_ACCOUNT]);
    const duplicate = await gateway.register({
      fullName: 'Steven Clon',
      email: TEST_ACCOUNT.email.toUpperCase(),
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });

    expect(duplicate).toEqual({ kind: 'email-already-exists' });
    expect(loadRegisteredUsers()).toHaveLength(0);
  });

  it('R4: devuelve storage-error sin rechazar la promesa si localStorage.setItem lanza excepción', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    const gateway = new LocalStorageUserGateway([]);
    await expect(
      gateway.register({
        fullName: 'Ana Gómez',
        email: 'ana@example.test',
        password: 'KynWallet2026!',
        acceptedTerms: true,
      }),
    ).resolves.toEqual({ kind: 'storage-error' });
  });

  it('R4: maneja contenido corrupto en localStorage de forma segura', async () => {
    window.localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, '{invalid-json');
    expect(loadRegisteredUsers()).toEqual([]);

    const gateway = new LocalStorageUserGateway([]);
    const result = await gateway.register({
      fullName: 'Ana Gómez',
      email: 'ana@example.test',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });
    expect(result).toEqual({ kind: 'success' });
    expect(loadRegisteredUsers()).toHaveLength(1);
  });
});
