import { MESSAGES } from '@/domain/messages';
import { TextLink } from '@/ui/components/TextLink/TextLink';
import styles from './NotFoundScreen.module.css';

/** Vista para rutas desconocidas: no se confunde con el registro ni altera las cuentas. */
export function NotFoundScreen() {
  return (
    <main className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>{MESSAGES.NOT_FOUND_TITLE}</h1>
        <TextLink to="/login">{MESSAGES.NOT_FOUND_LINK}</TextLink>
      </div>
    </main>
  );
}
