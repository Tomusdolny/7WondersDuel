import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@7ww/shared': path.resolve(rootDir, '../shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
