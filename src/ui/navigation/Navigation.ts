export interface Navigation {
  getPath(): string;
  subscribe(listener: () => void): () => void;
  navigate(path: string, mode?: 'push' | 'replace'): void;
}
