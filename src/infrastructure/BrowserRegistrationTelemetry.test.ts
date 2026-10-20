import {
  BrowserRegistrationTelemetry,
  REGISTRATION_TELEMETRY_EVENT,
} from './BrowserRegistrationTelemetry';

describe('BrowserRegistrationTelemetry (Constitution 8.7)', () => {
  it('SC-008: emite solo eventos categóricos sin PII', () => {
    const received: unknown[] = [];
    window.addEventListener(
      REGISTRATION_TELEMETRY_EVENT,
      ((event: CustomEvent) => {
        received.push(event.detail);
      }) as EventListener,
      { once: true },
    );
    new BrowserRegistrationTelemetry().record({ type: 'attempt_started' });
    expect(received).toEqual([{ type: 'attempt_started' }]);
    expect(JSON.stringify(received)).not.toMatch(/password|email|Diego/i);
  });

  it('Constitution 8.7: emite resultado y duración agregada', () => {
    const listener = vi.fn();
    window.addEventListener(REGISTRATION_TELEMETRY_EVENT, listener, { once: true });
    new BrowserRegistrationTelemetry().record({
      type: 'attempt_finished',
      result: 'unavailable',
      durationBucket: 'under_2s',
    });
    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({
      type: 'attempt_finished',
      result: 'unavailable',
      durationBucket: 'under_2s',
    });
  });
});
