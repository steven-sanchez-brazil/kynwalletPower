export function navigationStub(initial = '/login') {
  let path = initial;
  const listeners = new Set<() => void>();
  return {
    getPath: () => path,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    navigate(next: string) {
      path = next;
      listeners.forEach((listener) => listener());
    },
  };
}
