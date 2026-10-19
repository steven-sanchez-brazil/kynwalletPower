import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    // jsdom arranca lento en equipos con antivirus o proxy; el valor por defecto (5 s) da falsos fallos.
    testTimeout: 20000,
    css: { modules: { classNameStrategy: 'non-scoped' } },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.tsx', 'src/test/**', '**/*.d.ts', '**/*.test.{ts,tsx}'],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
