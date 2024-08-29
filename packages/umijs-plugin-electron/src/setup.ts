import { fsExtra } from '@umijs/utils';
import path from 'node:path';
import type { IApi } from 'umi';
import { getRootPkg, installDevDependencies, setNpmClient } from './utils';

/**
 * 检查环境是否满足运行，不满足则自动配置环境
 * @param api
 */
export default (api: IApi) => {
  //设置npm客户端
  setNpmClient(api.userConfig.npmClient);

  // 根项目node_modules路径
  // const nodeModulesPath = getNodeModulesPath();
  // 依赖安装到根项目
  let rootPkg = getRootPkg();
  // 必须安装的依赖
  const requiredDependencies = ['electron', 'electron-builder'];
  // 需要安装的依赖
  const installDependencies = [];
  for (const dep of requiredDependencies) {
    // 通过package.json检查依赖是否安装
    if (!rootPkg.devDependencies[dep]) {
      installDependencies.push(dep);
    }
  }

  // 安装需要的依赖
  if (installDependencies.length > 0) {
    installDevDependencies(installDependencies.join(' '));
  }

  // 依赖安装到根项目
  /*rootPkg = getRootPkg();

  // 将@types/node切换到electron对应的@types/node
  const electronPackageJson = fsExtra.readJSONSync(
    path.join(nodeModulesPath, 'electron', 'package.json'),
  );
  if (
    electronPackageJson.dependencies['@types/node'] !==
    rootPkg.devDependencies!['@types/node']
  ) {
    const electronTypesNodeVersion =
      electronPackageJson.dependencies['@types/node'];
    installDevDependencies(`@types/node@${electronTypesNodeVersion}`);
  }*/

  // 根项目pkg
  rootPkg = getRootPkg();
  let isUpdateRootPkg = false;

  // electron包名
  if (!rootPkg.name) {
    rootPkg.name = 'umi_electron_app';
    isUpdateRootPkg = true;
  }
  // 版本号
  if (!rootPkg.version) {
    rootPkg.version = '0.0.1';
    isUpdateRootPkg = true;
  }

  // 基于electron重新构建native模块
  if (!rootPkg.scripts['rebuild-deps']) {
    rootPkg.scripts['rebuild-deps'] = 'electron-builder install-app-deps';
    isUpdateRootPkg = true;
  }

  const umiCliName = api.appData.umi.cliName;
  // 复制模板到主进程目录
  if (!rootPkg.scripts['electron:init']) {
    rootPkg.scripts['electron:init'] = `${umiCliName} electron init`;
    isUpdateRootPkg = true;
  }

  // 以开发环境启动electron
  if (!rootPkg.scripts['electron:dev']) {
    rootPkg.scripts['electron:dev'] = `${umiCliName} dev electron`;
    isUpdateRootPkg = true;
  }

  // 打包成文件夹 不封装成安装包
  if (!rootPkg.scripts['electron:dir']) {
    rootPkg.scripts['electron:dir'] = `${umiCliName} build electron --dir`;
    isUpdateRootPkg = true;
  }

  // 打包electron windows平台
  if (!rootPkg.scripts['electron:build:win']) {
    rootPkg.scripts['electron:build:win'] =
      `${umiCliName} build electron --win`;
    isUpdateRootPkg = true;
  }

  // 打包electron mac平台
  if (!rootPkg.scripts['electron:build:mac']) {
    rootPkg.scripts['electron:build:mac'] =
      `${umiCliName} build electron --mac`;
    isUpdateRootPkg = true;
  }

  // 打包electron linux平台
  if (!rootPkg.scripts['electron:build:linux']) {
    rootPkg.scripts['electron:build:linux'] =
      `${umiCliName} build electron --linux`;
    isUpdateRootPkg = true;
  }

  // 更新package.json
  if (isUpdateRootPkg) {
    api.logger.info('update package.json');
    fsExtra.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(rootPkg, null, 2),
    );
  }
};
