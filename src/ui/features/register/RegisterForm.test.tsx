import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegisterStub } from '@/test/registerStub';
import { RegisterForm } from './RegisterForm';

function setup(
  stub = createRegisterStub(),
  options: {
    redirectDelayMs?: number;
    onSuccessRedirect?: () => void;
    onNavigateToLogin?: () => void;
  } = {},
) {
  const user = userEvent.setup();
  const onSuccessRedirect = options.onSuccessRedirect ?? vi.fn();
  const onNavigateToLogin = options.onNavigateToLogin ?? vi.fn();
  render(
    <RegisterForm
      registerAccount={stub.registerAccount}
      redirectDelayMs={options.redirectDelayMs ?? 20}
      onSuccessRedirect={onSuccessRedirect}
      onNavigateToLogin={onNavigateToLogin}
    />,
  );
  const fullName = screen.getByLabelText('Nombre completo');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText('Contraseña');
  const confirmPassword = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  return {
    user,
    stub,
    fullName,
    email,
    password,
    confirmPassword,
    terms,
    submit,
    onSuccessRedirect,
    onNavigateToLogin,
  };
}

describe('RegisterForm · US1 Crear cuenta con datos válidos y redirigir a /login', () => {
  it('US1-1: registra la cuenta, muestra alerta de éxito y redirige automáticamente a /login tras la pausa', async () => {
    const onSuccessRedirect = vi.fn();
    const { user, stub, fullName, email, password, confirmPassword, terms, submit } = setup(
      createRegisterStub({ kind: 'success', displayName: 'Steven Luna' }),
      { redirectDelayMs: 30, onSuccessRedirect },
    );

    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password123');
    await user.click(terms);
    await submit();

    expect(stub.registerAccount).toHaveBeenCalledOnce();
    expect(await screen.findByRole('status')).toHaveTextContent(
      '¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…',
    );
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeDisabled();

    await vi.waitFor(() => {
      expect(onSuccessRedirect).toHaveBeenCalledOnce();
    });
  });

  it('US1-2: durante la espera el botón muestra "Creando cuenta…", está deshabilitado y bloquea envíos duplicados', async () => {
    const { user, stub, fullName, email, password, confirmPassword, terms, submit } = setup();
    stub.defer();

    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password123');
    await user.click(terms);
    await submit();

    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    await user.keyboard('{Enter}');
    expect(stub.registerAccount).toHaveBeenCalledOnce();

    await act(async () => stub.release());
    expect(await screen.findByRole('status')).toHaveTextContent(/Cuenta creada con éxito/);
  });

  it('US1-3: acepta nombre y correo con espacios periféricos y correo en mayúsculas', async () => {
    const { user, stub, fullName, email, password, confirmPassword, terms, submit } = setup();
    await user.type(fullName, '  Steven Luna  ');
    await user.type(email, '  STEVEN.Luna@Example.TEST ');
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password123');
    await user.click(terms);
    await submit();

    expect(stub.registerAccount).toHaveBeenCalledWith({
      fullName: '  Steven Luna  ',
      email: expect.stringMatching(/^\s*steven\.luna@example\.test\s*$/i),
      password: 'Password123',
    });
  });

  it('US1-4: presionar Enter en un campo de texto envía el formulario', async () => {
    const { user, stub, fullName, email, password, confirmPassword, terms } = setup();
    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, 'Password123');
    await user.click(terms);
    await user.type(confirmPassword, 'Password123{Enter}');

    expect(stub.registerAccount).toHaveBeenCalledOnce();
  });
});

describe('RegisterForm · US2 Validar campos en línea y verificar integridad antes del envío', () => {
  it('US2-1: envío vacío muestra los 5 mensajes obligatorios, no invoca el registro y mueve el foco al primer campo con error', async () => {
    const { stub, fullName, email, password, confirmPassword, terms, submit } = setup();
    await submit();

    expect(fullName).toHaveAccessibleDescription('Ingresa tu nombre completo');
    expect(email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
    expect(password).toHaveAccessibleDescription('Ingresa tu contraseña');
    expect(confirmPassword).toHaveAccessibleDescription('Confirma tu contraseña');
    expect(terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(stub.registerAccount).not.toHaveBeenCalled();
    expect(fullName).toHaveFocus();
  });

  it('US2-1, FR-005: al enviar con campos parcialmente válidos mueve el foco al primer control inválido en orden', async () => {
    const { user, fullName, email, password, confirmPassword, terms, submit } = setup();
    await user.type(fullName, 'Steven Luna');
    await submit();
    expect(email).toHaveFocus();

    await user.type(email, 'steven@example.test');
    await submit();
    expect(password).toHaveFocus();

    await user.type(password, 'Password123');
    await submit();
    expect(confirmPassword).toHaveFocus();

    await user.type(confirmPassword, 'Password123');
    await submit();
    expect(terms).toHaveFocus();
  });

  it('US2-2: correo con formato inválido muestra error inline al salir del campo', async () => {
    const { user, email } = setup();
    await user.type(email, 'usuario@');
    await user.tab();
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    expect(email).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-3: contraseña con menos de 8 caracteres muestra error inline al salir del campo', async () => {
    const { user, password } = setup();
    await user.type(password, '1234567');
    await user.tab();
    expect(password).toHaveAccessibleDescription('La contraseña debe tener al menos 8 caracteres');
    expect(password).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-4: confirmar contraseña que no coincide muestra "Las contraseñas no coinciden" al salir del campo', async () => {
    const { user, password, confirmPassword } = setup();
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password999');
    await user.tab();
    expect(confirmPassword).toHaveAccessibleDescription('Las contraseñas no coinciden');
    expect(confirmPassword).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-5: al corregir el valor de un campo o marcar términos el mensaje de error desaparece inmediatamente', async () => {
    const { user, fullName, email, password, confirmPassword, terms, submit } = setup();
    await submit();

    await user.type(fullName, 'Steven Luna');
    expect(screen.queryByText('Ingresa tu nombre completo')).not.toBeInTheDocument();

    await user.type(email, 'steven@example.test');
    expect(screen.queryByText('Ingresa tu correo electrónico')).not.toBeInTheDocument();

    await user.type(password, 'Password123');
    expect(screen.queryByText('Ingresa tu contraseña')).not.toBeInTheDocument();

    await user.type(confirmPassword, 'Password123');
    expect(screen.queryByText('Confirma tu contraseña')).not.toBeInTheDocument();

    await user.click(terms);
    expect(screen.queryByText('Debes aceptar los términos y condiciones')).not.toBeInTheDocument();
  });

  it('US2-6: correo ya existente muestra alerta de error, conserva nombre y correo, limpia contraseñas y enfoca el correo', async () => {
    const { user, fullName, email, password, confirmPassword, terms, submit } = setup(
      createRegisterStub({ kind: 'email-already-exists' }),
    );
    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password123');
    await user.click(terms);
    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No fue posible crear la cuenta con este correo electrónico.',
    );
    expect(fullName).toHaveValue('Steven Luna');
    expect(email).toHaveValue('steven.luna@example.test');
    expect(password).toHaveValue('');
    expect(confirmPassword).toHaveValue('');
    expect(email).toHaveFocus();
  });

  it('FR-014: servicio no disponible muestra mensaje comprensible sin detalles internos', async () => {
    const { user, fullName, email, password, confirmPassword, terms, submit } = setup(
      createRegisterStub({ kind: 'unavailable' }),
    );
    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, 'Password123');
    await user.type(confirmPassword, 'Password123');
    await user.click(terms);
    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Servicio de registro no disponible. Intenta más tarde.',
    );
  });
});

