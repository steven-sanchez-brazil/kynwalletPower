import { createDemoDiagnostics } from './demoDiagnostics';
it('REG-US1 diagnóstico estructurado sin payload, contador y fallo seguro', () => {
  const write = vi.fn();
  const sink = createDemoDiagnostics(write);
  sink({ name: 'registration.completed', outcome: 'created', durationMs: 12 });
  sink({ name: 'registration.failed', outcome: 'unavailable', durationMs: 3 });
  expect(write).toHaveBeenLastCalledWith({
    name: 'registration.failed',
    outcome: 'unavailable',
    durationMs: 3,
    count: 2,
  });
  const fallback = vi.fn();
  const failed = createDemoDiagnostics(() => {
    throw new Error('private');
  }, fallback);
  expect(() =>
    failed({ name: 'registration.failed', outcome: 'unavailable', durationMs: 1 }),
  ).not.toThrow();
  expect(fallback).toHaveBeenCalledWith({
    name: 'registration.failed',
    outcome: 'diagnostic-unavailable',
    durationMs: 0,
    count: 1,
  });
});

it('REG-US1 diagnóstico predeterminado registra solo categorías y aviso seguro si falla sink', () => {
  const info = vi.spyOn(console, 'info').mockImplementation(() => {});
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const event = {
    name: 'registration.completed' as const,
    outcome: 'created' as const,
    durationMs: 7,
  };
  createDemoDiagnostics()(event);
  expect(info).toHaveBeenCalledWith({ ...event, count: 1 });
  createDemoDiagnostics(() => {
    throw new Error('private');
  })(event);
  expect(warn).toHaveBeenCalledWith({
    name: 'registration.failed',
    outcome: 'diagnostic-unavailable',
    durationMs: 0,
    count: 1,
  });
  info.mockRestore();
  warn.mockRestore();
});
