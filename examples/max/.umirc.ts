import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {
    routerMode: 'memory',
  },
});
