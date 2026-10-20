import { createRegisterUser } from './registerUser';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';
import type { RegistrationSimulator } from './ports/RegistrationSimulator';
import type { RegistrationTelemetry } from './ports/RegistrationTelemetry';

describe('createRegisterUser contract', () => {
  const telemetry: RegistrationTelemetry = { record: vi.fn() };

  beforeEach(() => vi.clearAllMocks());

  it('FR-012: inválidos devuelven errores y no invocan el simulator', async () => {
    const simulator: RegistrationSimulator = { simulate: vi.fn() };
    const registerUser = createRegisterUser(simulator, telemetry);
    const result = await registerUser({ ...VALID_REGISTRATION, fullName: '' });
    expect(result.kind).toBe('invalid');
    expect(simulator.simulate).not.toHaveBeenCalled();
  });

  it('US1-1: válidos invocan una vez simulate sin argumentos', async () => {
    const simulator: RegistrationSimulator = {
      simulate: vi.fn().mockResolvedValue('success'),
    };
    const registerUser = createRegisterUser(simulator, telemetry);
    await expect(registerUser(VALID_REGISTRATION)).resolves.toEqual({ kind: 'success' });
    expect(simulator.simulate).toHaveBeenCalledOnce();
    expect(simulator.simulate).toHaveBeenCalledWith();
  });

  it('US1-4: un throw se traduce a unavailable sin detalles', async () => {
    const simulator: RegistrationSimulator = {
      simulate: vi.fn().mockRejectedValue(new Error('detalle interno')),
    };
    const registerUser = createRegisterUser(simulator, telemetry);
    await expect(registerUser(VALID_REGISTRATION)).resolves.toEqual({ kind: 'unavailable' });
  });
});
