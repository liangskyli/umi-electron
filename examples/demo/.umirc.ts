import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {
    mainEntry: 'main-entry.js',
    preloadEntry: {
      'index.ts': 'preload-main.js',
    },
  },
});
