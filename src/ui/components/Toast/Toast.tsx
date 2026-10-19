import { useEffect } from 'react';
import { MESSAGES } from '@/domain/messages';
import styles from './Toast.module.css';

export type ToastTone = 'brand' | 'success';

export type ToastProps = {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
  onDismiss: () => void;
};

const DEFAULT_DURATION_MS = 3000;

function resolveTone(message: string, explicitTone?: ToastTone): ToastTone {
  if (explicitTone) return explicitTone;
  if (message === MESSAGES.OPERATION_SUCCESS || message === MESSAGES.ALIAS_COPIED) {
    return 'success';
  }
  return 'brand';
}

/**
 * Notificación temporal tipo Toast estilo react-toastify (position="top-center", theme="colored"),
 * respetando la paleta actual de colores de KynWallet y contraste WCAG 2.1 AA (FR-013, FR-016).
 */
export function Toast({ message, tone, durationMs = DEFAULT_DURATION_MS, onDismiss }: ToastProps) {
  const activeTone = resolveTone(message, tone);

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  const toneClass = activeTone === 'success' ? styles.toneSuccess : styles.toneBrand;

  return (
    <div
      role="status"
      aria-live="polite"
      data-position="top-center"
      data-tone={activeTone}
      className={[styles.toast, toneClass].join(' ')}
    >
      <div className={styles.body}>
        <span className={styles.icon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {activeTone === 'success' ? (
              <path
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.58 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                fill="currentColor"
              />
            )}
          </svg>
        </span>
        <span className={styles.text}>{message}</span>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Cerrar notificación"
          onClick={onDismiss}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div
        className={styles.progressBar}
        style={{ animationDuration: `${durationMs}ms` }}
        aria-hidden="true"
      />
    </div>
  );
}
