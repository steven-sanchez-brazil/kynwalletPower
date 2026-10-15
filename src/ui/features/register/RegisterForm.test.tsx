import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { MESSAGES } from '@/domain/messages';
import { expectNoA11yViolations } from '@/test/a11y';
import { VALID_REGISTRATION } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { RegisterForm } from './RegisterForm';

function setup(stub = createRegisterStub()) {
  const user = userEvent.setup();
  const onRegistered = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <RegisterForm register={stub.register} onRegistered={onRegistered} />
    </MemoryRouter>,
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
    await user.type(fields.fullName, VALID_REGISTRATION.fullName);
    await user.type(fields.email, VALID_REGISTRATION.email);
    await user.type(fields.password, VALID_REGISTRATION.password);
    await user.type(fields.confirmPassword, VALID_REGISTRATION.confirmPassword);
    await user.click(fields.terms);
  };
  return { user, stub, container, fields, submit, fillValid, onRegistered };
}

describe('RegisterForm · US1 Crear una cuenta con datos válidos', () => {
  it('US1-1: un registro exitoso avisa a la página para redirigir (sin vista de bienvenida)', async () => {
    const { fillValid, submit, onRegistered } = setup();
    await fillValid();
    await submit();
    await waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
    expect(screen.queryByRole('heading', { name: /Bienvenido/ })).not.toBeInTheDocument();
  });

  it('US1-2: durante la espera el botón está ocupado y no admite reenvíos', async () => {
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

  it('US1-3: el correo con mayúsculas y espacios llega al caso de uso', async () => {
    const { user, stub, fields, submit } = setup();
    await user.type(fields.fullName, VALID_REGISTRATION.fullName);
    await user.type(fields.email, ' Nueva.Persona@Example.TEST ');
    await user.type(fields.password, VALID_REGISTRATION.password);
    await user.type(fields.confirmPassword, VALID_REGISTRATION.confirmPassword);
    await user.click(fields.terms);
    await submit();
    expect(stub.register).toHaveBeenCalledWith(
      expect.objectContaining({
        email: expect.stringMatching(/^\s*nueva\.persona@example\.test\s*$/i),
      }),
    );
  });

  it('US1-4: Enter en el último campo envía el formulario', async () => {
    const { user, stub, fields, fillValid, onRegistered } = setup();
    await fillValid();
    await user.click(fields.confirmPassword);
    await user.keyboard('{Enter}');
    expect(stub.register).toHaveBeenCalledOnce();
    await waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
  });

  it('FR-020: sin violaciones de accesibilidad en el formulario inicial', async () => {
    const { container } = setup();
    await expectNoA11yViolations(container);
  });
});

describe('RegisterForm · US2 Error cuando la cuenta no puede crearse', () => {
  it('US2-1: rejected muestra el error genérico en un alert y no redirige', async () => {
    const { fillValid, submit, container, onRegistered } = setup(
      createRegisterStub({ kind: 'rejected' }),
    );
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.REGISTRATION_REJECTED);
    expect(onRegistered).not.toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it('US2-2: el mensaje desaparece al editar un campo', async () => {
    const { user, fields, fillValid, submit } = setup(createRegisterStub({ kind: 'rejected' }));
    await fillValid();
    await submit();
    await screen.findByRole('alert');
    await user.type(fields.email, 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('US2-3: foco en el correo y contraseñas vacías, datos conservados', async () => {
    const { fields, fillValid, submit } = setup(createRegisterStub({ kind: 'rejected' }));
    await fillValid();
    await submit();
    await screen.findByRole('alert');
    expect(fields.email).toHaveFocus();
    expect(fields.email).toHaveValue(VALID_REGISTRATION.email);
    expect(fields.fullName).toHaveValue(VALID_REGISTRATION.fullName);
    expect(fields.password).toHaveValue('');
    expect(fields.confirmPassword).toHaveValue('');
    expect(fields.terms).toBeChecked();
  });

  it('US2-4: unavailable muestra el mensaje sin detalles y permite reintentar', async () => {
    const { fields, fillValid, submit } = setup(createRegisterStub({ kind: 'unavailable' }));
    await fillValid();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.REGISTRATION_UNAVAILABLE);
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
    expect(fields.email).toHaveValue(VALID_REGISTRATION.email);
  });
});

describe('RegisterForm · US3 Validar los campos antes de enviar', () => {
  it('US3-1: enviar vacío muestra todos los mensajes y no invoca el caso de uso', async () => {
    const { stub, submit, container } = setup();
    await submit();
    expect(screen.getByText(MESSAGES.NAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.EMAIL_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.REGISTER_PASSWORD_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.CONFIRM_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.TERMS_REQUIRED)).toBeInTheDocument();
    expect(stub.register).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
    await expectNoA11yViolations(container);
  });

  it('US3-2: nombre inválido', async () => {
    const { user, fields } = setup();
    await user.type(fields.fullName, 'Ana1');
    await user.tab();
    expect(screen.getByText(MESSAGES.NAME_INVALID)).toBeInTheDocument();
  });

  it('US3-3: correo inválido', async () => {
    const { user, fields } = setup();
    await user.type(fields.email, 'usuario@');
    await user.tab();
    expect(screen.getByText(MESSAGES.EMAIL_INVALID)).toBeInTheDocument();
  });

  it('US3-4: contraseña débil', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, 'abcdefgh');
    await user.tab();
    expect(screen.getByText(MESSAGES.REGISTER_PASSWORD_WEAK)).toBeInTheDocument();
  });

  it('US3-5: las contraseñas no coinciden', async () => {
    const { user, fields } = setup();
    await user.type(fields.password, 'clave-segura-1');
    await user.type(fields.confirmPassword, 'clave-segura-2');
    await user.tab();
    expect(screen.getByText(MESSAGES.CONFIRM_MISMATCH)).toBeInTheDocument();
  });

  it('US3-6: términos sin marcar bloquean el envío', async () => {
    const { user, stub, fields, submit } = setup();
    await user.type(fields.fullName, VALID_REGISTRATION.fullName);
    await user.type(fields.email, VALID_REGISTRATION.email);
    await user.type(fields.password, VALID_REGISTRATION.password);
    await user.type(fields.confirmPassword, VALID_REGISTRATION.confirmPassword);
    await submit();
    expect(screen.getByText(MESSAGES.TERMS_REQUIRED)).toBeInTheDocument();
    expect(fields.terms).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
  });

  it('US3-7: el mensaje desaparece al corregir', async () => {
    const { user, fields } = setup();
    await user.type(fields.email, 'usuario@');
    await user.tab();
    await user.clear(fields.email);
    await user.type(fields.email, VALID_REGISTRATION.email);
    expect(screen.queryByText(MESSAGES.EMAIL_INVALID)).not.toBeInTheDocument();
  });

  it('US3-8: cada campo con error expone aria-invalid y aria-describedby', async () => {
    const { fields, submit } = setup();
    await submit();
    for (const [name, message] of [
      [fields.fullName, MESSAGES.NAME_REQUIRED],
      [fields.email, MESSAGES.EMAIL_REQUIRED],
      [fields.password, MESSAGES.REGISTER_PASSWORD_REQUIRED],
      [fields.confirmPassword, MESSAGES.CONFIRM_REQUIRED],
      [fields.terms, MESSAGES.TERMS_REQUIRED],
    ] as const) {
      expect(name).toHaveAttribute('aria-invalid', 'true');
      expect(name).toHaveAccessibleDescription(message);
    }
  });
});

describe('RegisterForm · US4 Mostrar u ocultar las contraseñas', () => {
  it('US4-1..3: dos controles independientes, con aria-pressed y operables con teclado', async () => {
    const { user, fields } = setup();
    const toggles = screen.getAllByRole('button', { name: 'Mostrar contraseña' });
    expect(toggles).toHaveLength(2);
    expect(toggles[0]).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggles[0] as HTMLElement);
    expect(fields.password).toHaveAttribute('type', 'text');
    expect(fields.confirmPassword).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    (toggles[1] as HTMLElement).focus();
    await user.keyboard('{Enter}');
    expect(fields.confirmPassword).toHaveAttribute('type', 'text');
    await user.keyboard(' ');
    expect(fields.confirmPassword).toHaveAttribute('type', 'password');
  });
});

describe('RegisterForm · US5 Elementos fuera del alcance', () => {
  it.each([
    ['términos y condiciones', MESSAGES.FEATURE_UNAVAILABLE],
    ['Google', MESSAGES.COMING_SOON],
    ['Apple', MESSAGES.COMING_SOON],
  ] as const)(
    'US5-1/US5-2: "%s" muestra "%s" en la página y conserva los datos',
    async (name, message) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      const { user, fields } = setup();
      await user.type(fields.fullName, 'Ana');
      await user.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('status')).toHaveTextContent(message);
      expect(alert).not.toHaveBeenCalled();
      expect(fields.fullName).toHaveValue('Ana');
      expect(fields.terms).not.toBeChecked();
    },
  );
});

describe('RegisterForm · US6 Ir a la pantalla de inicio de sesión (FR-022)', () => {
  it('US6-1: "Inicia sesión" es un enlace a /login', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: 'Inicia sesión' })).not.toBeInTheDocument();
  });

  it('US6-2: se alcanza con Tab justo después de "Apple"', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Apple' }).focus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveFocus();
  });
});

describe('RegisterForm · datos sensibles (FR-015)', () => {
  it('tras un envío, ni el almacenamiento ni la consola contienen la contraseña', async () => {
    const spies = (['log', 'info', 'warn', 'error'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const { fillValid, submit, onRegistered } = setup();
    await fillValid();
    await submit();
    await waitFor(() => expect(onRegistered).toHaveBeenCalledOnce());
    expect(JSON.stringify(onRegistered.mock.calls)).not.toContain(VALID_REGISTRATION.password);
    expect(JSON.stringify({ ...localStorage })).not.toContain(VALID_REGISTRATION.password);
    expect(JSON.stringify({ ...sessionStorage })).not.toContain(VALID_REGISTRATION.password);
    for (const spy of spies) {
      expect(JSON.stringify(spy.mock.calls)).not.toContain(VALID_REGISTRATION.password);
    }
  });
});
