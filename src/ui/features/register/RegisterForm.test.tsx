import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegisterStub } from '@/test/registerStub';
import { REGISTRATION_DATA } from '@/test/fixtures';
import { RegisterForm } from './RegisterForm';

function setup(stub = createRegisterStub()) {
  const user = userEvent.setup();
  const onRegistered = vi.fn();
  const onLogin = vi.fn();
  render(<RegisterForm register={stub.register} onRegistered={onRegistered} onLogin={onLogin} />);
  const name = screen.getByLabelText('Nombre completo');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText('Contraseña');
  const confirm = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ });
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  const fillValid = async () => {
    await user.type(name, REGISTRATION_DATA.name);
    await user.type(email, REGISTRATION_DATA.email);
    await user.type(password, REGISTRATION_DATA.password);
    await user.type(confirm, REGISTRATION_DATA.password);
    await user.click(terms);
  };
  return {
    user,
    stub,
    onRegistered,
    onLogin,
    name,
    email,
    password,
    confirm,
    terms,
    submit,
    fillValid,
  };
}

describe('RegisterForm · estructura (contracts/ui-register.md)', () => {
  it('FR-003/FR-008/UI-1: muestra encabezado, campos, casilla, botón, separador, accesos y pie', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Diego Martínez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tucorreo@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByText('o regístrate con')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'términos y condiciones' })).toBeInTheDocument();
  });

  it('UI-1: atributos autoComplete y tipos de los campos', () => {
    const { name, email, password, confirm } = setup();
    expect(name).toHaveAttribute('autocomplete', 'name');
    expect(email).toHaveAttribute('autocomplete', 'email');
    expect(email).toHaveAttribute('type', 'email');
    expect(password).toHaveAttribute('autocomplete', 'new-password');
    expect(password).toHaveAttribute('type', 'password');
    expect(confirm).toHaveAttribute('autocomplete', 'new-password');
    expect(confirm).toHaveAttribute('type', 'password');
  });

  it('UI-1: el orden de foco es nombre, correo, contraseña, confirmación y casilla', async () => {
    const { user, name, email, password, confirm, terms } = setup();
    const toggles = screen.getAllByRole('button', { name: 'Mostrar contraseña' });
    await user.click(name);
    const expected = [email, password, toggles[0], confirm, toggles[1], terms];
    for (const element of expected) {
      await user.tab();
      expect(element).toHaveFocus();
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'términos y condiciones' })).toHaveFocus();
  });
});

