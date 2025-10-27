import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';   



export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    css: true,               
    globals: true,           
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['src/main.tsx', 'src/types.tsx']
    }
  }
});
