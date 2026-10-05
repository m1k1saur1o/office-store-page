import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En producción (build y preview) el sitio vive en https://m1k1saur1o.github.io/office-store-page/
// En desarrollo se mantiene en la raíz, por lo que fetch apunta a /data/products.json
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/office-store-page/' : '/'
}));