describe('RegisterForm · US3 Autenticación social y navegación a /login', () => {
  it.each(['Google', 'Apple'])(
    'US3-1, FR-007: al pulsar "%s" muestra el aviso "Próximamente" con role="status" y conserva los datos del formulario',
    async (provider) => {
      const { user, stub, fullName, email, password, confirmPassword } = setup();
      await user.type(fullName, 'Steven Luna');
      await user.type(email, 'steven@example.test');
      await user.type(password, 'Password123');
      await user.type(confirmPassword, 'Password123');

      await user.click(screen.getByRole('button', { name: provider }));

      expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
      expect(fullName).toHaveValue('Steven Luna');
      expect(email).toHaveValue('steven@example.test');
      expect(password).toHaveValue('Password123');
      expect(confirmPassword).toHaveValue('Password123');
      expect(stub.registerAccount).not.toHaveBeenCalled();
    },
  );

  it('US3-2, FR-008: al activar "Inicia sesión" junto a "¿Ya tienes cuenta?" invoca onNavigateToLogin', async () => {
    const onNavigateToLogin = vi.fn();
    const { user } = setup(createRegisterStub(), { onNavigateToLogin });
    expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });
});

describe('RegisterForm · US4 Visibilidad independiente de contraseñas y navegación por teclado', () => {
  it('US4-3, FR-006: alterna la visibilidad de "Contraseña" y "Confirmar contraseña" de forma independiente', async () => {
    const { user, password, confirmPassword } = setup();
    const [togglePassword, toggleConfirm] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    if (!togglePassword || !toggleConfirm) throw new Error('Botones de visibilidad no encontrados');

    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(togglePassword);
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(toggleConfirm);
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'text');

    await user.click(togglePassword);
    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'text');
  });

  it('FR-013: orden de tabulación por teclado según contracts/ui-register.md', async () => {
    const { user } = setup();
    const [togglePassword, toggleConfirm] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    if (!togglePassword || !toggleConfirm) throw new Error('Botones de visibilidad no encontrados');

    const expected = [
      screen.getByLabelText('Nombre completo'),
      screen.getByLabelText('Correo electrónico'),
      screen.getByLabelText('Contraseña'),
      togglePassword,
      screen.getByLabelText('Confirmar contraseña'),
      toggleConfirm,
      screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
      screen.getByRole('button', { name: 'Crear cuenta' }),
      screen.getByRole('button', { name: 'Google' }),
      screen.getByRole('button', { name: 'Apple' }),
      screen.getByRole('button', { name: 'Inicia sesión' }),
    ];

    for (const element of expected) {
      await user.tab();
      expect(element).toHaveFocus();
    }
  });
});

describe('RegisterForm · seguridad (FR-011)', () => {
  it('la contraseña y su confirmación nunca aparecen en el DOM, URL, consola ni almacenamiento', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const secret = 'ClaveSuperSecreta99';

    const { user, fullName, email, password, confirmPassword, terms, submit } = setup(
      createRegisterStub({ kind: 'email-already-exists' }),
    );
    await user.type(fullName, 'Steven Luna');
    await user.type(email, 'steven.luna@example.test');
    await user.type(password, secret);
    await user.type(confirmPassword, secret);
    await user.click(terms);
    await submit();
    await screen.findByRole('alert');

    const serialized = [
      document.body.textContent ?? '',
      window.location.href,
      ...setItem.mock.calls.flat(),
      ...consoleSpies.flatMap((spy) => spy.mock.calls.flat().map(String)),
    ].join('\n');

    expect(serialized).not.toContain(secret);
    expect(setItem).not.toHaveBeenCalled();

    setItem.mockRestore();
    consoleSpies.forEach((spy) => spy.mockRestore());
  });
});