describe('RegisterForm · US1 Crear una cuenta con datos válidos', () => {
  it('US1-1: con datos válidos se llama a onRegistered con el nombre creado', async () => {
    const { fillValid, submit, onRegistered, stub } = setup();
    await fillValid();
    await submit();
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
    expect(onRegistered).toHaveBeenCalledWith('Diego Martínez');
    expect(stub.register).toHaveBeenCalledOnce();
  });

  it('US1-2: durante el envío el botón está ocupado y no admite reenvíos', async () => {
    const { user, stub, fillValid, submit, onRegistered } = setup();
    stub.defer();
    await fillValid();
    await submit();
    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    await user.keyboard('{Enter}');
    expect(stub.register).toHaveBeenCalledOnce();
    expect(onRegistered).not.toHaveBeenCalled();
    await act(async () => stub.release());
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('US1-3: el caso de uso recibe nombre, correo y contraseña sin la confirmación ni los términos', async () => {
    const { fillValid, submit, stub } = setup();
    await fillValid();
    await submit();
    expect(stub.register).toHaveBeenCalledWith({
      name: REGISTRATION_DATA.name,
      email: REGISTRATION_DATA.email,
      password: REGISTRATION_DATA.password,
    });
  });

  it('US1-4: Enter en el campo de confirmación envía el formulario', async () => {
    const { user, stub, name, email, password, confirm, terms, onRegistered } = setup();
    await user.type(name, REGISTRATION_DATA.name);
    await user.type(email, REGISTRATION_DATA.email);
    await user.type(password, REGISTRATION_DATA.password);
    await user.click(terms);
    await user.type(confirm, `${REGISTRATION_DATA.password}{Enter}`);
    expect(stub.register).toHaveBeenCalledOnce();
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('FR-010: con datos incompletos no se llama al caso de uso', async () => {
    const { submit, stub, onRegistered } = setup();
    await submit();
    expect(stub.register).not.toHaveBeenCalled();
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · US2 Validar los campos antes de registrar', () => {
  it('US2-1: envío vacío → un mensaje por campo, sin registrar y con el foco en el nombre', async () => {
    const { submit, stub, name } = setup();
    await submit();
    expect(name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    expect(screen.getByLabelText('Correo electrónico')).toHaveAccessibleDescription(
      'Ingresa tu correo electrónico',
    );
    expect(screen.getByLabelText('Contraseña')).toHaveAccessibleDescription('Crea una contraseña');
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveAccessibleDescription(
      'Confirma tu contraseña',
    );
    expect(screen.getByRole('checkbox', { name: /Acepto/ })).toHaveAccessibleDescription(
      'Debes aceptar los términos y condiciones',
    );
    expect(stub.register).not.toHaveBeenCalled();
    expect(name).toHaveFocus();
  });

  it.each(['usuario@', 'usuario.com'])(
    'US2-2: correo "%s" → "Ingresa un correo electrónico válido" al salir del campo',
    async (value) => {
      const { user, email, name } = setup();
      await user.type(email, value);
      expect(email).not.toHaveAccessibleDescription();
      await user.click(name);
      expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    },
  );

  it('US2-3: contraseña de 7 caracteres → mensaje de longitud mínima al salir del campo', async () => {
    const { user, password, name } = setup();
    await user.type(password, '1234567');
    await user.click(name);
    expect(password).toHaveAccessibleDescription('La contraseña debe tener al menos 8 caracteres');
  });

  it('US2-4: confirmación distinta → "Las contraseñas no coinciden" al salir del campo', async () => {
    const { user, password, confirm, name } = setup();
    await user.type(password, 'secreto-123');
    await user.type(confirm, 'secreto-124');
    await user.click(name);
    expect(confirm).toHaveAccessibleDescription('Las contraseñas no coinciden');
  });

  it('US2-5: casilla sin marcar → mensaje junto a la casilla y foco en ella si es lo único que falla', async () => {
    const { user, name, email, password, confirm, terms, submit, stub } = setup();
    await user.type(name, REGISTRATION_DATA.name);
    await user.type(email, REGISTRATION_DATA.email);
    await user.type(password, REGISTRATION_DATA.password);
    await user.type(confirm, REGISTRATION_DATA.password);
    await submit();
    expect(terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(terms).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
  });

  it('US2-6: corregir el valor hace desaparecer el mensaje de ese campo', async () => {
    const { user, name, submit } = setup();
    await submit();
    expect(name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    await user.type(name, 'Diego');
    expect(name).not.toHaveAccessibleDescription();
    expect(screen.getByLabelText('Correo electrónico')).toHaveAccessibleDescription(
      'Ingresa tu correo electrónico',
    );
  });

  it('US2-7: cada campo con error expone aria-invalid', async () => {
    const { submit, name, email, password, confirm, terms } = setup();
    await submit();
    for (const control of [name, email, password, confirm, terms]) {
      expect(control).toHaveAttribute('aria-invalid', 'true');
    }
  });

  it('UI-3: el foco va al primer campo con error en el orden del formulario', async () => {
    const { user, name, email, password, submit } = setup();
    await user.type(name, REGISTRATION_DATA.name);
    await submit();
    expect(email).toHaveFocus();
    await user.type(email, REGISTRATION_DATA.email);
    await submit();
    expect(password).toHaveFocus();
    await user.type(password, REGISTRATION_DATA.password);
    await submit();
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveFocus();
  });

  it('FR-004/FR-005/FR-006: los límites de 100, 254 y 128 caracteres muestran su mensaje', async () => {
    const { user, name, email, password, submit } = setup();
    await user.click(name);
    await user.paste('a'.repeat(101));
    await user.click(email);
    await user.paste(`${'a'.repeat(245)}@example.test`);
    await user.click(password);
    await user.paste('x'.repeat(129));
    await submit();
    expect(name).toHaveAccessibleDescription('El nombre no puede superar 100 caracteres');
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    expect(password).toHaveAccessibleDescription('La contraseña no puede superar 128 caracteres');
  });

  it('UI-12: sin violaciones de accesibilidad con errores visibles', async () => {
    const { submit } = setup();
    await submit();
    await expectNoA11yViolations(document.body);
  });
});

describe('RegisterForm · US3 Rechazar un correo ya registrado', () => {
  it('US3-1: email-taken → mensaje bajo el correo, datos conservados, contraseñas vacías y foco en el correo', async () => {
    const { fillValid, submit, name, email, password, confirm, onRegistered } = setup(
      createRegisterStub({ kind: 'email-taken' }),
    );
    await fillValid();
    await submit();
    await vi.waitFor(() =>
      expect(email).toHaveAccessibleDescription('Ya existe una cuenta con este correo'),
    );
    expect(name).toHaveValue(REGISTRATION_DATA.name);
    expect(email).toHaveValue(REGISTRATION_DATA.email);
    expect(password).toHaveValue('');
    expect(confirm).toHaveValue('');
    expect(email).toHaveFocus();
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('US3-2: editar el correo hace desaparecer el mensaje', async () => {
    const { user, fillValid, submit, email } = setup(createRegisterStub({ kind: 'email-taken' }));
    await fillValid();
    await submit();
    await vi.waitFor(() => expect(email).toHaveAccessibleDescription(/Ya existe una cuenta/));
    await user.type(email, 'x');
    expect(email).not.toHaveAccessibleDescription();
  });

  it('UI-6: servicio no disponible → Alert de error y contraseñas vacías', async () => {
    const { fillValid, submit, password, confirm, onRegistered } = setup(
      createRegisterStub({ kind: 'unavailable' }),
    );
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Servicio de registro no disponible. Intenta más tarde.',
    );
    expect(password).toHaveValue('');
    expect(confirm).toHaveValue('');
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('UI-6: escribir tras el error de servicio oculta el Alert', async () => {
    const { user, fillValid, submit, name } = setup(createRegisterStub({ kind: 'unavailable' }));
    await fillValid();
    await submit();
    await screen.findByRole('alert');
    await user.type(name, 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('UI-12: sin violaciones de accesibilidad en el estado de error de correo existente', async () => {
    const { fillValid, submit, email } = setup(createRegisterStub({ kind: 'email-taken' }));
    await fillValid();
    await submit();
    await vi.waitFor(() => expect(email).toHaveAccessibleDescription(/Ya existe una cuenta/));
    await expectNoA11yViolations(document.body);
  });
});

describe('RegisterForm · US4 Mostrar u ocultar la contraseña', () => {
  const toggles = () =>
    screen.getAllByRole('button', { name: /Mostrar contraseña|Ocultar contraseña/ });
  const toggle = (index: number) => {
    const control = toggles()[index];
    if (!control) throw new Error(`No existe el control de visibilidad ${index}`);
    return control;
  };

  it('US4-1: activar el control muestra la contraseña y pasa a "Ocultar contraseña"', async () => {
    const { user, password } = setup();
    await user.type(password, 'secreto-123');
    await user.click(toggle(0));
    expect(password).toHaveAttribute('type', 'text');
    expect(toggles()[0]).toHaveAccessibleName('Ocultar contraseña');
    expect(toggles()[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('US4-2: volver a activarlo oculta la contraseña', async () => {
    const { user, password } = setup();
    await user.click(toggle(0));
    await user.click(toggle(0));
    expect(password).toHaveAttribute('type', 'password');
    expect(toggles()[0]).toHaveAccessibleName('Mostrar contraseña');
  });

  it('US4-3: cada control actúa solo sobre su propio campo', async () => {
    const { user, password, confirm } = setup();
    await user.click(toggle(0));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirm).toHaveAttribute('type', 'password');
    await user.click(toggle(1));
    expect(confirm).toHaveAttribute('type', 'text');
    await user.click(toggle(0));
    expect(password).toHaveAttribute('type', 'password');
    expect(confirm).toHaveAttribute('type', 'text');
  });

  it('US4-4: los controles se alcanzan y activan solo con teclado', async () => {
    const { user, password } = setup();
    await user.click(password);
    await user.tab();
    expect(toggles()[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(password).toHaveAttribute('type', 'text');
    await user.keyboard(' ');
    expect(password).toHaveAttribute('type', 'password');
  });

  it('FR-016: las contraseñas no se escriben en consola, almacenamiento ni dirección', async () => {
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method).mockImplementation(() => {}),
    );
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { fillValid, submit, onRegistered } = setup();
    await fillValid();
    await submit();
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
    for (const spy of consoleSpies) expect(spy).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(window.location.href).not.toContain(REGISTRATION_DATA.password);
    consoleSpies.forEach((spy) => spy.mockRestore());
    setItem.mockRestore();
  });
});

describe('RegisterForm · US5 Navegación y elementos fuera de alcance', () => {
  it('US5-1: "Inicia sesión" llama a onLogin', async () => {
    const { user, onLogin } = setup();
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(onLogin).toHaveBeenCalledOnce();
  });

  it.each(['Google', 'Apple'])(
    'US5-3/FR-021: "%s" muestra un alert del navegador con "Próximamente" y conserva los datos',
    async (provider) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const { user, name, email, stub } = setup();
      await user.type(name, REGISTRATION_DATA.name);
      await user.type(email, REGISTRATION_DATA.email);
      await user.click(screen.getByRole('button', { name: provider }));
      expect(alert).toHaveBeenCalledExactlyOnceWith('Próximamente');
      expect(name).toHaveValue(REGISTRATION_DATA.name);
      expect(email).toHaveValue(REGISTRATION_DATA.email);
      expect(stub.register).not.toHaveBeenCalled();
      alert.mockRestore();
    },
  );

  it('US5-3: el enlace de términos muestra el aviso, conserva los datos y no marca la casilla', async () => {
    const { user, name, terms } = setup();
    await user.type(name, REGISTRATION_DATA.name);
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      'Función no disponible en esta demostración',
    );
    expect(name).toHaveValue(REGISTRATION_DATA.name);
    expect(terms).not.toBeChecked();
  });

  it('el aviso desaparece al enviar el formulario', async () => {
    const { user, submit } = setup();
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    await screen.findByRole('status');
    await submit();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
