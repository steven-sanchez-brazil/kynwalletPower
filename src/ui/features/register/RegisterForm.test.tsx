import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RegisterResult } from '@/domain/auth';
import type { RegistrationData } from '@/domain/registration';
import { expectNoA11yViolations } from '@/test/a11y';
import { RegisterForm } from './RegisterForm';

function setup(result: RegisterResult = { kind: 'success' }, { deferred = false } = {}) {
  const pending: { resolve: (result: RegisterResult) => void } = { resolve: () => {} };
  const register = vi.fn<(data: RegistrationData) => Promise<RegisterResult>>(
    () =>
      new Promise((resolve) => {
        if (deferred) pending.resolve = resolve;
        else resolve(result);
      }),
  );
  const onRegistered = vi.fn();
  const view = render(<RegisterForm register={register} onRegistered={onRegistered} />);
  return { register, onRegistered, pending, ...view };
}

const field = {
  name: () => screen.getByLabelText('Nombre completo'),
  email: () => screen.getByLabelText('Correo electrónico'),
  password: () => screen.getByLabelText('Contraseña'),
  confirmation: () => screen.getByLabelText('Confirmar contraseña'),
  terms: () => screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
};

const submitButton = () => screen.getByRole('button', { name: 'Crear cuenta' });

async function fillValid() {
  await userEvent.type(field.name(), 'Diego Martínez');
  await userEvent.type(field.email(), 'diego@example.test');
  await userEvent.type(field.password(), 'clave-segura');
  await userEvent.type(field.confirmation(), 'clave-segura');
  await userEvent.click(field.terms());
}

