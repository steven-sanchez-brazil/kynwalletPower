import { render, screen } from '@testing-library/react';
import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('FR-024: compone panel de marca y contenido principal', () => {
    render(
      <AuthScreen brandTitle="Título" brandSubtitle="Descripción">
        <h1>Formulario</h1>
      </AuthScreen>,
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Formulario' }),
    );
  });

  it('permite alinear el contenido de registro con la referencia visual', () => {
    render(
      <AuthScreen contentPosition="registration">
        <h1>Registro</h1>
      </AuthScreen>,
    );

    expect(screen.getByRole('main')).toHaveClass('registrationPanel');
  });
});
