import { act, renderHook } from '@testing-library/react';
import { createRegistrationStub, REGISTRATION_VALUES } from '@/test/registrationStub';
import { useRegistrationForm } from './useRegistrationForm';
import { registrationReducer, initialRegistrationState } from './registrationReducer';

it('REG-US1/US2 reducer: inicio, blur, cambio, envío y recuperación', () => {
  const start = initialRegistrationState();
  expect(start.values.acceptedTerms).toBe(false);
  const changed = registrationReducer(start, { type: 'change', field: 'fullName', value: 'Diego' });
  expect(changed.values.fullName).toBe('Diego');
  const touched = registrationReducer(changed, { type: 'blur', field: 'email' });
  expect(touched.touched.email).toBe(true);
  const sent = registrationReducer(touched, { type: 'submit' });
  expect(sent.submitted).toBe(true);
  const busy = registrationReducer(sent, { type: 'pending' });
  expect(busy.status).toBe('submitting');
  expect(registrationReducer(busy, { type: 'failed' }).status).toBe('failed');
  expect(registrationReducer(busy, { type: 'reset' })).toEqual(start);
});
it('REG-US1-3 hook impide duplicados y descarta respuesta tras desmontaje', async () => {
  const stub = createRegistrationStub();
  let release: (value: { kind: 'created' }) => void = () => {};
  stub.register.mockImplementation(
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  );
  const completed = vi.fn();
  const { result, unmount } = renderHook(() => useRegistrationForm(stub.register, completed));
  act(() => {
    for (const field of Object.keys(REGISTRATION_VALUES) as (keyof typeof REGISTRATION_VALUES)[])
      result.current.change(field, REGISTRATION_VALUES[field]);
  });
  act(() => {
    result.current.submit();
    result.current.submit();
  });
  expect(stub.register).toHaveBeenCalledOnce();
  unmount();
  await act(async () => release({ kind: 'created' }));
  expect(completed).not.toHaveBeenCalled();
});
