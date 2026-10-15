import { Link, type LinkProps } from 'react-router';
import buttonStyles from '../Button/Button.module.css';
import styles from './TextLink.module.css';

/** Enlace de navegación interna con la apariencia del botón de enlace (research.md R10). */
export function TextLink({ className, ...rest }: LinkProps) {
  const classes = [buttonStyles.button, buttonStyles.link, styles.textLink, className]
    .filter(Boolean)
    .join(' ');
  return <Link {...rest} className={classes} />;
}
