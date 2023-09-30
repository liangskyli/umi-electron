import { fsExtra } from '@umijs/utils';
import path from 'path';
import { describe, expect, test } from 'vitest';
import {
  commonSrc,
  getAbsOutputDir,
  getAbsolutePath,
  getBuildDir,
  getBundledDir,
  getCommonSrc,
  getDevBuildDir,
  getMainSrc,
  getPreloadSrc,
  getRelativePath,
  modifyTsConfigFile,
} from '../../src/utils';

describe('utils', () => {
  test('commonSrc,getCommonSrc', () => {
    expect(commonSrc).toBe('src/common');
    expect(getCommonSrc()).toBe(path.join(process.cwd(), 'src/common'));
  });
  test('getMainSrc,getPreloadSrc', () => {
    expect(
      getMainSrc({ config: { electron: { mainSrc: 'src/main' } } } as any),
    ).toBe(path.join(process.cwd(), 'src/main'));
    expect(
      getPreloadSrc({
        config: { electron: { preloadSrc: 'src/preload' } },
      } as any),
    ).toBe(path.join(process.cwd(), 'src/preload'));
  });
  test('getDevBuildDir,getAbsOutputDir', () => {
    expect(
      getDevBuildDir({ paths: { absTmpPath: '/absTmpPath' } } as any),
    ).toBe('/absTmpPath/electron');
    expect(
      getAbsOutputDir({
        config: { electron: { outputDir: 'dist_electron' } },
      } as any),
    ).toBe(path.join(process.cwd(), 'dist_electron'));
  });
  test('getBuildDir,getBundledDir', () => {
    expect(
      getBuildDir({
        config: { electron: { outputDir: 'dist_electron' } },
      } as any),
    ).toBe(path.join(process.cwd(), 'dist_electron/electron'));
    expect(
      getBundledDir({
        config: { electron: { outputDir: 'dist_electron' } },
      } as any),
    ).toBe(path.join(process.cwd(), 'dist_electron/bundled'));
  });
  test('getAbsolutePath', () => {
    expect(getAbsolutePath('/a/b')).toBe('/a/b');
  });
  test('getRelativePath', () => {
    expect(getRelativePath('/a/b', '/a/b/c')).toBe('c');
    expect(getRelativePath('/a/b', '/a')).toBe('..');
    expect(getRelativePath('/a/b/c/d', '/a/b/e')).toBe('../../e');
  });
  test('modifyTsConfigFile', async () => {
    fsExtra.copySync(
      path.join(__dirname, '../../template/main'),
      path.join(__dirname, '../gen-dir/main'),
    );
    modifyTsConfigFile(path.join(__dirname, '../gen-dir/main'));
    await expect(
      fsExtra.readFileSync(
        path.join(__dirname, '../gen-dir/main/tsconfig.json'),
        { encoding: 'utf-8' },
      ),
    ).toMatchFileSnapshot('./__test__snapshots__/main-tsconfig.json');

    fsExtra.copySync(
      path.join(__dirname, '../../template/preload'),
      path.join(__dirname, '../gen-dir/preload'),
    );
    modifyTsConfigFile(path.join(__dirname, '../gen-dir/preload'));
    await expect(
      fsExtra.readFileSync(
        path.join(__dirname, '../gen-dir/preload/tsconfig.json'),
        { encoding: 'utf-8' },
      ),
    ).toMatchFileSnapshot('./__test__snapshots__/preload-tsconfig.json');
  });
});
