import { REGISTRATION_VALUES } from '@/test/registrationStub';
import { FakeRegistrationGateway, registrationMode } from './FakeRegistrationGateway';

describe('REG-US1 API ficticia sin red', () => {
  afterEach(() => vi.useRealTimers());
  it('201 tras 500 ms sin red ni persistencia, repetible', async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    const gateway = new FakeRegistrationGateway();
    const request = { ...REGISTRATION_VALUES, acceptedTerms: true as const };
    const done = vi.fn();
    const pending = gateway.register(request).then(done);
    await vi.advanceTimersByTimeAsync(499);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(done).toHaveBeenCalledWith({ status: 201, body: { kind: 'created' } });
    const again = gateway.register(request);
    await vi.advanceTimersByTimeAsync(500);
    expect(await again).toEqual({ status: 201, body: { kind: 'created' } });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
    storage.mockRestore();
  });
  it('503 determinista, configuración pública validada', async () => {
    vi.useFakeTimers();
    const pending = new FakeRegistrationGateway('unavailable', 0).register({
      ...REGISTRATION_VALUES,
      acceptedTerms: true,
    });
    await vi.runAllTimersAsync();
    expect(await pending).toEqual({ status: 503, body: { kind: 'unavailable' } });
    expect(registrationMode(undefined)).toBe('success');
    expect(registrationMode('success')).toBe('success');
    expect(registrationMode('unavailable')).toBe('unavailable');
    expect(registrationMode('invalid')).toBe('unavailable');
  });
});
