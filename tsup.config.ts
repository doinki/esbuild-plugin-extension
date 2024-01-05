import { defineConfig } from 'tsup';

import { extension } from './src/esbuild-plugin-extension';

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ['src/**/*.ts'],
  env: { NODE_ENV: 'production' },
  esbuildPlugins: [extension()],
  format: ['cjs', 'esm'],
  sourcemap: true,
  target: 'es2020',
  treeshake: true,
});
