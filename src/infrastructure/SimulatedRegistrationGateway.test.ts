import { SimulatedRegistrationGateway } from './SimulatedRegistrationGateway';

describe('Registro FR-019 adaptador sin datos', () => {
  afterEach(() => vi.useRealTimers());
  it('espera 1000 ms sin realizar red o almacenamiento', async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    const done = vi.fn();
    const result = new SimulatedRegistrationGateway().submit().then(done);
    await vi.advanceTimersByTimeAsync(999);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await result;
    expect(done).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
  it('permite demora controlada para pruebas', async () => {
    vi.useFakeTimers();
    const result = new SimulatedRegistrationGateway(5).submit();
    await vi.advanceTimersByTimeAsync(5);
    await expect(result).resolves.toBeUndefined();
  });
});
