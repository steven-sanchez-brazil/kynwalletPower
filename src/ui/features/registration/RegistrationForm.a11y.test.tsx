import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';
import { fillRegistration } from '@/test/registrationForm';
import { expectNoA11yViolations } from '@/test/a11y';
import { controlledPromise } from '@/test/registrationStub';
import type { RegistrationResult } from '@/application/register';

describe('002/US3 · accesibilidad', () => {
  it('teclado, campos etiquetados e instrucciones', async () => {
    render(<RegistrationForm register={vi.fn()} onSuccess={vi.fn()} />);
    const user = userEvent.setup();
    for (const label of ['Nombre completo', 'Correo electrónico', 'Contraseña']) {
      await user.tab();
      expect(screen.getByLabelText(label)).toHaveFocus();
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Mostrar confirmación' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('autocomplete', 'new-password');
  });
  it('axe inicial, errores y envío anunciado', async () => {
    const result = controlledPromise<RegistrationResult>();
    const { container, unmount } = render(
      <main>
        <RegistrationForm register={() => result.promise} onSuccess={vi.fn()} />
      </main>,
    );
    await expectNoA11yViolations(container);
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(container);
    const user = userEvent.setup();
    await fillRegistration(user);
    fireEvent.submit(
      screen.getByRole('button', { name: 'Crear cuenta' }).closest('form') as HTMLFormElement,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Creando cuenta…');
    expect(screen.getByRole('button', { name: 'Creando cuenta…' }).closest('form')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expectNoA11yViolations(container);
    unmount();
    result.resolve({ kind: 'cancelled' });
  });
});
