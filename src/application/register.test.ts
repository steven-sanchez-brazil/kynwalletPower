import { createRegister } from './register';

const values = {
  fullName: 'Persona Demo',
  email: 'demo@example.test',
  password: 'sample-pass-01',
  confirmPassword: 'sample-pass-01',
  termsAccepted: true,
};

describe('Registro FR-003/012/018/019 caso de uso', () => {
  it('inválido no llega al puerto', async () => {
    const submit = vi.fn();
    const result = await createRegister({ submit })({ ...values, email: 'invalid' });
    expect(result.kind).toBe('invalid');
    expect(submit).not.toHaveBeenCalled();
  });
  it('válido envía exactamente cero argumentos y responde éxito', async () => {
    const submit = vi.fn().mockResolvedValue(undefined);
    expect(await createRegister({ submit })(values)).toEqual({ kind: 'success' });
    expect(submit.mock.calls).toEqual([[]]);
  });
  it('oculta excepciones y datos internos', async () => {
    const submit = vi.fn().mockRejectedValue(new Error('internal detail'));
    expect(await createRegister({ submit })(values)).toEqual({ kind: 'unavailable' });
  });
});
