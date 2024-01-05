import { statSync } from 'node:fs';
import { join, sep } from 'node:path';

import { type Plugin } from 'esbuild';

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
}

export function extension(): Plugin {
  return {
    name: 'extension',
    setup(build) {
      const ext = build.initialOptions.outExtension?.['.js'];

      build.onResolve({ filter: /.*/ }, (args) => {
        if (
          args.importer &&
          (args.path.startsWith(`..${sep}`) || args.path.startsWith(`.${sep}`))
        ) {
          return isDirectory(join(args.resolveDir, args.path))
            ? {
                external: true,
                path: `${args.path}${sep}index${ext}`,
              }
            : {
                external: true,
                path: `${args.path}${ext}`,
              };
        }
      });
    },
  };
}
