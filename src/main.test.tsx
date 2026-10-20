import { createRoot } from 'react-dom/client';
vi.mock('react-dom/client', () => ({ createRoot: vi.fn(() => ({ render: vi.fn() })) }));
describe('002/composición · raíz sin datos de registro persistidos', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_DEMO_USERS', '');
    vi.mocked(createRoot).mockClear();
  });
  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllEnvs();
  });
  it('compone App con dependencias cuando existe root', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);
    await import('./main');
    expect(createRoot).toHaveBeenCalledExactlyOnceWith(root);
    expect(vi.mocked(createRoot).mock.results[0]?.value.render).toHaveBeenCalledOnce();
  });
  it('sin root no intenta montar', async () => {
    await import('./main');
    expect(createRoot).not.toHaveBeenCalled();
  });
});
