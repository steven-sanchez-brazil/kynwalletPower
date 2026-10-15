import { useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';

export const TOAST_DURATION_MS = 5000;

type ToastProps = {
  /** Texto del aviso; `null` deja la región de estado vacía. */
  message: string | null;
  onClose: () => void;
};

/**
 * Aviso emergente temporal (research 002 R11). La región `role="status"` existe siempre para que
 * el texto se anuncie al aparecer; el tiempo se pausa con el puntero o el foco (WCAG 2.2.1).
 */
export function Toast({ message, onClose }: ToastProps) {
  return (
    <div role="status" className={styles.region}>
      {message && <ToastCard key={message} message={message} onClose={onClose} />}
    </div>
  );
}

function ToastCard({ message, onClose }: { message: string; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const remainingMs = useRef(TOAST_DURATION_MS);

  useEffect(() => {
    if (paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(onClose, remainingMs.current);
    return () => {
      clearTimeout(timer);
      remainingMs.current -= Date.now() - startedAt;
    };
  }, [paused, onClose]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <div
      data-toast
      className={styles.toast}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="10" />
        <path d="M5.5 10.5l3 3 6-6.5" />
      </svg>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.close} aria-label="Cerrar aviso" onClick={onClose}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
