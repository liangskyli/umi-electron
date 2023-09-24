import { chalk, execa, fsExtra } from '@umijs/utils';
import path from 'path';
import type { IApi } from 'umi';
import type { ElectronConfig } from '../types';

let npmClient = 'pnpm';

export const commonSrc = 'src/common';

/**
 * 设置npm客户端
 * @param _npmClient
 */
export function setNpmClient(_npmClient?: string) {
  if (_npmClient) {
    npmClient = _npmClient;
  }
}

/**
 * 防抖动，避免方法重复执行
 * @param f 方法
 * @param ms 检测时间
 */
export function debounce(f: () => void, ms: number) {
  let isCoolDown = false;
  return () => {
    if (isCoolDown) return;
    f();
    isCoolDown = true;
    setTimeout(() => (isCoolDown = false), ms);
  };
}

/**
 * 安装开发依赖
 * @param pkgName 依赖名
 */
export function installDevDependencies(pkgName: string) {
  const commandOpts: any = {
    cwd: process.cwd(),
    cleanup: true,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
    env: {
      FORCE_COLOR: 'true',
    },
  };
  switch (npmClient) {
    case 'pnpm':
      execa.execaCommandSync(`pnpm add ${pkgName} -D`, commandOpts);
      break;
    case 'npm':
      execa.execaCommandSync(`npm i ${pkgName} --save-dev`, commandOpts);
      break;
    case 'yarn':
      execa.execaCommandSync(`yarn add ${pkgName} --dev`, commandOpts);
      break;
    default:
      execa.execaCommandSync(`pnpm add ${pkgName} -D`, commandOpts);
      break;
  }
}

/**
 * 获取根项目package.json
 */
export function getRootPkg() {
  const pkg = fsExtra.readJSONSync(path.join(process.cwd(), 'package.json'));
  if (!pkg.devDependencies) {
    pkg.devDependencies = {};
  }
  return pkg;
}

/**
 * 获取依赖目录
 */
export function getNodeModulesPath() {
  return path.join(process.cwd(), 'node_modules');
}

/**
 * 获取主进程目录
 * @param api
 */
export function getMainSrc(api: IApi) {
  const { mainSrc } = api.config.electron as ElectronConfig;
  return path.join(process.cwd(), mainSrc);
}

/**
 * 获取preload目录
 * @param api
 */
export function getPreloadSrc(api: IApi) {
  const { preloadSrc } = api.config.electron as ElectronConfig;
  return path.join(process.cwd(), preloadSrc);
}

export function getCommonSrc() {
  return path.join(process.cwd(), commonSrc);
}

/**
 * 获取开发环境编译目录
 * @param api
 */
export function getDevBuildDir(api: IApi) {
  return path.join(api.paths.absTmpPath!, 'electron');
}

/**
 * 获取打包目录
 * @param api
 */
export function getAbsOutputDir(api: IApi) {
  const { outputDir } = api.config.electron as ElectronConfig;
  return path.join(process.cwd(), outputDir);
}

/**
 * 获取electron打包目录
 * @param api
 */
export function getBuildDir(api: IApi) {
  return path.join(getAbsOutputDir(api), 'electron');
}

/**
 * 获取electron打包目录
 * @param api
 */
export function getBundledDir(api: IApi) {
  return path.join(getAbsOutputDir(api), 'bundled');
}

/**
 * 过滤electron输出
 */
export function filterText(s: string) {
  const lines = s
    .trim()
    .split(/\r?\n/)
    .filter((it) => {
      // https://github.com/electron/electron/issues/4420
      // this warning can be safely ignored
      if (
        it.includes('Couldn\'t set selectedTextBackgroundColor from default ()')
      ) {
        return false;
      }
      if (
        it.includes('Use NSWindow\'s -titlebarAppearsTransparent=YES instead.')
      ) {
        return false;
      }
      if (it.includes('Debugger listening on')) {
        return false;
      }
      return (
        !it.includes(
          'Warning: This is an experimental feature and could change at any time.',
        ) &&
        !it.includes('No type errors found') &&
        !it.includes('webpack: Compiled successfully.')
      );
    });

  if (lines.length === 0) {
    return null;
  }
  return '  ' + lines.join('\n  ') + '\n';
}

export function logProcess(
  label: 'Electron' | 'Renderer' | 'Main',
  log: string | null,
  labelColor: any,
) {
  const LABEL_LENGTH = 28;
  if (log === null || log.length === 0 || log.trim().length === 0) {
    return;
  }

  process.stdout.write(
    labelColor.bold(
      `┏ ${label} ${'-'.repeat(LABEL_LENGTH - label.length - 1)}`,
    ) +
      '\n\n' +
      log +
      '\n' +
      labelColor.bold(`┗ ${'-'.repeat(LABEL_LENGTH)}`) +
      '\n',
  );
}

export function logError(
  label: 'Electron' | 'Renderer' | 'Main',
  error: Error,
) {
  logProcess(label, error.stack || error.toString(), chalk.red);
}

export const getAbsolutePath = (pathName: string) => {
  return path.isAbsolute(pathName)
    ? pathName
    : path.join(process.cwd(), pathName);
};

export const getRelativePath = (
  absolutePath1: string,
  absolutePath2: string,
) => {
  return path.relative(absolutePath1, absolutePath2);
};

const getCommonTsConfigPath = (api: IApi) => {
  const { mainSrc } = api.config.electron as ElectronConfig;
  const commonRelativePath = getRelativePath(
    getAbsolutePath(mainSrc),
    getAbsolutePath(commonSrc),
  );
  return commonRelativePath;
};

export const modifyTsConfigFile = (api: IApi, dir: string) => {
  const commonRelativePath = getCommonTsConfigPath(api);
  const tsconfigPath = path.join(dir, './tsconfig.json');
  let tsconfigData = fsExtra.readFileSync(tsconfigPath, { encoding: 'utf-8' });
  tsconfigData = tsconfigData.replace(
    /{{commonRelativePath}}/gi,
    `${commonRelativePath}/*`,
  );

  fsExtra.writeFileSync(tsconfigPath, tsconfigData);
};
