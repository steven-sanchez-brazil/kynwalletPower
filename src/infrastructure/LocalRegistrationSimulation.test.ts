import { LocalRegistrationSimulation } from './LocalRegistrationSimulation';
describe('002/FR-010/017 · simulación', () => {
  afterEach(() => vi.useRealTimers());
  it('espera 300ms y limpia listener', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    const finished = vi.fn();
    const promise = new LocalRegistrationSimulation().complete(controller.signal).then(finished);
    await vi.advanceTimersByTimeAsync(299);
    expect(finished).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(remove).toHaveBeenCalled();
  });
  it.each([true, false])('cancela antes/durante %j', async (early) => {
    vi.useFakeTimers();
    const controller = new AbortController();
    if (early) controller.abort();
    const result = new LocalRegistrationSimulation().complete(controller.signal);
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    if (!early) controller.abort();
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});
