import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        '.next/',
        'coverage/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './app/components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/server': path.resolve(__dirname, './server'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/types': path.resolve(__dirname, './types'),
      '@/utils': path.resolve(__dirname, './utils'),
    },
  },
});