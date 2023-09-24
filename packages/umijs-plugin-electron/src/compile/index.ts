import { chokidar, fsExtra } from '@umijs/utils';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import path from 'path';
import type { IApi } from 'umi';
import { build as viteBuild } from 'vite';
import type { ElectronConfig } from '../types';
import {
  debounce,
  filterText,
  getCommonSrc,
  getDevBuildDir,
  getMainSrc,
  getNodeModulesPath,
  getPreloadSrc,
} from '../utils';
import { getMainViteConfig, getPreloadViteConfig } from './vite';

const TIMEOUT = 500;

const buildMain = (api: IApi) => {
  return viteBuild(getMainViteConfig(api));
};

const buildPreload = (api: IApi): Promise<any> => {
  const { preloadEntry } = api.config.electron as ElectronConfig;

  //preload目录存在才编译
  if (fsExtra.pathExistsSync(getPreloadSrc(api))) {
    const tasks: Promise<any>[] = [];
    Object.keys(preloadEntry).forEach((inputFileName) => {
      tasks.push(
        viteBuild(
          getPreloadViteConfig(api, inputFileName, preloadEntry[inputFileName]),
        ),
      );
    });
    return Promise.all(tasks);
  }
  return Promise.resolve();
};

const isRunPreload = (api: IApi, absPath: string) => {
  let isRunPreload = false;
  const { preloadEntry } = api.config.electron as ElectronConfig;
  Object.keys(preloadEntry).forEach((inputFileName) => {
    if (
      absPath === path.join(getDevBuildDir(api), preloadEntry[inputFileName])
    ) {
      isRunPreload = true;
    }
  });
  return isRunPreload;
};

/**
 * 以开发模式运行
 * @param api
 */
export const runDev = async (api: IApi) => {
  const { logProcess, debugPort } = api.config.electron as ElectronConfig;
  const electronPath = require(path.join(getNodeModulesPath(), 'electron'));
  let spawnProcess: ChildProcessWithoutNullStreams | null = null;

  const runMain = () => {
    if (spawnProcess !== null) {
      spawnProcess.kill('SIGKILL');
      spawnProcess = null;
    }

    spawnProcess = spawn(String(electronPath), [
      `--inspect=${debugPort}`,
      path.join(getDevBuildDir(api), 'main.js'),
    ]);
    spawnProcess.stdout.on('data', (data) => {
      const log = filterText(data.toString());
      if (log) {
        logProcess(log, 'normal');
      }
    });
    spawnProcess.stderr.on('data', (data) => {
      const log = filterText(data.toString());
      if (log) {
        logProcess(log, 'error');
      }
    });
    spawnProcess.on('close', (code, signal) => {
      if (signal !== 'SIGKILL') {
        process.exit(-1);
      }
    });

    return spawnProcess;
  };

  const runMainDebounced = debounce(() => runMain(), TIMEOUT);

  const buildMainDebounced = debounce(() => buildMain(api), TIMEOUT);

  const buildPreloadDebounced = debounce(() => buildPreload(api), TIMEOUT);

  const runPreload = () => {
    // preload change restart main
    runMain();
  };

  const runPreloadDebounced = debounce(() => runPreload(), TIMEOUT);

  // 启动electron前编译主进程
  await Promise.all([buildMain(api), buildPreload(api)]);

  const watcher = chokidar.watch(
    [
      `${getCommonSrc()}/**`,
      `${getMainSrc(api)}/**`,
      `${getPreloadSrc(api)}/**`,
      `${getDevBuildDir(api)}/**`,
    ],
    { ignoreInitial: true },
  );

  watcher
    .on('unlink', (path) => {
      if (spawnProcess !== null && path.includes(getDevBuildDir(api))) {
        spawnProcess.kill('SIGINT');
        spawnProcess = null;
      }
    })
    .on('add', (absPath) => {
      if (absPath.includes(getDevBuildDir(api))) {
        return runMainDebounced();
      }
    })
    .on('change', (absPath) => {
      if (absPath.includes(getCommonSrc())) {
        buildMainDebounced();
        buildPreloadDebounced();
        return;
      }
      if (absPath.includes(getMainSrc(api))) {
        buildMainDebounced();
        return;
      }

      if (absPath === path.join(getDevBuildDir(api), 'main.js')) {
        runMainDebounced();
        return;
      }

      if (absPath.includes(getPreloadSrc(api))) {
        buildPreloadDebounced();
        return;
      }

      if (isRunPreload(api, absPath)) {
        return runPreloadDebounced();
      }
    });

  await runMainDebounced();
};

/**
 * 打包
 * @param api
 */
export const runBuild = async (api: IApi) => {
  await buildMain(api);
  await buildPreload(api);
};
