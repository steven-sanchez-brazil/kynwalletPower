import { act, renderHook } from '@testing-library/react';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';
import { createRegisterUserStub } from '@/test/registrationStubs';
import { useRegistrationForm } from './useRegistrationForm';

describe('useRegistrationForm', () => {
  it('FR-016/SC-009: bloquea llamadas repetidas en el mismo procesamiento', async () => {
    const stub = createRegisterUserStub();
    stub.defer();
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRegistrationForm(stub.registerUser, onSuccess));

    for (const [field, value] of Object.entries(VALID_REGISTRATION)) {
      act(() => {
        if (field === 'acceptedTerms') result.current.setTerms(Boolean(value));
        else
          result.current.change(
            field as Exclude<keyof typeof VALID_REGISTRATION, 'acceptedTerms'>,
            String(value),
          );
      });
    }
    act(() => {
      result.current.submit();
      result.current.submit();
    });
    expect(stub.registerUser).toHaveBeenCalledOnce();
    await act(async () => stub.release());
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(result.current.state.values.password).toBe('');
  });

  it('FR-020: ignora un resultado tardío después de desmontarse', async () => {
    const stub = createRegisterUserStub();
    stub.defer();
    const onSuccess = vi.fn();
    const { result, unmount } = renderHook(() => useRegistrationForm(stub.registerUser, onSuccess));
    for (const [field, value] of Object.entries(VALID_REGISTRATION)) {
      act(() => {
        if (field === 'acceptedTerms') result.current.setTerms(Boolean(value));
        else
          result.current.change(
            field as Exclude<keyof typeof VALID_REGISTRATION, 'acceptedTerms'>,
            String(value),
          );
      });
    }
    act(() => result.current.submit());
    unmount();
    await act(async () => stub.release());
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
