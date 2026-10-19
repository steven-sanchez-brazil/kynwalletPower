import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

/** Renderiza dentro de un MemoryRouter; `route` es la ruta inicial. */
export function renderWithRouter(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
