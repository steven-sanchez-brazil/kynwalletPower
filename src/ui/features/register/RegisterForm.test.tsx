import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegisterStub } from '@/test/registerStub';
import { RegisterForm } from './RegisterForm';

const NEW_USER = {
  fullName: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
};

function setup(stub = createRegisterStub()) {
  const user = userEvent.setup();
  const onRegistered = vi.fn();
  const { container } = render(
    <RegisterForm registerAccount={stub.registerAccount} onRegistered={onRegistered} />,
  );
  const fields = {
    fullName: screen.getByLabelText('Nombre completo'),
    email: screen.getByLabelText('Correo electrónico'),
    password: screen.getByLabelText('Contraseña'),
    confirmPassword: screen.getByLabelText('Confirmar contraseña'),
    terms: screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
  };
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  const fillValid = async () => {
    await user.type(fields.fullName, NEW_USER.fullName);
    await user.type(fields.email, NEW_USER.email);
    await user.type(fields.password, NEW_USER.password);
    await user.type(fields.confirmPassword, NEW_USER.password);
    await user.click(fields.terms);
  };
  return { user, stub, onRegistered, container, fields, submit, fillValid };
}

describe('RegisterForm · estructura (FR-001, FR-002, FR-003)', () => {
  it('muestra título, campos, casilla sin marcar y textos del diseño', () => {
    const { fields } = setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(fields.fullName).toHaveAttribute('placeholder', 'Ej: Diego Martínez');
    expect(fields.email).toHaveAttribute('placeholder', 'tucorreo@ejemplo.com');
    expect(fields.password).toHaveAttribute('type', 'password');
    expect(fields.confirmPassword).toHaveAttribute('type', 'password');
    expect(fields.terms).not.toBeChecked();
    expect(screen.getByText('o regístrate con')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('FR-019: cada contraseña tiene su control de visibilidad', () => {
    setup();
    expect(screen.getAllByRole('button', { name: 'Mostrar contraseña' })).toHaveLength(2);
  });

  it('FR-020: sin violaciones de accesibilidad', async () => {
    const { container } = setup();
    await expectNoA11yViolations(container);
  });
});

describe('RegisterForm · US1 Crear una cuenta con datos válidos', () => {
  it('US1-1: datos válidos → registra con los datos del formulario y avisa el éxito', async () => {
    const { stub, onRegistered, fillValid, submit } = setup();
    await fillValid();
    await submit();
    expect(stub.registerAccount).toHaveBeenCalledWith({
      fullName: NEW_USER.fullName,
      email: NEW_USER.email,
      password: NEW_USER.password,
      confirmPassword: NEW_USER.password,
      acceptedTerms: true,
    });
    expect(onRegistered).toHaveBeenCalledOnce();
  });

  it('US1-2: durante la espera el botón está ocupado y no admite reenvíos', async () => {
    const { user, stub, onRegistered, fillValid, submit } = setup();
    stub.defer();
    await fillValid();
    await submit();
    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    expect(stub.registerAccount).toHaveBeenCalledOnce();
    expect(onRegistered).not.toHaveBeenCalled();
    await act(async () => stub.release());
    expect(onRegistered).toHaveBeenCalledOnce();
  });

  it('US1-4: Enter en un campo envía el formulario', async () => {
    const { user, stub, fields, fillValid } = setup();
    await fillValid();
    await user.type(fields.fullName, '{Enter}');
    expect(stub.registerAccount).toHaveBeenCalledOnce();
  });

  it('FR-014: correo ya registrado → mensaje genérico, sin éxito y contraseñas vacías', async () => {
    const { onRegistered, fields, fillValid, submit } = setup(
      createRegisterStub({ kind: 'email-taken' }),
    );
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos crear la cuenta con este correo. Si ya tienes una cuenta, inicia sesión.',
    );
    expect(onRegistered).not.toHaveBeenCalled();
    expect(fields.fullName).toHaveValue(NEW_USER.fullName);
    expect(fields.email).toHaveValue(NEW_USER.email);
    expect(fields.password).toHaveValue('');
    expect(fields.confirmPassword).toHaveValue('');
  });

  it('FR-022: servicio no disponible → mensaje sin detalles internos', async () => {
    const { fillValid, submit } = setup(createRegisterStub({ kind: 'unavailable' }));
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Servicio de registro no disponible. Intenta más tarde.',
    );
  });

  it('el mensaje de error de envío desaparece al editar', async () => {
    const { user, fields, fillValid, submit } = setup(createRegisterStub({ kind: 'unavailable' }));
    await fillValid();
    await submit();
    await screen.findByRole('alert');
    await user.type(fields.fullName, 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('RegisterForm · US2 Validar los datos antes de crear la cuenta', () => {
  it('US2-1: envío vacío → todos los mensajes, sin registrar y foco en el nombre', async () => {
    const { stub, fields, submit } = setup();
    await submit();
    expect(fields.fullName).toHaveAccessibleDescription('Ingresa tu nombre completo');
    expect(fields.email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
    expect(fields.password).toHaveAccessibleDescription('Ingresa tu contraseña');
    expect(fields.confirmPassword).toHaveAccessibleDescription('Confirma tu contraseña');
    expect(fields.terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(stub.registerAccount).not.toHaveBeenCalled();
    expect(fields.fullName).toHaveFocus();
  });

  it('FR-010: el foco va al primer campo con error (la casilla si es la única)', async () => {
    const { user, stub, fields, submit } = setup();
    await user.type(fields.fullName, NEW_USER.fullName);
    await user.type(fields.email, NEW_USER.email);
    await user.type(fields.password, NEW_USER.password);
    await user.type(fields.confirmPassword, NEW_USER.password);
    await submit();
    expect(fields.terms).toHaveFocus();
    expect(stub.registerAccount).not.toHaveBeenCalled();
  });

  it('US2-2: "usuario@" y salir del campo → correo inválido', async () => {
    const { user, fields } = setup();
    await user.type(fields.email, 'usuario@');
    await user.tab();
    expect(fields.email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    expect(fields.email).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-3: contraseña de 7 caracteres y salir → mensaje de longitud', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, '1234567');
    await user.click(fields.fullName);
    expect(fields.password).toHaveAccessibleDescription(
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('US2-4: confirmación distinta y salir → las contraseñas no coinciden', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, NEW_USER.password);
    await user.type(fields.confirmPassword, 'otra-clave-99');
    await user.click(fields.fullName);
    expect(fields.confirmPassword).toHaveAccessibleDescription('Las contraseñas no coinciden');
  });

  it('US2-5: corregir el valor oculta el mensaje', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, NEW_USER.password);
    await user.type(fields.confirmPassword, 'otra');
    await user.click(fields.fullName);
    await user.clear(fields.confirmPassword);
    await user.type(fields.confirmPassword, NEW_USER.password);
    expect(fields.confirmPassword).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Las contraseñas no coinciden')).not.toBeInTheDocument();
  });

  it('FR-004: nombre con dígitos → nombre inválido', async () => {
    const { user, fields } = setup();
    await user.type(fields.fullName, 'Diego123');
    await user.tab();
    expect(fields.fullName).toHaveAccessibleDescription(
      'Ingresa un nombre válido (solo letras y espacios)',
    );
  });

  it('US2-6: con errores visibles no hay violaciones de accesibilidad', async () => {
    const { container, submit } = setup();
    await submit();
    await expectNoA11yViolations(container);
  });
});

describe('RegisterForm · US4 Google, Apple y términos (próximamente)', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it.each(['Google', 'Apple'])(
    'US4-1: "%s" muestra el alert "Próximamente" y conserva los datos',
    async (name) => {
      const { user, stub, fields } = setup();
      await user.type(fields.fullName, NEW_USER.fullName);
      await user.click(screen.getByRole('button', { name }));
      expect(alertSpy).toHaveBeenCalledWith('Próximamente');
      expect(fields.fullName).toHaveValue(NEW_USER.fullName);
      expect(stub.registerAccount).not.toHaveBeenCalled();
    },
  );

  it('US4-2: "términos y condiciones" muestra el alert y no cambia la casilla', async () => {
    const { user, fields } = setup();
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(alertSpy).toHaveBeenCalledWith('Próximamente');
    expect(fields.terms).not.toBeChecked();
  });
});

describe('RegisterForm · teclado y seguridad', () => {
  it('FR-020: orden de tabulación según contracts/ui-registro.md', async () => {
    const { user, fields } = setup();
    const [showPassword, showConfirm] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    const expected = [
      fields.fullName,
      fields.email,
      fields.password,
      showPassword,
      fields.confirmPassword,
      showConfirm,
      fields.terms,
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

  it('FR-018: la contraseña no aparece en el DOM, la URL, la consola ni el almacenamiento', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const { fillValid, submit } = setup(createRegisterStub({ kind: 'email-taken' }));
    await fillValid();
    await submit();
    await screen.findByRole('alert');

    const serialized = [
      document.body.textContent ?? '',
      window.location.href,
      ...setItem.mock.calls.flat(),
      ...consoleSpies.flatMap((spy) => spy.mock.calls.flat().map(String)),
    ].join('\n');
    expect(serialized).not.toContain(NEW_USER.password);
    expect(setItem).not.toHaveBeenCalled();

    setItem.mockRestore();
    consoleSpies.forEach((spy) => spy.mockRestore());
  });
});
