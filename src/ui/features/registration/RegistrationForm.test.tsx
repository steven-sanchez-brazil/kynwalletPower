import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { NEW_REGISTRATION } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { renderWithRouter } from '@/test/renderWithRouter';
import { RegistrationForm } from './RegistrationForm';

function setup(stub = createRegisterStub(), onRegistered = vi.fn()) {
  const user = userEvent.setup();
  const view = renderWithRouter(
    <RegistrationForm registerAccount={stub.registerAccount} onRegistered={onRegistered} />,
    { route: '/registro' },
  );
  const name = screen.getByLabelText('Nombre completo');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText('Contraseña');
  const confirm = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  const fillValid = async () => {
    await user.type(name, NEW_REGISTRATION.displayName);
    await user.type(email, NEW_REGISTRATION.email);
    await user.type(password, NEW_REGISTRATION.password);
    await user.type(confirm, NEW_REGISTRATION.confirmPassword);
    await user.click(terms);
  };
  return {
    user,
    stub,
    onRegistered,
    view,
    name,
    email,
    password,
    confirm,
    terms,
    submit,
    fillValid,
  };
}

describe('RegistrationForm · US1 Crear una cuenta de demostración', () => {
  it('REG FR-001: muestra el título, el subtítulo, los cinco controles y el botón', () => {
    const { name, email, password, confirm, terms } = setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(name).toHaveAttribute('placeholder', 'Ej: Diego Martínez');
    expect(email).toHaveAttribute('placeholder', 'tucorreo@ejemplo.com');
    expect(email).toHaveAttribute('type', 'email');
    expect(password).toHaveAttribute('type', 'password');
    expect(confirm).toHaveAttribute('type', 'password');
    expect(terms).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  it('REG FR-012: los dos botones de visibilidad tienen nombres distintos', async () => {
    const { user, password, confirm } = setup();
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirm).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }));
    expect(confirm).toHaveAttribute('type', 'text');
  });

  it('REG US1-1: un envío válido llama una sola vez al caso de uso con los cinco valores', async () => {
    const { stub, fillValid, submit } = setup();
    await fillValid();
    await submit();
    expect(stub.registerAccount).toHaveBeenCalledOnce();
    expect(stub.registerAccount).toHaveBeenCalledWith(NEW_REGISTRATION);
  });

  it('REG US1-1: al tener éxito avisa con onRegistered una sola vez', async () => {
    const { onRegistered, fillValid, submit } = setup();
    await fillValid();
    await submit();
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('REG US1-5: durante el envío el botón está ocupado y un segundo envío no se procesa', async () => {
    const stub = createRegisterStub();
    stub.defer();
    const { user, onRegistered, fillValid, submit } = setup(stub);
    await fillValid();
    await submit();
    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    await user.keyboard('{Enter}');
    expect(stub.registerAccount).toHaveBeenCalledOnce();
    expect(onRegistered).not.toHaveBeenCalled();
    await act(async () => stub.release());
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('REG FR-013: no escribe en el almacenamiento del navegador ni cambia la URL', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const href = window.location.href;
    const { fillValid, submit } = setup();
    await fillValid();
    await submit();
    expect(setItem).not.toHaveBeenCalled();
    expect(window.location.href).toBe(href);
    setItem.mockRestore();
  });

  it('REG FR-012: no tiene violaciones de accesibilidad', async () => {
    const { view } = setup();
    await expectNoA11yViolations(view.container);
  });
});

describe('RegistrationForm · US2 Corregir datos y evitar duplicados', () => {
  it('REG US2-1 / FR-006: el envío vacío muestra un error por campo, enfoca el primero y no registra', async () => {
    const { stub, name, email, password, confirm, terms, submit } = setup();
    await submit();
    expect(name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    expect(email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
    expect(password).toHaveAccessibleDescription('Ingresa tu contraseña');
    expect(confirm).toHaveAccessibleDescription('Confirma tu contraseña');
    expect(terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
    expect(stub.registerAccount).not.toHaveBeenCalled();
  });

  it('REG US2-2 / FR-003: un correo inválido muestra su error al salir del campo', async () => {
    const { user, email } = setup();
    await user.type(email, 'usuario@');
    await user.tab();
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
  });

  it('REG FR-003: el texto pegado se valida igual que el escrito', async () => {
    const { user, email } = setup();
    await user.click(email);
    await user.paste('usuario.com');
    await user.tab();
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
  });

  it('REG US2-2 / FR-004: una contraseña de menos de 8 caracteres muestra su error', async () => {
    const { user, password } = setup();
    await user.type(password, '1234567');
    await user.tab();
    expect(password).toHaveAccessibleDescription('La contraseña debe tener al menos 8 caracteres');
  });

  it('REG FR-002: un nombre de más de 80 caracteres muestra su error', async () => {
    const { user, name } = setup();
    await user.click(name);
    await user.paste('a'.repeat(81));
    await user.tab();
    expect(name).toHaveAccessibleDescription('El nombre no puede superar 80 caracteres');
  });

  it('REG US2-3 / FR-005: una confirmación distinta bloquea el envío y enfoca la confirmación', async () => {
    const { user, stub, name, email, password, confirm, terms, submit } = setup();
    await user.type(name, NEW_REGISTRATION.displayName);
    await user.type(email, NEW_REGISTRATION.email);
    await user.type(password, NEW_REGISTRATION.password);
    await user.type(confirm, 'otra-clave-99');
    await user.click(terms);
    await submit();
    expect(confirm).toHaveAccessibleDescription('Las contraseñas no coinciden');
    expect(confirm).toHaveFocus();
    expect(stub.registerAccount).not.toHaveBeenCalled();
  });

  it('REG US2-4 / FR-005: sin aceptar los términos bloquea el envío y enfoca la casilla', async () => {
    const { user, stub, name, email, password, confirm, terms, submit } = setup();
    await user.type(name, NEW_REGISTRATION.displayName);
    await user.type(email, NEW_REGISTRATION.email);
    await user.type(password, NEW_REGISTRATION.password);
    await user.type(confirm, NEW_REGISTRATION.confirmPassword);
    await submit();
    expect(terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(terms).toHaveFocus();
    expect(stub.registerAccount).not.toHaveBeenCalled();
  });

  it('REG US2-6: corregir un campo retira solo su error y conserva los demás', async () => {
    const { user, name, email, submit } = setup();
    await submit();
    await user.type(name, 'Diego');
    expect(name).not.toHaveAttribute('aria-invalid');
    expect(name).toHaveValue('Diego');
    expect(email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
  });

  it('REG US2-5 / FR-007: un correo duplicado se indica junto al campo, enfoca el correo y conserva los datos', async () => {
    const stub = createRegisterStub({ kind: 'duplicate-email' });
    const { onRegistered, name, email, fillValid, submit } = setup(stub);
    await fillValid();
    await submit();
    await vi.waitFor(() =>
      expect(email).toHaveAccessibleDescription('Este correo ya está registrado'),
    );
    expect(email).toHaveFocus();
    expect(name).toHaveValue(NEW_REGISTRATION.displayName);
    expect(stub.registerAccount).toHaveBeenCalledOnce();
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('REG FR-014: servicio no disponible → alerta genérica, sin éxito', async () => {
    const stub = createRegisterStub({ kind: 'unavailable' });
    const { onRegistered, fillValid, submit } = setup(stub);
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Servicio de registro no disponible. Intenta más tarde.',
    );
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('REG FR-014: fallo inesperado → alerta genérica sin detalles y los datos se conservan', async () => {
    const stub = createRegisterStub({ kind: 'failure' });
    const { onRegistered, name, fillValid, submit } = setup(stub);
    await fillValid();
    await submit();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No pudimos crear tu cuenta. Inténtalo de nuevo.');
    expect(alert).not.toHaveTextContent(NEW_REGISTRATION.password);
    expect(name).toHaveValue(NEW_REGISTRATION.displayName);
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('REG FR-012: con errores visibles no tiene violaciones de accesibilidad', async () => {
    const { view, submit } = setup();
    await submit();
    await expectNoA11yViolations(view.container);
  });
});

describe('RegistrationForm · US3 Navegar y conocer las opciones disponibles', () => {
  it.each(['Google', 'Apple'])(
    'REG US3-2 / FR-010: "%s" anuncia "Próximamente", conserva los datos y no registra',
    async (provider) => {
      const { user, stub, name, email, onRegistered } = setup();
      await user.type(name, NEW_REGISTRATION.displayName);
      await user.type(email, NEW_REGISTRATION.email);
      await user.click(screen.getByRole('button', { name: provider }));
      expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
      expect(name).toHaveValue(NEW_REGISTRATION.displayName);
      expect(email).toHaveValue(NEW_REGISTRATION.email);
      expect(stub.registerAccount).not.toHaveBeenCalled();
      expect(onRegistered).not.toHaveBeenCalled();
    },
  );

  it('REG US3-1 / FR-010: ofrece el enlace "Inicia sesión" hacia /login', () => {
    setup();
    expect(screen.getByText(/¿Ya tienes cuenta\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('REG US3-2: el divisor "o regístrate con" precede a los botones sociales', () => {
    setup();
    expect(screen.getByText('o regístrate con')).toBeInTheDocument();
  });

  it('REG US3-4 / FR-012: el orden de tabulación sigue el orden visual', async () => {
    const { user } = setup();
    const expected = [
      screen.getByLabelText('Nombre completo'),
      screen.getByLabelText('Correo electrónico'),
      screen.getByLabelText('Contraseña'),
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      screen.getByLabelText('Confirmar contraseña'),
      screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }),
      screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
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

  it('REG FR-012: el aviso "Próximamente" desaparece al enviar el formulario', async () => {
    const { user, submit } = setup();
    await user.click(screen.getByRole('button', { name: 'Google' }));
    await submit();
    expect(screen.queryByText('Próximamente')).not.toBeInTheDocument();
  });
});
