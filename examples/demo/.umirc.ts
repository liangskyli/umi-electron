import { IElectronConfig } from '@liangskyli/umijs-plugin-electron';
import { defineConfig } from 'umi';

const electron: IElectronConfig = {};
export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: electron,
});
