import { createMainWindow } from '@/main-window';
import { app, protocol } from 'electron';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
    },
  },
]);

app.whenReady().then(() => {
  createMainWindow();
});
