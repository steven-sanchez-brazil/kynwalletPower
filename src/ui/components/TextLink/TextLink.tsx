import { Link, type LinkProps } from 'react-router';
import styles from './TextLink.module.css';

/** Enlace de navegación con la apariencia de la variante `link` de Button. */
export function TextLink({ className, ...props }: LinkProps) {
  return <Link {...props} className={[styles.link, className].filter(Boolean).join(' ')} />;
}
