import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {},
});
