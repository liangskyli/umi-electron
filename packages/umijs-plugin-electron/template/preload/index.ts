import { contextBridge } from 'electron';

const apiKey = 'electronAPI';

const api: any = {
  versions: process.versions,
};

contextBridge.exposeInMainWorld(apiKey, api);
