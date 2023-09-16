import { chalk, fsExtra, lodash } from '@umijs/utils';
import { configureBuildCommand } from 'electron-builder/out/builder';
import * as path from 'path';
import type { IApi } from 'umi';
import yargs from 'yargs';
import { buildElectron } from './build-electron';
import { runBuild, runDev } from './compile';
import externalPackages from './external-packages.config';
import setup from './setup';
import type { ElectronConfig, LogType } from './types';
import {
  commonSrc,
  getAbsOutputDir,
  getBuildDir,
  getBundledDir,
  getMainSrc,
  getPreloadSrc,
  getRootPkg,
  logProcess,
  modifyTsConfigFile,
} from './utils';

const defaultConfig: ElectronConfig = {
  mainSrc: 'src/main',
  preloadSrc: 'src/preload',
  builderOptions: {},
  externals: [],
  outputDir: 'dist_electron',
  routerMode: 'hash',
  debugPort: 5858,
  preloadEntry: {
    'index.ts': 'preload.js',
  },
  viteConfig: () => {},
  //mainWebpackChain: () => {},
  logProcess: (log: string, type: LogType) => {
    if (type === 'normal') {
      logProcess('Main', log, chalk.blue);
    } else if (type === 'error') {
      logProcess('Main', log, chalk.red);
    }
  },
};

export default function (api: IApi) {
  // 配置
  api.describe({
    key: 'electron',
    config: {
      schema({ zod }) {
        return zod.object({
          mainSrc: zod.string().optional(),
          preloadSrc: zod.string().optional(),
          outputDir: zod.string().optional(),
          externals: zod.string().array().optional(),
          builderOptions: zod.record(zod.string(), zod.any()).optional(),
          routerMode: zod.enum(['hash', 'memory']).optional(),
          debugPort: zod.number().optional(),
          preloadEntry: zod.record(zod.string(), zod.string()).optional(),
          viteConfig: zod
            .function()
            .args(zod.any(), zod.enum(['main', 'preload']))
            .returns(zod.void())
            .optional(),
          logProcess: zod
            .function()
            .args(zod.string(), zod.enum(['normal', 'error']))
            .returns(zod.void())
            .optional(),
        });
      },
      default: defaultConfig,
    },
    enableBy: () => !!api.userConfig.electron,
  });

  // 检测主进程相关文件是否存在,不存在则复制模板到主进程目录
  function copyMainProcess() {
    const mainSrc = getMainSrc(api);
    if (!fsExtra.pathExistsSync(mainSrc)) {
      fsExtra.copySync(
        path.join(__dirname, '..', 'template', 'main'),
        mainSrc,
        {
          overwrite: true,
        },
      );
      modifyTsConfigFile(api, mainSrc);
    }

    const preloadSrc = getPreloadSrc(api);
    if (!fsExtra.pathExistsSync(preloadSrc)) {
      fsExtra.copySync(
        path.join(__dirname, '..', 'template', 'preload'),
        preloadSrc,
        { overwrite: true },
      );
      modifyTsConfigFile(api, preloadSrc);
    }
  }

  //初始化模板
  api.registerCommand({
    name: 'electron',
    fn({ args }) {
      const arg = args._[0];
      if (arg === 'init') {
        // 检查环境并安装配置
        setup(api);
        copyMainProcess();
      }
    },
  });

  const isElectron = api.args?._[0] === 'electron';
  if (!isElectron) {
    return;
  }

  api.modifyConfig((oldConfig) => {
    const config = lodash.merge({ electron: defaultConfig }, oldConfig);

    const { outputDir, externals, routerMode } =
      config.electron as ElectronConfig;
    config.outputPath = path.join(outputDir, 'bundled');
    config.alias = config.alias || {};
    config.alias['@/common'] = path.join(process.cwd(), commonSrc);

    config.history = config.history || {
      type: routerMode,
    };
    config.history.type = routerMode;

    const configExternals: any = {
      electron: 'require(\'electron\')',
    };

    if (externals.length > 0) {
      for (const moduleName of externals) {
        configExternals[moduleName] = `require('${moduleName}')`;
      }
    }

    config.externals = { ...configExternals, ...config.externals };
    return config;
  });

  // start dev electron
  api.onDevCompileDone(async ({ isFirstCompile }) => {
    if (!isFirstCompile) {
      return;
    }
    await runDev(api);
  });

  /**
   * 打包
   */
  async function buildDist() {
    const { externals } = api.config.electron as ElectronConfig;

    const absOutputDir = getAbsOutputDir(api);
    const buildPkg = getRootPkg();
    buildPkg.main = 'main.js';

    delete buildPkg.scripts;
    delete buildPkg.devDependencies;

    //删除不需要的依赖
    Object.keys(buildPkg.dependencies!).forEach((dependency) => {
      if (
        !externals.includes(dependency) &&
        !externalPackages.includes(dependency)
      ) {
        delete buildPkg.dependencies![dependency];
      }
    });

    externals.forEach((external) => {
      if (!buildPkg.dependencies![external]) {
        buildPkg.dependencies![external] = require(
          path.join(process.cwd(), 'node_modules', external, 'package.json'),
        )?.version;
      }
    });

    const buildDir = getBuildDir(api);

    fsExtra.copySync(buildDir, getBundledDir(api), { overwrite: true });
    fsExtra.rmSync(buildDir, { recursive: true, force: true });

    // Prevent electron-builder from installing app deps
    fsExtra.ensureDirSync(`${absOutputDir}/bundled/node_modules`);

    fsExtra.writeFileSync(
      `${absOutputDir}/bundled/package.json`,
      JSON.stringify(buildPkg, null, 2),
    );
  }

  // build electron
  api.onBuildComplete(async ({ err }) => {
    if (err) {
      return;
    }

    await runBuild(api);
    await buildDist();
  });

  api.onBuildHtmlComplete(async () => {
    const { builderOptions } = api.config.electron as ElectronConfig;
    const absOutputDir = getAbsOutputDir(api);

    api.logger.info('build electron begin');
    const builderArgs = yargs
      .command(['build', '*'], 'Build', configureBuildCommand)
      .parse(process.argv);
    const userConfig: Parameters<typeof buildElectron>[0] = {
      rawOptions: builderArgs as any,
      config: {
        files: ['**'],
        extends: null,
        ...builderOptions,
        directories: {
          output: absOutputDir,
          app: `${absOutputDir}/bundled`,
        },
      },
    };

    await buildElectron(userConfig);
    api.logger.info('build electron success');
  });
}
