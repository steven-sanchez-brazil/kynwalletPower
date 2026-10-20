import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RegisterScreen } from './RegisterScreen';

describe('RegisterScreen · US6 Layout responsivo', () => {
  it('renderiza el panel de marca y el contenedor principal con sus hijos', () => {
    render(
      <RegisterScreen>
        <div>Formulario de prueba</div>
      </RegisterScreen>,
    );

    expect(screen.getByText(/Tu dinero/i)).toBeInTheDocument();
    expect(screen.getByText(/sin fronteras/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Formulario de prueba')).toBeInTheDocument();
  });
});
