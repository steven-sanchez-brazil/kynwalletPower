import { createRegister } from './register';
import { registrationValues as valid, registrationSimulationStub } from '@/test/registrationStub';

describe('002/register · contrato', () => {
  it('valida antes del efecto y sin mutar', async () => {
    const simulation = registrationSimulationStub();
    const record = vi.fn();
    const register = createRegister(simulation, { record });
    const input = { ...valid, acceptedTerms: false };
    expect(await register(input, new AbortController().signal)).toEqual({
      kind: 'invalid',
      errors: { acceptedTerms: 'TERMS_REQUIRED' },
    });
    expect(simulation.complete).not.toHaveBeenCalled();
    expect(input.acceptedTerms).toBe(false);
    expect(record).toHaveBeenCalledWith({ code: 'validation_rejected' });
  });
  it('éxito sin datos y solo señal al simulador', async () => {
    const complete = vi.fn().mockResolvedValue(undefined);
    const record = vi.fn();
    const signal = new AbortController().signal;
    const result = await createRegister({ complete }, { record })(valid, signal);
    expect(result).toEqual({ kind: 'success' });
    expect(complete).toHaveBeenCalledExactlyOnceWith(signal);
    expect(record.mock.calls.map((call) => call[0].code)).toEqual([
      'submission_started',
      'submission_succeeded',
    ]);
  });
  it('rechazo genérico y diagnóstico defectuoso no bloquean', async () => {
    const register = createRegister(
      { complete: vi.fn().mockRejectedValue(new Error('internal')) },
      {
        record: () => {
          throw new Error('sink');
        },
      },
    );
    expect(await register(valid, new AbortController().signal)).toEqual({ kind: 'unavailable' });
  });
  it('cancelación previa no simula', async () => {
    const controller = new AbortController();
    controller.abort();
    const complete = vi.fn();
    expect(
      await createRegister({ complete }, { record: vi.fn() })(valid, controller.signal),
    ).toEqual({ kind: 'cancelled' });
    expect(complete).not.toHaveBeenCalled();
  });
  it.each([true, false])('cancelación durante final %j impide éxito', async (reject) => {
    const simulation = registrationSimulationStub();
    const controller = new AbortController();
    const pending = createRegister(simulation, { record: vi.fn() })(valid, controller.signal);
    controller.abort();
    if (reject) simulation.reject(new Error('aborted'));
    else simulation.resolve();
    expect(await pending).toEqual({ kind: 'cancelled' });
  });
});

it('002/diagnóstico errores del sink quedan contados sin datos', async () => {
  const register = createRegister(
    { complete: async () => {} },
    {
      record: () => {
        throw new Error('sink');
      },
    },
  );
  expect(await register(valid, new AbortController().signal)).toEqual({ kind: 'success' });
  expect(register.diagnosticFailureCount()).toBe(2);
});
