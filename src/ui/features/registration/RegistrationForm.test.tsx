import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';
import { createRegisterUserStub } from '@/test/registrationStubs';
import { RegistrationForm } from './RegistrationForm';

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), VALID_REGISTRATION.fullName);
  await user.type(screen.getByLabelText('Correo electrónico'), VALID_REGISTRATION.email);
  await user.type(screen.getByLabelText(/^Contraseña$/), VALID_REGISTRATION.password);
  await user.type(
    screen.getByLabelText('Confirmar contraseña'),
    VALID_REGISTRATION.passwordConfirmation,
  );
  await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
}

function setup(result: 'success' | 'unavailable' = 'success') {
  const stub = createRegisterUserStub({ kind: result });
  const onSuccess = vi.fn();
  const onNavigateLogin = vi.fn();
  const user = userEvent.setup();
  render(
    <RegistrationForm
      registerUser={stub.registerUser}
      onSuccess={onSuccess}
      onNavigateLogin={onNavigateLogin}
    />,
  );
  return { user, stub, onSuccess, onNavigateLogin };
}

describe('RegistrationForm', () => {
  it('US1-1/US1-2: envía una vez, comunica actividad y notifica éxito', async () => {
    const { user, stub, onSuccess } = setup();
    stub.defer();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    expect(stub.registerUser).toHaveBeenCalledOnce();
    await act(async () => stub.release());
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('US1-4: anuncia error inesperado y permite reintentar', async () => {
    const { user } = setup('unavailable');
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos crear tu cuenta. Intenta más tarde.',
    );
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
  });

  it('US2-1/US2-6: vacío muestra cinco errores y enfoca nombre', async () => {
    const { user, stub } = setup();
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
    expect(screen.getByText('Ingresa tu nombre completo')).toBeVisible();
    expect(screen.getByText('Ingresa tu correo electrónico')).toBeVisible();
    expect(screen.getByText('Ingresa tu contraseña')).toBeVisible();
    expect(screen.getByText('Confirma tu contraseña')).toBeVisible();
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeVisible();
    expect(stub.registerUser).not.toHaveBeenCalled();
  });

  it('US2-5: valida al salir y elimina únicamente el error corregido', async () => {
    const { user } = setup();
    const name = screen.getByLabelText('Nombre completo');
    await user.click(name);
    await user.tab();
    expect(name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    await user.type(name, ' Ana María ');
    expect(name).not.toHaveAttribute('aria-invalid');
  });

  it('US3-3/US3-4: valida coincidencia y toggles independientes', async () => {
    const { user } = setup();
    const password = screen.getByLabelText(/^Contraseña$/);
    const confirmation = screen.getByLabelText('Confirmar contraseña');
    await user.type(password, 'clave con espacios');
    await user.type(confirmation, 'otra clave');
    await user.tab();
    expect(confirmation).toHaveAccessibleDescription('Las contraseñas no coinciden');
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmation).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }));
    expect(confirmation).toHaveAttribute('type', 'text');
  });

  it('US4-1/US4-3: enfoca términos y su acción conserva los datos', async () => {
    const { user, stub } = setup();
    await user.type(screen.getByLabelText('Nombre completo'), VALID_REGISTRATION.fullName);
    await user.type(screen.getByLabelText('Correo electrónico'), VALID_REGISTRATION.email);
    await user.type(screen.getByLabelText(/^Contraseña$/), VALID_REGISTRATION.password);
    await user.type(screen.getByLabelText('Confirmar contraseña'), VALID_REGISTRATION.password);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('checkbox')).toHaveFocus();
    expect(stub.registerUser).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      'Función no disponible en esta demostración',
    );
    expect(screen.getByLabelText('Nombre completo')).toHaveValue(VALID_REGISTRATION.fullName);
  });

  it.each(['Google', 'Apple'])('US5: %s anuncia Próximamente sin enviar', async (provider) => {
    const { user, stub } = setup();
    await user.type(screen.getByLabelText('Nombre completo'), 'Valor parcial');
    await user.click(screen.getByRole('button', { name: provider }));
    expect(screen.getByRole('status')).toHaveTextContent(/^Próximamente$/);
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Valor parcial');
    expect(stub.registerUser).not.toHaveBeenCalled();
  });

  it('US6: el enlace de login navega y es operable', async () => {
    const { user, onNavigateLogin } = setup();
    const link = screen.getByRole('link', { name: 'Inicia sesión' });
    expect(link).toHaveAttribute('href', '/login');
    await user.click(link);
    expect(onNavigateLogin).toHaveBeenCalledOnce();
  });

  it('US7: no tiene violaciones axe en estado inicial y de error', async () => {
    const { user } = setup();
    await expectNoA11yViolations(document.body);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(document.body);
  });

  it('US7-3: mantiene el orden completo de teclado', async () => {
    const { user } = setup();
    const expected = [
      screen.getByLabelText('Nombre completo'),
      screen.getByLabelText('Correo electrónico'),
      screen.getByLabelText(/^Contraseña$/),
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      screen.getByLabelText('Confirmar contraseña'),
      screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }),
      screen.getByRole('checkbox'),
      screen.getByRole('button', { name: 'términos y condiciones' }),
      screen.getByRole('button', { name: 'Crear cuenta' }),
      screen.getByRole('button', { name: 'Google' }),
      screen.getByRole('button', { name: 'Apple' }),
      screen.getByRole('link', { name: 'Inicia sesión' }),
    ];
    for (const element of expected) {
      await user.tab();
      expect(element).toHaveFocus();
    }
  });

  it('SC-008: no escribe datos del formulario en storage, URL, consola o telemetría', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent');
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const { user } = setup('unavailable');
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findByRole('alert');
    const serialized = [
      window.location.href,
      ...setItem.mock.calls.flat(),
      ...dispatchEvent.mock.calls.flat().map(String),
      ...consoleSpies.flatMap((spy) => spy.mock.calls.flat().map(String)),
    ].join('\n');
    expect(serialized).not.toContain(VALID_REGISTRATION.password);
    expect(serialized).not.toContain(VALID_REGISTRATION.email);
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
    dispatchEvent.mockRestore();
    consoleSpies.forEach((spy) => spy.mockRestore());
  });
});
