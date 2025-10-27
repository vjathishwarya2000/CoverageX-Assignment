import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';   // ⬅️ from vitest/config



export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    css: true,               // let RTL render styles without errors
    globals: true,           // use `describe/it/expect` without imports
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['src/main.tsx', 'src/types.tsx']
    }
  }
});
