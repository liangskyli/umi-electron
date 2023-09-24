# umi plugin electron 基于umi的electron插件

<p>
  <a href="https://github.com/liangskyli/umi-electron/releases">
    <img alt="preview badge" src="https://img.shields.io/github/v/release/liangskyli/umi-electron">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/umijs-plugin-electron">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/umijs-plugin-electron?label=%40liangskyli%2Fumijs-plugin-electron">
  </a>
</p>

> 本插件提供基于umijs的electron的开发及打包，无需修改项目结构，支持 umi@^4,@umijs/max@^4版本

- 项目结构示例 <a href="https://github.com/liangskyli/umi-electron/tree/master/examples">点此访问</a>
- 基于umi4项目结构，插件可自动生成electron相关文件

## 安装:

```bash
pnpm add @liangskyli/umijs-plugin-electron -D
```

- umi4需要手动启用插件

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {},
});
```

- 安装包，配置完成之后，执行以下指令，生成主进程文件和构建命令

```bash
// 使用umi命令
pnpm umi electron init
// 使用@umijs/max命令
pnpm max electron init
```

- package.json里没有安装electron时，默认安装最新版本
- 自动在 package.json 增加以下配置，使用@umijs/max时，命令运行生成会自动把其中的umi修改为max生成

```json5
{
  scripts: {
    'rebuild-deps': 'electron-builder install-app-deps',
    'electron:init': 'umi electron init',
    'electron:dev': 'umi dev electron',
    'electron:dir': 'umi build electron --dir',
    'electron:build:win': 'umi build electron --win',
    'electron:build:mac': 'umi build electron --mac',
    'electron:build:linux': 'umi build electron --linux',
  },
  //这里需要修改成你自己的应用名称和版本号
  name: 'umi_electron_app',
  version: '0.0.1',
}
```

### electron配置参数

| 属性             | 说明                          | 类型                                                                             | 默认值                          |
|----------------|-----------------------------|--------------------------------------------------------------------------------|------------------------------|
| mainSrc        | 主进程src目录                    | `string`                                                                       | `src/main`                   |
| preloadSrc     | preload src目录               | `string`                                                                       | `src/preload`                |
| externals      | node模块                      | `string[]`                                                                     | `[]`                         |
| outputDir      | 打包目录                        | `string`                                                                       | `dist_electron`              |
| routerMode     | 路由模式                        | `'hash' \| 'memory'`                                                           | `hash`                       |
| builderOptions | 打包参数                        | [详见electron-builder配置](https://www.electron.build/configuration/configuration) | `{}`                         |
| debugPort      | 主进程调试端口                     | `number`                                                                       | `5858`                       |
| mainEntry      | mainEntry配置,主应用打包入口文件       | `string`                                                                       | `main.js`                    |
| preloadEntry   | preload配置 key为输入文件名，值为输出文件名 | `{ [key: string]: string }`                                                    | `{'index.ts': 'preload.js'}` |
| viteConfig     | 主进程vite配置                   | `(config: InlineConfig, type: ConfigType) => void;`                            | `() => {}`                   |
| logProcess     | 自定义主进程输出                    | `(log: string, type: LogType) => void;`                                        |                              |

### Electron 版本降级

你可以手动将 package.json 中的 electron 修改至低版本，支持electron最低版本22.0.0

### 开发

```
$ pnpm electron:dev
```

### 打包

- 打包路径不能有中文，electron-builder不能跨平台打包，请在对应系统上打包

```
//windows
$ umi build electron --win
//mac
$ umi build electron --mac
//linux
$ umi build electron --linux
//按平台打包
$ umi build electron --win --ia32    //32位
$ umi build electron --win --x64     //64位
$ umi build electron --win --armv7l  //arm32位
$ umi build electron --win --arm64   //arm64位
```
