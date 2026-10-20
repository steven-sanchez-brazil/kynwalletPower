import { validateRegistration } from './registration';
import { registrationValues as valid } from '@/test/registrationStub';

describe('002/FR-003/004 · identidad y límites', () => {
  it.each(['', '   '])('AC-206 nombre obligatorio %j', (fullName) => {
    expect(validateRegistration({ ...valid, fullName }).fullName).toBe('NAME_REQUIRED');
  });
  it.each(["O'Neil", 'José-Pérez', 'A', 'x'.repeat(100), '🦊'.repeat(100)])(
    'EC-002 acepta nombre %j',
    (fullName) => {
      expect(validateRegistration({ ...valid, fullName }).fullName).toBeUndefined();
    },
  );
  it('rechaza 101 caracteres', () => {
    expect(validateRegistration({ ...valid, fullName: 'x'.repeat(101) }).fullName).toBe(
      'NAME_TOO_LONG',
    );
  });
  it.each(['a@b.c', ' PERSONA@EXAMPLE.COM ', 'a@b.cd'])('EC-003 correo permitido %j', (email) => {
    expect(validateRegistration({ ...valid, email }).email).toBeUndefined();
  });
  it.each([
    '',
    'x@',
    'a@b..com',
    'a@.b.com',
    'a@b.c.',
    'a@@b.c',
    'a b@c.d',
    'x'.repeat(250) + '@b.cd',
  ])('EC-003 correo rechazado %j', (email) => {
    expect(validateRegistration({ ...valid, email }).email).toBeDefined();
  });
  it('acepta 254 y rechaza 255 caracteres de correo', () => {
    expect(
      validateRegistration({ ...valid, email: 'x'.repeat(249) + '@b.cd' }).email,
    ).toBeUndefined();
    expect(validateRegistration({ ...valid, email: 'x'.repeat(250) + '@b.cd' }).email).toBe(
      'EMAIL_INVALID',
    );
  });
  it('tipos mal formados se validan sin mutación ni excepción', () => {
    const input = { ...valid, fullName: null, email: 123 };
    expect(validateRegistration(input)).toMatchObject({
      fullName: 'NAME_REQUIRED',
      email: 'EMAIL_REQUIRED',
    });
    expect(input.fullName).toBeNull();
    expect(validateRegistration(null)).toHaveProperty('email');
  });
});