describe('RegisterForm · US1 Crear una cuenta con datos válidos', () => {
  it('US1-1: datos válidos → registra y avisa del éxito', async () => {
    const { register, onRegistered } = setup();
    await fillValid();
    await userEvent.click(submitButton());

    expect(register).toHaveBeenCalledWith({
      fullName: 'Diego Martínez',
      email: 'diego@example.test',
      password: 'clave-segura',
      passwordConfirmation: 'clave-segura',
      acceptedTerms: true,
    });
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('US1-3: durante la espera el botón está ocupado y no admite reenvíos', async () => {
    const { register, onRegistered, pending } = setup({ kind: 'success' }, { deferred: true });
    await fillValid();
    await userEvent.click(submitButton());

    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await userEvent.type(field.confirmation(), '{Enter}');
    expect(register).toHaveBeenCalledOnce();

    pending.resolve({ kind: 'success' });
    await vi.waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('US1-4: Enter en un campo envía el formulario', async () => {
    const { register } = setup();
    await fillValid();
    await userEvent.type(field.name(), '{Enter}');
    expect(register).toHaveBeenCalledOnce();
  });

  it('Caso límite: desmontar durante el registro no produce errores', async () => {
    const { pending, onRegistered, unmount } = setup({ kind: 'success' }, { deferred: true });
    await fillValid();
    await userEvent.click(submitButton());
    unmount();
    pending.resolve({ kind: 'success' });
    await Promise.resolve();
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · US2 Validar los datos antes de crear la cuenta', () => {
  it('US2-1: envío vacío → cinco mensajes, sin registrar y foco en el nombre', async () => {
    const { register } = setup();
    await userEvent.click(submitButton());

    for (const message of [
      'Ingresa tu nombre completo',
      'Ingresa tu correo electrónico',
      'Ingresa tu contraseña',
      'Confirma tu contraseña',
      'Debes aceptar los términos y condiciones',
    ]) {
      expect(screen.getByText(message)).toBeInTheDocument();
    }
    expect(register).not.toHaveBeenCalled();
    expect(field.name()).toHaveFocus();
  });

  it('FR-009: el foco va al primer campo con error', async () => {
    setup();
    await userEvent.type(field.name(), 'Diego');
    await userEvent.type(field.email(), 'diego@example.test');
    await userEvent.click(submitButton());
    expect(field.password()).toHaveFocus();
  });

  it('FR-009: si solo faltan los términos, el foco va a la casilla', async () => {
    const { register } = setup();
    await fillValid();
    await userEvent.click(field.terms());
    await userEvent.click(submitButton());
    expect(field.terms()).toHaveFocus();
    expect(register).not.toHaveBeenCalled();
  });

  it('US2-2: "usuario@" y salir del campo → mensaje de correo válido', async () => {
    setup();
    await userEvent.type(field.email(), 'usuario@');
    await userEvent.tab();
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument();
  });

  it('US2-3: contraseña de 7 caracteres → mensaje de longitud al salir', async () => {
    setup();
    await userEvent.type(field.password(), '1234567');
    await userEvent.click(field.confirmation());
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
  });

  it('US2-4: confirmación distinta → "Las contraseñas no coinciden"', async () => {
    setup();
    await userEvent.type(field.password(), 'clave-segura');
    await userEvent.type(field.confirmation(), 'clave-segur');
    await userEvent.tab();
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('US2-7: el campo con error es inválido y describe su mensaje', async () => {
    setup();
    await userEvent.click(submitButton());
    expect(field.name()).toHaveAttribute('aria-invalid', 'true');
    expect(field.name()).toHaveAccessibleDescription('Ingresa tu nombre completo');
  });
});

describe('RegisterForm · US3 Rechazar un correo ya registrado', () => {
  it('US3-1: email-taken → mensaje en el correo y foco en el correo', async () => {
    setup({ kind: 'email-taken' });
    await fillValid();
    await userEvent.click(submitButton());

    expect(await screen.findByText('Ya existe una cuenta con este correo')).toBeInTheDocument();
    expect(field.email()).toHaveAccessibleDescription('Ya existe una cuenta con este correo');
    expect(field.email()).toHaveFocus();
  });

  it('US3-2: editar el correo oculta el mensaje', async () => {
    setup({ kind: 'email-taken' });
    await fillValid();
    await userEvent.click(submitButton());
    await screen.findByText('Ya existe una cuenta con este correo');

    await userEvent.type(field.email(), 'x');
    expect(screen.queryByText('Ya existe una cuenta con este correo')).not.toBeInTheDocument();
  });

  it('FR-023: servicio no disponible → alerta sin detalles internos', async () => {
    const { onRegistered } = setup({ kind: 'unavailable' });
    await fillValid();
    await userEvent.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Servicio de acceso no disponible. Intenta más tarde.',
    );
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · US5 Opciones fuera del alcance', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['Google', 'Apple'])(
    'US5-1: "%s" muestra "Próximamente" y conserva los datos',
    async (name) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      setup();
      await userEvent.type(field.name(), 'Diego');
      await userEvent.click(screen.getByRole('button', { name }));

      expect(alert).toHaveBeenCalledWith('Próximamente');
      expect(field.name()).toHaveValue('Diego');
    },
  );

  it('US5-2: "términos y condiciones" muestra "Próximamente" sin cambiar la casilla', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));

    expect(alert).toHaveBeenCalledWith('Próximamente');
    expect(field.terms()).not.toBeChecked();
  });
});

describe('RegisterForm · US6 Mostrar u ocultar las contraseñas', () => {
  it('US6-1: cada campo tiene su propio control de visibilidad', async () => {
    setup();
    const [passwordToggle, confirmationToggle] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    expect(field.password()).toHaveAttribute('type', 'password');
    expect(field.confirmation()).toHaveAttribute('type', 'password');

    await userEvent.click(passwordToggle as HTMLElement);
    expect(field.password()).toHaveAttribute('type', 'text');
    expect(field.confirmation()).toHaveAttribute('type', 'password');

    await userEvent.click(confirmationToggle as HTMLElement);
    expect(field.confirmation()).toHaveAttribute('type', 'text');
  });
});

describe('RegisterForm · diseño, teclado y seguridad', () => {
  it('FR-001: textos del frame 04 · Registro', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(field.name()).toHaveAttribute('placeholder', 'Ej. Diego Martínez');
    expect(field.email()).toHaveAttribute('placeholder', 'tucorreo@ejemplo.com');
    expect(screen.getByText('o regístrate con')).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('FR-020: orden de tabulación según contracts/ui-register.md', async () => {
    setup();
    const [passwordToggle, confirmationToggle] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    const expected = [
      field.name(),
      field.email(),
      field.password(),
      passwordToggle,
      field.confirmation(),
      confirmationToggle,
      field.terms(),
      screen.getByRole('button', { name: 'términos y condiciones' }),
      submitButton(),
      screen.getByRole('button', { name: 'Google' }),
      screen.getByRole('button', { name: 'Apple' }),
      screen.getByRole('link', { name: 'Inicia sesión' }),
    ];
    for (const element of expected) {
      await userEvent.tab();
      expect(element).toHaveFocus();
    }
  });

  it('FR-019: la contraseña no aparece en el DOM, la URL ni el almacenamiento', async () => {
    const { container } = setup({ kind: 'email-taken' });
    await fillValid();
    await userEvent.click(submitButton());
    await screen.findByText('Ya existe una cuenta con este correo');

    expect(container.textContent).not.toContain('clave-segura');
    expect(window.location.href).not.toContain('clave-segura');
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });

  it('FR-021: vacío y con errores no tiene violaciones de accesibilidad', async () => {
    const { container } = setup();
    await expectNoA11yViolations(container);
    await userEvent.click(submitButton());
    await expectNoA11yViolations(container);
  });
});
