# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.0-beta.0](https://github.com/liangskyli/umi-electron/compare/v0.3.1...v0.4.0-beta.0) (2024-08-28)


### ⚠ BREAKING CHANGES

* upgrade dependencies,node to v18,pnpm to v9

### Features

* add type commonjs in package.json, vite use await import ([438fb4e](https://github.com/liangskyli/umi-electron/commit/438fb4eef55dcea22ca7e40f8081bc547449d909))


### Miscellaneous Chores

* upgrade dependencies,node to v18,pnpm to v9 ([bf96668](https://github.com/liangskyli/umi-electron/commit/bf96668a6f5228c249736b51d5abd81a147ccfb5))



## [0.3.1](https://github.com/liangskyli/umi-electron/compare/v0.3.0...v0.3.1) (2024-01-23)


### Bug Fixes

* generator tsconfig.json paths @/common/* in windows ([36c5d19](https://github.com/liangskyli/umi-electron/commit/36c5d1998c416b8378d6de3f76c434e577c4df74))



## [0.3.0](https://github.com/liangskyli/umi-electron/compare/v0.2.0...v0.3.0) (2023-09-30)


### Features

* add mainEntry config ([c377976](https://github.com/liangskyli/umi-electron/commit/c377976000aad00eaaf638928f056a2a90e79c4b))
* preload and common file support hrm ([83f6df3](https://github.com/liangskyli/umi-electron/commit/83f6df333aae3ce12de323c65cbe7b27c6577bca))


### Bug Fixes

* preload tsconfig.json replace commonRelativePath error path, remove filterText fn ([822151a](https://github.com/liangskyli/umi-electron/commit/822151ad48a8956c52300ad1f64784aa0eb45280))
* preloadEntry config not merge, replace cover ([173fa68](https://github.com/liangskyli/umi-electron/commit/173fa68c01b12a84d0417fd71af720b29619cdd9))



## [0.2.0](https://github.com/liangskyli/umi-electron/compare/v0.1.2...v0.2.0) (2023-09-16)


### Features

* darwin platform close window use hide window, main window extract independent file ([1eae633](https://github.com/liangskyli/umi-electron/commit/1eae63396e767a5537711d0ae779b3440c17123e))


### Bug Fixes

* main,reload template add independent tsconfig.json ([158de03](https://github.com/liangskyli/umi-electron/commit/158de03a3c00f2bab10aec0c466131fb4ceb446c))



## [0.1.2](https://github.com/liangskyli/umi-electron/compare/v0.1.1...v0.1.2) (2023-09-03)


### Bug Fixes

* peerDependencies electron version ([d1ff766](https://github.com/liangskyli/umi-electron/commit/d1ff766fc1e602db6dcae2151dca2959c8edaa67))



## [0.1.1](https://github.com/liangskyli/umi-electron/compare/v0.1.0...v0.1.1) (2023-08-05)


### Features

* modify doc ([6f2ed90](https://github.com/liangskyli/umi-electron/commit/6f2ed90b1ee8f909a5af2c2c53f023ae6a51f1f3))


### Bug Fixes

* publish add template folder ([2796fa8](https://github.com/liangskyli/umi-electron/commit/2796fa8369345c407646de73dee6755adac47ec6))



## 0.1.0 (2023-08-05)


### Features

* @umijs/max electron demo ([650544c](https://github.com/liangskyli/umi-electron/commit/650544cdd694929170a96da0d2ca65dbcf78435b))
* generate script support @umijs/max, remove routerMode config ([fef28af](https://github.com/liangskyli/umi-electron/commit/fef28afaacc806f8c0d1513960052bca55628007))
* remove IElectronConfig type and electron min package 22.0.0 ([bb6e1f5](https://github.com/liangskyli/umi-electron/commit/bb6e1f521e27dcc2097eb84c459b992c38fa79ee))
* umi electron init ([64b5c6a](https://github.com/liangskyli/umi-electron/commit/64b5c6a761665414459f32004c4025e41e99cc43))
* umi electron support routerMode config for hash or memory ([e4f1378](https://github.com/liangskyli/umi-electron/commit/e4f13789b32e338ae04fb7c7d37881b281839e7b))
