import type { Configuration } from 'electron-builder';
import type { InlineConfig } from 'vite';

export type ConfigType = 'main' | 'preload';

export type LogType = 'normal' | 'error';

export type RouterMode = 'hash' | 'memory' | 'browser';

export interface ElectronConfig {
  // 主进程src目录
  mainSrc: string;
  // preload src目录
  preloadSrc: string;
  // node模块
  externals: string[];
  // 打包目录
  outputDir: string;
  // 打包参数
  builderOptions: Configuration;
  // 路由模式
  routerMode: RouterMode;
  // 调试端口
  debugPort: number;
  // preload配置 key为输入文件名，值为输出文件名
  preloadEntry: { [key: string]: string };
  // 主进程vite配置
  viteConfig: (config: InlineConfig, type: ConfigType) => void;
  //自定义主进程输出
  logProcess: (log: string, type: LogType) => void;
}
