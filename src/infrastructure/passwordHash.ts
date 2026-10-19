import { normalizeEmail } from '@/domain/validation';

/**
 * Genera un resumen SHA-256 unidireccional en hexadecimal usando el correo normalizado como salt.
 * Cumple el Principio V de la Constitución (5.3 y 5.4) y FR-011: nunca persiste contraseñas en texto plano.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  const payload = `${normalizeEmail(email)}:${password}`;
  const bytes = new TextEncoder().encode(payload);
  const buffer = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
