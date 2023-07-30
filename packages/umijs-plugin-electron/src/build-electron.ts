import { lodash } from '@umijs/utils';
import type { CliOptions, Configuration } from 'electron-builder';
import { build } from 'electron-builder';

type UserConfig = {
  rawOptions?: CliOptions;
  config: Configuration;
};

export const buildElectron = (userConfig?: UserConfig) => {
  const { rawOptions, config = {} } = userConfig || {};

  const builderConfigMerged: CliOptions = {
    config: lodash.merge(
      {
        dmg: {
          title: '${productName}-${version}',
          artifactName: '${productName}-${version}-${arch}.${ext}',
        },
        nsis: {
          artifactName: '${productName}-setup-${version}.${ext}',
        },
      },
      config,
    ) as Configuration,
    ...rawOptions,
  };

  return build(builderConfigMerged);
};
