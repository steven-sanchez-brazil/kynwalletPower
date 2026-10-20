import type { RegistrationSimulation } from '@/application/ports/RegistrationSimulation';
export class LocalRegistrationSimulation implements RegistrationSimulation {
  complete(signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Cancelled', 'AbortError'));
        return;
      }
      const cancel = () => {
        clearTimeout(timer);
        cleanup();
        reject(new DOMException('Cancelled', 'AbortError'));
      };
      const cleanup = () => signal.removeEventListener('abort', cancel);
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, 300);
      signal.addEventListener('abort', cancel, { once: true });
    });
  }
}
