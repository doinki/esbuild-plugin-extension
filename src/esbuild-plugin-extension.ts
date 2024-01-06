import { statSync } from 'node:fs';
import { format, join, parse, sep } from 'node:path';

import { type Plugin } from 'esbuild';

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
}

function removeExtension(path: string): string {
  const parsedPath = parse(path);
  parsedPath.base = parsedPath.name;

  return format(parsedPath);
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
          const path = removeExtension(args.path);

          return isDirectory(join(args.resolveDir, args.path))
            ? {
                external: true,
                path: `${path}${sep}index${ext}`,
              }
            : {
                external: true,
                path: `${path}${ext}`,
              };
        }
      });
    },
  };
}
