import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RegistrationResult } from '@/domain/registration';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegistrationStub } from '@/test/registrationStub';
import { RegisterForm } from './RegisterForm';

const VALID = {
  fullName: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
};

function setup(result?: RegistrationResult, focusOnMount = false) {
  const user = userEvent.setup();
  const stub = createRegistrationStub(result);
  const onRegistered = vi.fn();
  const onGoToLogin = vi.fn();
  const view = render(
    <RegisterForm
      register={stub.register}
      onRegistered={onRegistered}
      onGoToLogin={onGoToLogin}
      focusOnMount={focusOnMount}
    />,
  );
  const fields = {
    name: screen.getByLabelText('Nombre completo'),
    email: screen.getByLabelText('Correo electrónico'),
    password: screen.getByLabelText('Contraseña'),
    confirm: screen.getByLabelText('Confirmar contraseña'),
    terms: screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
  };
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  const fillValid = async () => {
    await user.type(fields.name, VALID.fullName);
    await user.type(fields.email, VALID.email);
    await user.type(fields.password, VALID.password);
    await user.type(fields.confirm, VALID.password);
    await user.click(fields.terms);
  };
  return { user, stub, onRegistered, onGoToLogin, fields, submit, fillValid, ...view };
}

describe('RegisterForm · contrato de UI (contracts/ui-registro.md)', () => {
  it('FR-001/FR-002: textos y controles del diseño', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Diego Martínez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tucorreo@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByText('o regístrate con')).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar confirmación' })).toBeInTheDocument();
  });

  it('FR-015: ambas contraseñas ocultas y con autocomplete new-password', () => {
    const { fields } = setup();
    for (const field of [fields.password, fields.confirm]) {
      expect(field).toHaveAttribute('type', 'password');
      expect(field).toHaveAttribute('autocomplete', 'new-password');
    }
  });

  it('FR-017: orden de tabulación según el contrato', async () => {
    const { user, fields } = setup();
    const expected = [
      fields.name,
      fields.email,
      fields.password,
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      fields.confirm,
      screen.getByRole('button', { name: 'Mostrar confirmación' }),
      fields.terms,
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

  it('FR-017: sin violaciones de accesibilidad, también con errores visibles', async () => {
    const { container, submit } = setup();
    await expectNoA11yViolations(container);
    await submit();
    await expectNoA11yViolations(container);
  });

  it('US4-5: con focusOnMount el foco inicia en "Nombre completo"', () => {
    const { fields } = setup(undefined, true);
    expect(fields.name).toHaveFocus();
  });
});

describe('RegisterForm · US1 Crear una cuenta', () => {
  it('US1-1: datos válidos → registra y avisa a App', async () => {
    const { stub, onRegistered, fillValid, submit } = setup();
    await fillValid();
    await submit();
    expect(stub.register).toHaveBeenCalledWith({
      fullName: VALID.fullName,
      email: VALID.email,
      password: VALID.password,
      confirmPassword: VALID.password,
      acceptTerms: true,
    });
    expect(onRegistered).toHaveBeenCalledOnce();
  });

  it('US1-2: durante el registro el botón está ocupado y no admite reenvíos', async () => {
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
    await act(async () => stub.release());
    expect(onRegistered).toHaveBeenCalledOnce();
  });

  it('FR-014 (001): Enter en un campo envía el formulario', async () => {
    const { user, stub, fillValid, fields } = setup();
    await fillValid();
    await user.click(fields.confirm);
    await user.keyboard('{Enter}');
    expect(stub.register).toHaveBeenCalledOnce();
  });
});

describe('RegisterForm · US2 Corregir los datos antes de enviar', () => {
  it('US2-1: formulario vacío → cinco errores, sin registro y foco en el nombre', async () => {
    const { stub, fields, submit } = setup();
    await submit();
    expect(fields.name).toHaveAccessibleDescription('Ingresa tu nombre completo');
    expect(fields.email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
    expect(fields.password).toHaveAccessibleDescription('Ingresa tu contraseña');
    expect(fields.confirm).toHaveAccessibleDescription('Confirma tu contraseña');
    expect(fields.terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    for (const field of Object.values(fields)) {
      expect(field).toHaveAttribute('aria-invalid', 'true');
    }
    expect(fields.name).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
  });

  it('US2-2: correo inválido al salir del campo', async () => {
    const { user, fields } = setup();
    await user.type(fields.email, 'usuario@');
    await user.tab();
    expect(fields.email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
  });

  it('US2-3: contraseña de menos de 8 caracteres al salir del campo', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, '1234567');
    await user.tab();
    expect(fields.password).toHaveAccessibleDescription(
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('US2-4 / US2-5: las contraseñas no coinciden y el error desaparece al igualarlas', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, 'clave-segura-1');
    await user.type(fields.confirm, 'clave-segura-2');
    await user.tab();
    expect(fields.confirm).toHaveAccessibleDescription('Las contraseñas no coinciden');
    await user.clear(fields.password);
    await user.type(fields.password, 'clave-segura-2');
    expect(fields.confirm).not.toHaveAttribute('aria-invalid');
  });

  it('US2-6: el error de un campo desaparece al corregirlo', async () => {
    const { user, fields, submit } = setup();
    await submit();
    await user.type(fields.name, 'Diego');
    expect(fields.name).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Ingresa tu nombre completo')).not.toBeInTheDocument();
  });

  it('US2-7: términos sin aceptar impiden el registro; al marcarlos el error desaparece', async () => {
    const { user, stub, fields, submit } = setup();
    await user.type(fields.name, VALID.fullName);
    await user.type(fields.email, VALID.email);
    await user.type(fields.password, VALID.password);
    await user.type(fields.confirm, VALID.password);
    await submit();
    expect(fields.terms).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
    await user.click(fields.terms);
    expect(screen.queryByText('Debes aceptar los términos y condiciones')).not.toBeInTheDocument();
  });

  it('Edge Case: salir de un campo vacío no desplaza el formulario y "Inicia sesión" recibe el clic', async () => {
    const { user, fields, onGoToLogin } = setup();
    await user.click(fields.name);
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(fields.name).not.toHaveAttribute('aria-invalid');
    expect(onGoToLogin).toHaveBeenCalledOnce();
  });
});

describe('RegisterForm · US3 Evitar correos repetidos', () => {
  it('US3-1: correo existente → error en el correo, foco y datos conservados', async () => {
    const { fields, fillValid, submit, onRegistered } = setup({ kind: 'email-taken' });
    await fillValid();
    await submit();
    expect(await screen.findByText('Ya existe una cuenta con este correo')).toBeInTheDocument();
    expect(fields.email).toHaveAccessibleDescription('Ya existe una cuenta con este correo');
    expect(fields.email).toHaveFocus();
    expect(fields.name).toHaveValue(VALID.fullName);
    expect(fields.password).toHaveValue(VALID.password);
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it('US3-2: el error desaparece al modificar el correo', async () => {
    const { user, fields, fillValid, submit } = setup({ kind: 'email-taken' });
    await fillValid();
    await submit();
    await screen.findByText('Ya existe una cuenta con este correo');
    await user.type(fields.email, 'x');
    expect(screen.queryByText('Ya existe una cuenta con este correo')).not.toBeInTheDocument();
  });

  it('FR-019: error inesperado sin detalles técnicos', async () => {
    const { fillValid, submit, onRegistered } = setup({ kind: 'unavailable' });
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos crear tu cuenta. Intenta más tarde.',
    );
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · US4 y US5', () => {
  it('US4-1: "Inicia sesión" avisa a App para navegar a /login', async () => {
    const { user, onGoToLogin } = setup();
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(onGoToLogin).toHaveBeenCalledOnce();
  });

  it.each(['Google', 'Apple'])(
    'US5-1: "%s" muestra el alert "Próximamente" y conserva los datos',
    async (provider) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const { user, fields, stub } = setup();
      await user.type(fields.name, VALID.fullName);
      await user.click(screen.getByRole('button', { name: provider }));
      expect(alert).toHaveBeenCalledWith('Próximamente');
      expect(fields.name).toHaveValue(VALID.fullName);
      expect(stub.register).not.toHaveBeenCalled();
      alert.mockRestore();
    },
  );
});

describe('RegisterForm · seguridad (FR-018)', () => {
  it('la contraseña no aparece en el DOM, la URL, la consola ni el almacenamiento', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const { fillValid, submit } = setup({ kind: 'unavailable' });
    await fillValid();
    await submit();
    await screen.findByRole('alert');
    const serialized = [
      document.body.textContent ?? '',
      window.location.href,
      ...setItem.mock.calls.flat(),
      ...consoleSpies.flatMap((spy) => spy.mock.calls.flat().map(String)),
    ].join('\n');
    expect(serialized).not.toContain(VALID.password);
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
    consoleSpies.forEach((spy) => spy.mockRestore());
  });
});
