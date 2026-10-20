import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegisterStub } from '@/test/registerStub';
import { RegisterForm } from './RegisterForm';
import { RegisterScreen } from './RegisterScreen';

describe('RegisterScreen · Accesibilidad WCAG 2.1 AA (T039, FR-017, SC-005)', () => {
  it('pantalla de registro en estado inicial sin violaciones', async () => {
    const { container } = render(
      <RegisterScreen>
        <RegisterForm register={createRegisterStub().register} onNavigateToLogin={vi.fn()} />
      </RegisterScreen>,
    );

    await expectNoA11yViolations(container);
  });

  it('pantalla de registro con errores de validación inline sin violaciones', async () => {
    const { container } = render(
      <RegisterScreen>
        <RegisterForm register={createRegisterStub().register} onNavigateToLogin={vi.fn()} />
      </RegisterScreen>,
    );

    // Activar errores inline enviando el formulario vacío
    await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('pantalla de registro con aviso social sin violaciones', async () => {
    const { container } = render(
      <RegisterScreen>
        <RegisterForm register={createRegisterStub().register} onNavigateToLogin={vi.fn()} />
      </RegisterScreen>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    expect(screen.getByText('Próximamente')).toBeInTheDocument();

    await expectNoA11yViolations(container);
  });
});
