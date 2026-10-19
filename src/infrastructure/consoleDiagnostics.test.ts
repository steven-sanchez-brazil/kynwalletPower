import { consoleDiagnostics } from './consoleDiagnostics';

describe('consoleDiagnostics (Constitución 8.7)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('REG FR-013: emite un único evento estructurado con solo el código', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleDiagnostics({ code: 'register-account-failed' });
    expect(error).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledWith({ code: 'register-account-failed' });
  });
});
