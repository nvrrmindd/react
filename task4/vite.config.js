import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Source lives in src/, the build is written next to package.json
// so GitHub Pages serves it at /react/taskN/index.html
export default defineConfig({
  root: 'src',
  plugins: [react()],
  base: './',
  build: {
    outDir: '..',
    emptyOutDir: false,
  },
});
