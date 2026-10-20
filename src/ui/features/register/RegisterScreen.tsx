import { BrandPanel } from '@/ui/layout/BrandPanel/BrandPanel';
import { RegisterForm } from './RegisterForm';
import styles from './RegisterScreen.module.css';

export function RegisterScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.brandPanel}>
        <BrandPanel />
      </div>
      <main className={styles.formPanel}>
        <div className={styles.content}>
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
