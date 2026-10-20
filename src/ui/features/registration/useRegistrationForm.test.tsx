import { act, renderHook } from '@testing-library/react';
import { createRegistrationStub, REGISTRATION_VALUES } from '@/test/registrationStub';
import { useRegistrationForm } from './useRegistrationForm';

it('REG-US1 fallo inesperado del adaptador recupera estado, conserva valores y no ejecuta éxito', async () => {
  const stub = createRegistrationStub();
  stub.register.mockRejectedValueOnce(new Error('private'));
  const completed = vi.fn();
  const { result } = renderHook(() => useRegistrationForm(stub.register, completed));
  act(() => {
    for (const field of Object.keys(REGISTRATION_VALUES) as (keyof typeof REGISTRATION_VALUES)[])
      result.current.change(field, REGISTRATION_VALUES[field]);
  });
  await act(async () => {
    result.current.submit();
    result.current.change('fullName', 'forbidden-during-send');
  });
  expect(result.current.state.status).toBe('failed');
  expect(result.current.state.values.fullName).toBe(REGISTRATION_VALUES.fullName);
  expect(completed).not.toHaveBeenCalled();
  await act(async () => result.current.submit());
  expect(completed).toHaveBeenCalledOnce();
});
it('REG-US1 rechazo tardío al abandonar no actualiza ni navega', async () => {
  const stub = createRegistrationStub();
  let reject: (reason: Error) => void = () => {};
  stub.register.mockImplementation(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  const completed = vi.fn();
  const { result, unmount } = renderHook(() => useRegistrationForm(stub.register, completed));
  act(() => {
    for (const field of Object.keys(REGISTRATION_VALUES) as (keyof typeof REGISTRATION_VALUES)[])
      result.current.change(field, REGISTRATION_VALUES[field]);
  });
  act(() => result.current.submit());
  unmount();
  await act(async () => reject(new Error('private')));
  expect(completed).not.toHaveBeenCalled();
});
