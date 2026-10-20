import { createBrowserNavigation } from './browserNavigation';
describe('002/navigation contract', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));
  it('push/replace y popstate notifican; unsubscribe limpia', () => {
    const navigation = createBrowserNavigation();
    const listener = vi.fn();
    const unsubscribe = navigation.subscribe(listener);
    navigation.navigate('/register');
    expect(navigation.getPath()).toBe('/register');
    expect(window.history.state).toBeNull();
    navigation.navigate('/login', 'replace');
    expect(navigation.getPath()).toBe('/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(listener).toHaveBeenCalledTimes(3);
  });
});

it('002/navigation múltiples suscriptores se limpian de forma independiente', () => {
  const navigation = createBrowserNavigation();
  const first = vi.fn();
  const second = vi.fn();
  const stopFirst = navigation.subscribe(first);
  const stopSecond = navigation.subscribe(second);
  navigation.navigate('/register');
  stopFirst();
  navigation.navigate('/login');
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(2);
  stopSecond();
  window.dispatchEvent(new PopStateEvent('popstate'));
  expect(second).toHaveBeenCalledTimes(2);
});
