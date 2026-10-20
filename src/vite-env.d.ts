/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_USERS?: string;
  readonly VITE_DEMO_REGISTRATION_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
