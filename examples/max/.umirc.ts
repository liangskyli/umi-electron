import { IElectronConfig } from '@liangskyli/umijs-plugin-electron';
import { defineConfig } from '@umijs/max';

const electron: IElectronConfig = {
  routerMode: 'memory',
};
export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: electron,
  history: { type: 'hash' },
});
