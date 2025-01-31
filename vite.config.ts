import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: 'https://sah-platform-admin-cpdsfdf8dkacfqgy.canadacentral-01.azurewebsites.net/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
  },
});
