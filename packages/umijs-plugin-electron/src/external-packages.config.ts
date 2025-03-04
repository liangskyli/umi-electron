import { builtinModules } from 'node:module';

/**
 By default, vite optimizes and packs all the necessary dependencies into your bundle,
 so there is no need to supply them in your application as a node module.
 Unfortunately, vite cannot optimize any dependencies:
 Some that are designed for a node environment may not work correctly after optimization.
 Therefore, such dependencies should be marked as "external":
 they will not be optimized, will not be included in your bundle, and will be delivered as a separate node module.
 */
export const external = ['electron', 'electron-updater'];

export const builtins = builtinModules.filter((e) => !e.startsWith('_'));
export const builtinsWithNode = builtins.map((item) => `node:${item}`);

export const libExternal = ['webpack', 'glob'];

export default [...builtins, ...builtinsWithNode, ...external, ...libExternal];
