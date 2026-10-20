import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';
import { controlledPromise } from '@/test/registrationStub';
import type { RegistrationResult, Register } from '@/application/register';
import { fillRegistration } from '@/test/registrationForm';

describe('002/US1 · contrato UI', () => {
  it('AC-101 formulario obligatorio oculto y términos desmarcados', () => {
    render(<RegistrationForm register={vi.fn()} onSuccess={vi.fn()} />);
    for (const label of [
      'Nombre completo',
      'Correo electrónico',
      'Contraseña',
      'Confirmar contraseña',
    ])
      expect(screen.getByLabelText(label)).toBeRequired();
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  it('AC-102 doble envío bloqueado y único éxito', async () => {
    const user = userEvent.setup();
    const result = controlledPromise<RegistrationResult>();
    const register = vi.fn<Register>(() => result.promise);
    const success = vi.fn();
    render(<RegistrationForm register={register} onSuccess={success} />);
    await fillRegistration(user);
    const form = screen
      .getByRole('button', { name: 'Crear cuenta' })
      .closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(register).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
    expect(screen.getByLabelText('Nombre completo')).toBeDisabled();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await act(async () => result.resolve({ kind: 'success' }));
    expect(success).toHaveBeenCalledTimes(1);
  });
  it('Enter envía y desmontar cancela e ignora resultado tardío', async () => {
    const user = userEvent.setup();
    const result = controlledPromise<RegistrationResult>();
    const register = vi.fn<Register>(() => result.promise);
    const success = vi.fn();
    const view = render(<RegistrationForm register={register} onSuccess={success} />);
    await fillRegistration(user);
    await user.click(screen.getByLabelText('Confirmar contraseña'));
    await user.keyboard('{Enter}');
    expect(register).toHaveBeenCalledTimes(1);
    const signal = register.mock.calls[0]?.[1] as AbortSignal;
    view.unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => result.resolve({ kind: 'success' }));
    expect(success).not.toHaveBeenCalled();
  });
});

it('002/contrato resultado invalid y cancelled permiten corregir y reintentar', async () => {
  const user = userEvent.setup();
  const register = vi
    .fn<Register>()
    .mockResolvedValueOnce({ kind: 'invalid', errors: { email: 'EMAIL_INVALID' } })
    .mockResolvedValueOnce({ kind: 'cancelled' })
    .mockResolvedValueOnce({ kind: 'success' });
  const success = vi.fn();
  render(<RegistrationForm register={register} onSuccess={success} />);
  await fillRegistration(user);
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(screen.getByText('Ingresa un correo electrónico válido')).toBeVisible();
  await user.type(screen.getByLabelText('Correo electrónico'), 'x');
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(success).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(success).toHaveBeenCalledOnce();
});

it('002/EC-007 ignora cambios sintéticos durante envío y rechazo tras desmontar', async () => {
  const user = userEvent.setup();
  const pending = controlledPromise<RegistrationResult>();
  const register = vi.fn<Register>(() => pending.promise);
  const success = vi.fn();
  const view = render(<RegistrationForm register={register} onSuccess={success} />);
  await fillRegistration(user);
  fireEvent.submit(
    screen.getByRole('button', { name: 'Crear cuenta' }).closest('form') as HTMLFormElement,
  );
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Changed' } });
  expect(screen.getByLabelText('Nombre completo')).toHaveValue('Persona');
  view.unmount();
  await act(async () => pending.reject(new Error('cancelled')));
  expect(success).not.toHaveBeenCalled();
});
