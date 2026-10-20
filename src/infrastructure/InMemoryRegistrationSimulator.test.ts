import { InMemoryRegistrationSimulator } from './InMemoryRegistrationSimulator';

describe('InMemoryRegistrationSimulator contract', () => {
  it('SC-002: devuelve success tras la demora configurada y no recibe datos', async () => {
    vi.useFakeTimers();
    const simulator = new InMemoryRegistrationSimulator({ delayMs: 100, result: 'success' });
    const pending = simulator.simulate();
    let settled = false;
    void pending.then(() => {
      settled = true;
    });
    await vi.advanceTimersByTimeAsync(99);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toBe('success');
    vi.useRealTimers();
  });

  it('FR-021: permite simular unavailable', async () => {
    const simulator = new InMemoryRegistrationSimulator({ delayMs: 0, result: 'unavailable' });
    await expect(simulator.simulate()).resolves.toBe('unavailable');
  });
});
