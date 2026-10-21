import { useEffect, useRef } from 'react';
import terms from '../../../../specs/002-registro/terminos-y-condiciones.md?raw';
import styles from './TermsView.module.css';

type TermsViewProps = { onClose: () => void };

function renderBlock(block: string, index: number) {
  const clean = block.replace(/\*\*|`/g, '').trim();
  if (clean === '---') return <hr key={index} />;
  if (clean.startsWith('# ')) return <h2 key={index}>{clean.slice(2)}</h2>;
  if (clean.startsWith('## ')) return <h3 key={index}>{clean.slice(3)}</h3>;
  return <p key={index}>{clean}</p>;
}

/** Visor de la fuente Markdown aprobada; no copia el texto a un segundo archivo. */
export function TermsView({ onClose }: TermsViewProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Términos y condiciones"
      >
        <div className={styles.toolbar}>
          <span>Términos y condiciones</span>
          <button ref={closeRef} type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <article className={styles.content}>
          {terms
            .split(/\r?\n\s*\r?\n/)
            .filter(Boolean)
            .map(renderBlock)}
        </article>
      </section>
    </div>
  );
}
