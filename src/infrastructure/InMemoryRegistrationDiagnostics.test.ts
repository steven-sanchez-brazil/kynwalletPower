import { InMemoryRegistrationDiagnostics } from './InMemoryRegistrationDiagnostics';
describe('002/diagnóstico acotado', () => {
  it('cuenta y guarda solo metadatos permitidos', () => {
    const diagnostics = new InMemoryRegistrationDiagnostics();
    diagnostics.record({ code: 'submission_started' });
    diagnostics.record({ code: 'submission_started', durationMs: 12 });
    expect(diagnostics.snapshot).toEqual({
      counters: { submission_started: 2 },
      lastEvent: { code: 'submission_started', durationMs: 12 },
    });
  });
});

it('002/diagnóstico rechaza códigos/duración y descarta propiedades ajenas', () => {
  const diagnostics = new InMemoryRegistrationDiagnostics();
  expect(diagnostics.snapshot).toEqual({ counters: {}, lastEvent: undefined });
  expect(() => diagnostics.record({ code: 'bad' as never })).toThrow('Invalid diagnostic code');
  for (const durationMs of [-1, NaN, Infinity])
    expect(() => diagnostics.record({ code: 'submission_failed', durationMs })).toThrow(
      'Invalid duration',
    );
  const event = { code: 'submission_failed' as const, password: 'abcdefgh', durationMs: 0 };
  diagnostics.record(event);
  expect(diagnostics.snapshot.lastEvent).toEqual({ code: 'submission_failed', durationMs: 0 });
  const snapshot = diagnostics.snapshot;
  snapshot.counters.submission_failed = 99;
  expect(diagnostics.snapshot.counters.submission_failed).toBe(1);
});
