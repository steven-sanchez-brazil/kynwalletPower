import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RegisterAccount } from '@/application/registerAccount';
import { RegistrationForm } from './RegistrationForm';

function setup(result: { kind: 'success' | 'error' } = { kind: 'success' }) {
  const user = userEvent.setup();
  const registerAccount: RegisterAccount = vi.fn().mockResolvedValue(result);
  const onSuccess = vi.fn();
  render(<RegistrationForm registerAccount={registerAccount} onSuccess={onSuccess} />);
  return { user, registerAccount, onSuccess };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Nombre completo' }), 'Ana Pérez');
  await user.type(screen.getByRole('textbox', { name: 'Correo electrónico' }), 'ana@example.com');
  await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'clave1234');
  await user.type(screen.getByLabelText('Confirmar contraseña'), 'clave1234');
  await user.click(screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ }));
}

describe('Registro · formulario', () => {
  it('US1-1: datos válidos simulan y comunican éxito una sola vez', async () => {
    const { user, registerAccount, onSuccess } = setup();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(registerAccount).toHaveBeenCalledOnce();
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('US2-1: vacío muestra cinco errores, enfoca el nombre y no simula', async () => {
    const { user, registerAccount } = setup();
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('textbox', { name: 'Correo electrónico' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText('Contraseña', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ }),
    ).toHaveAttribute('aria-invalid', 'true');
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it('US2-5: confirmación diferente se indica junto al campo', async () => {
    const { user, registerAccount } = setup();
    await fillValid(user);
    await user.clear(screen.getByLabelText('Confirmar contraseña'));
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'otraClave1');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('Las contraseñas no coinciden')).toBeVisible();
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it('US2-7: fallo de simulación informa un error genérico y permite reintentar', async () => {
    const { user, registerAccount, onSuccess } = setup({ kind: 'error' });
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos completar el registro de demostración. Intenta nuevamente.',
    );
    expect(screen.getByLabelText('Contraseña', { exact: true })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Ana Pérez');
    expect(onSuccess).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'clave1234');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'clave1234');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(registerAccount).toHaveBeenCalledTimes(2);
  });

  it('US1-3: Enter envía y los intentos simultáneos invocan una sola simulación', async () => {
    const user = userEvent.setup();
    let finish: ((result: { kind: 'success' }) => void) | undefined;
    const registerAccount: RegisterAccount = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const onSuccess = vi.fn();
    render(<RegistrationForm registerAccount={registerAccount} onSuccess={onSuccess} />);
    await fillValid(user);
    await user.click(screen.getByRole('textbox', { name: 'Nombre completo' }));
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
    const form = screen.getByRole('button', { name: 'Creando cuenta…' }).closest('form');
    if (!form) throw new Error('Falta el formulario de registro');
    fireEvent.submit(form);
    expect(registerAccount).toHaveBeenCalledOnce();
    finish?.({ kind: 'success' });
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it('US2-6: valida al salir del campo y quita el error al corregir sin borrar otros datos', async () => {
    const { user, registerAccount } = setup();
    const name = screen.getByRole('textbox', { name: 'Nombre completo' });
    const email = screen.getByRole('textbox', { name: 'Correo electrónico' });
    await user.click(name);
    await user.tab();
    expect(name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    await user.type(name, 'Ana Pérez');
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
    await user.type(email, 'usuario@');
    await user.tab();
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    expect(name).toHaveValue('Ana Pérez');
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it('US3-1: las contraseñas se muestran por separado', async () => {
    const { user } = setup();
    const toggles = screen.getAllByRole('button', { name: 'Mostrar contraseña' });
    expect(toggles).toHaveLength(2);
    const firstToggle = toggles.at(0);
    if (!firstToggle) throw new Error('Falta el primer control de contraseña');
    await user.click(firstToggle);
    expect(screen.getByLabelText('Contraseña', { exact: true })).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('type', 'password');
  });

  it('US3-2: consultar términos no marca la casilla ni borra campos', async () => {
    const { user } = setup();
    await user.type(screen.getByRole('textbox', { name: 'Nombre completo' }), 'Ana Pérez');
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'clave1234');
    const termsButton = screen.getByRole('button', { name: 'términos y condiciones' });
    await user.click(termsButton);
    const dialog = screen.getByRole('dialog', { name: /Términos y condiciones/ });
    expect(within(dialog).getAllByText(/Kydryl Wallet S.A./).length).toBeGreaterThan(0);
    await user.click(within(dialog).getByRole('button', { name: 'Cerrar' }));
    expect(
      screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ }),
    ).not.toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Ana Pérez');
    expect(screen.getByLabelText('Contraseña', { exact: true })).toHaveValue('clave1234');
    expect(termsButton).toHaveFocus();
  });

  it('US5-1: Google y Apple muestran Próximamente sin simular', async () => {
    const { user, registerAccount } = setup();
    await user.type(screen.getByRole('textbox', { name: 'Nombre completo' }), 'Ana Pérez');
    await user.click(screen.getByRole('button', { name: 'Google' }));
    expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
    await user.click(screen.getByRole('button', { name: 'Apple' }));
    expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Ana Pérez');
    expect(registerAccount).not.toHaveBeenCalled();
  });
});
